import React, { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function GeminiQuery() {
  const [userQuery, setUserQuery] = useState("");
  const [geminiResponse, setGeminiResponse] = useState("");
  const [geminiCities, setGeminiCities] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  const handleGeminiQuery = async () => {
    if (!userQuery.trim()) return alert("Enter a question");

    try {
      const res = await fetch("https://lwg65fu1l1.execute-api.ap-south-1.amazonaws.com/dev/geminiQueryHandler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userQuery }),
      });

      const data = await res.json();
      const responseText = data.response || "No response";
      const cities = data.places || [];

      setGeminiResponse(responseText);
      setGeminiCities(cities);
      setIsSaved(false);

      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, "curatedPrompts"), {
          userId: user.uid,
          originalPrompt: userQuery,
          response: responseText,
          geminiResponse: cities,
          createdAt: Timestamp.now(),
        });
        setIsSaved(true);
      } else {
        console.warn("User not logged in. Prompt not saved.");
      }
    } catch (err) {
      console.error(err);
      setGeminiResponse("Error fetching response");
    }
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-lg mb-8">
      <h2 className="text-xl font-bold mb-2 text-gray-800">AI Work Travel Assistant</h2>

      <div className="flex flex-col md:flex-row items-stretch gap-2">
        <input
          type="text"
          placeholder="Prompt ex: List 3 places for workation in India"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          className="flex-1 border-b-2 px-3 py-2 focus:outline-none"
        />
        <button
          onClick={handleGeminiQuery}
          className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Ask
        </button>
      </div>

      {geminiResponse && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-gray-800">
          <strong>AI Recommendations:</strong>
          <div className="mt-3 space-y-3">
            {geminiResponse.split(/\n(?=\d+\.\s)/).map((item, index) => {
              const match = item.match(/^\d+\.\s\*\*(.+?)\*\*[:\-–]?\s?(.*)/) ||
                            item.match(/^\d+\.\s(.+?)[:\-–]?\s?(.*)/);
              const cityName = match ? match[1].trim() : `Place ${index + 1}`;
              const description = match ? match[2].trim() : item.trim();

              return (
                <div key={index} className="border-l-4 border-teal-400 pl-4">
                  <p className="font-semibold text-teal-700">{cityName}</p>
                  <p className="text-gray-700 text-sm mt-1">{description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
