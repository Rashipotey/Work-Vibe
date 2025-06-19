require("dotenv").config();
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { default: fetch } = require("node-fetch");
const { pipeline } = require("node:stream/promises");

if (!global._firebaseInitialized) {
  initializeApp({ credential: applicationDefault() });
  global._firebaseInitialized = true;
}

const db = getFirestore();
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};

module.exports.recommendForYou = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  try {
    const userId = event.queryStringParameters?.userId;
    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing userId" }),
      };
    }

    const promptsSnap = await db.collection("curatedPrompts").where("userId", "==", userId).get();
    const seenPlaces = new Set();
    const promptList = [];

    promptsSnap.forEach(doc => {
      const data = doc.data();
      data.geminiResponse?.forEach(place => seenPlaces.add(place));
      promptList.push(data.originalPrompt);
    });

    const allLocSnap = await db.collection("locations").get();
    const unseenRelevant = [];

    for (const doc of allLocSnap.docs) {
      const loc = doc.data();
      if (seenPlaces.has(loc.locationName)) continue;

      const tagsText = loc.selectedVibes?.join(" ") ?? "";
      const relevancePrompt = `Is the location with tags: [${tagsText}] similar to any of these prompts: ${promptList.join(
        ", "
      )}? Only answer 'yes' or 'no'.`;

      const geminiCheck = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: relevancePrompt }] }],
          }),
        }
      );

      const geminiData = await geminiCheck.json();
      const responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (responseText.toLowerCase().includes("yes")) {
        unseenRelevant.push(loc);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ recommendations: unseenRelevant }),
    };

  } catch (err) {
    console.error("Recommendation error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || "Internal Server Error" }),
    };
  }
};
