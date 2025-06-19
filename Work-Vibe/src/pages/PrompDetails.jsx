import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function PromptDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promptData, setPromptData] = useState(null);

  useEffect(() => {
    const fetchPrompt = async () => {
      const docRef = doc(db, "curatedPrompts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPromptData(docSnap.data());
      }
    };
    fetchPrompt();
  }, [id]);

  if (!promptData) return <div className="p-6 text-center text-gray-600">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4">
        <button
        onClick={() => navigate(-1)}
        className="text-[#00B09F] hover:underline text-sm sm:text-base"
        >
        &larr; Back
        </button>
    </div>

      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {promptData.originalPrompt}
        </h1>

        <div className="bg-gray-50 border border-gray-100 p-5 rounded-md text-gray-800 whitespace-pre-line leading-relaxed">
          {promptData.response}
        </div>
      </div>
    </div>
  );
}
