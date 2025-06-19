import React from "react";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f0fdfa] p-8 flex flex-col">
      <div className="mb-4">
        <Link to="/home" className="flex items-center text-teal-600 hover:underline">
          <BiArrowBack className="mr-2" size={20} />
          Home
        </Link>
      </div>

      <div className="max-w-3xl bg-white shadow-xl rounded-2xl p-8 space-y-6 self-center">
        <h1 className="text-3xl font-bold text-[#00B09F]">About Work Vibe</h1>
        <p className="text-gray-700 text-lg">
          <strong>Work Vibe</strong> is a productivity-focused web app designed to help remote workers, freelancers, digital nomads, and students discover and organize work-friendly locations across cities.
        </p>

        <p className="text-gray-700 text-lg">
          In today’s world, work can happen from anywhere — but finding a reliable, comfortable, and inspiring location isn’t always easy. Work Vibe solves that problem by crowdsourcing and curating locations like:
        </p>

        <ul className="list-disc list-inside text-gray-700 text-lg space-y-1">
          <li>Cafes with fast Wi-Fi and plug points</li>
          <li>Peaceful libraries with good seating</li>
          <li>Beautiful outdoor gardens and parks</li>
          <li>Popular coworking spaces</li>
        </ul>

        <h2 className="text-2xl font-semibold text-teal-700 mt-6">What You Can Do with Work Vibe</h2>
        <ul className="list-disc list-inside text-gray-700 text-lg space-y-1">
          <li><strong>Explore:</strong> View curated lists of top-rated work spots in different cities</li>
          <li><strong>Add Locations:</strong> Share your favorite local spots with the community</li>
          <li><strong>AI-Powered Recommendations:</strong> Get suggestions based on your mood, work type, or travel destination using Gemini AI</li>
          <li><strong>Trip Planning:</strong> Organize your day or travel route with multiple work locations added to a map</li>
          <li><strong>Blog Feature:</strong> Read and write blogs about your remote work experiences and the best places to work from</li>
          <li><strong>Favorites:</strong> Save locations you love and revisit them anytime</li>
        </ul>

        <p className="text-gray-700 text-lg">
          Whether you prefer the calm of a quiet library or the buzz of a coffee shop, Work Vibe empowers you to choose the right environment to stay focused and inspired.
        </p>

        <p className="text-gray-700 text-lg">
          All data is stored securely using Firebase, and the app is built using modern technologies like React, TailwindCSS, AWS and Firestore. It's lightweight, user-friendly, and constantly evolving.
        </p>
      </div>
    </div>
  );
}
