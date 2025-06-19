require("dotenv").config();
const fetch = require("node-fetch");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};

function extractCityNames(rawText) {
  if (!rawText) return [];

  const lines = rawText.split("\n").map(line => line.trim()).filter(Boolean);
  const cityNames = [];

  for (const line of lines) {
    const match =
      line.match(/^\d+\.\s\*\*(.+?)\*\*[:\-–]?\s?/) || // **City**
      line.match(/^\d+\.\s(.+?)[:\-–]\s?/);           // 1. City: or 1. City -

    if (match && match[1]) {
      cityNames.push(match[1].trim());
    }
  }

  return cityNames;
}

module.exports.askGemini = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "CORS preflight successful" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const prompt = body.prompt;

    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing prompt" }),
      };
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await geminiRes.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    const formatted = rawText
      .split("\n")
      .map((line, i) => (/^\d+[\.\)]/.test(line) ? line : `${i + 1}. ${line}`))
      .join("\n");

    const cityList = extractCityNames(rawText);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: formatted,
        places: cityList,
      }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || "Internal Server Error" }),
    };
  }
};
