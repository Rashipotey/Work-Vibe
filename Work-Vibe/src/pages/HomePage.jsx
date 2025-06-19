import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import LocationCard from "../components/LocationCard";

export default function Home() {
  const [locations, setLocations] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [curatedCities, setCuratedCities] = useState([]);

  // 🔹 Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locRef = collection(db, "locations");
        const locQuery = query(locRef);
        const snapshot = await getDocs(locQuery);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLocations(data);
      } catch (err) {
        console.error("Error fetching user locations:", err);
      }
    };
    fetchLocations();
  }, []);

  const topLocations = showAll ? locations : locations.slice(0, 3);

  // 🔹 Fetch curated prompts (only latest 5)
  useEffect(() => {
    const fetchCuratedPrompts = async () => {
      try {
        const curatedRef = collection(db, "curatedPrompts");
        const curatedQuery = query(curatedRef, orderBy("createdAt", "desc"), limit(5));
        const snapshot = await getDocs(curatedQuery);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCuratedCities(data);
      } catch (err) {
        console.error("Error fetching curated prompts:", err);
      }
    };
    fetchCuratedPrompts();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Explore More Features</h1>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Link to="/trip-planner" className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition">Plan a Trip</Link> 
        <Link to="/for-you" className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition">For You</Link>
        <Link to="/blogs/add" className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition">Add Blog</Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">See what places have been explored by others</h1>

      {topLocations.length > 0 ? (
        <>
          <div className="flex gap-4 overflow-x-auto pb-3 snap-x scrollbar-hidden">
            {topLocations.map(loc => (
              <div key={loc.id} className="snap-start min-w-[300px] flex-shrink-0">
                <LocationCard location={loc} />
              </div>
            ))}
          </div>
          {locations.length > 3 && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowAll(prev => !prev)}
                className="text-teal-600 font-semibold hover:underline"
              >
                {showAll ? "Show Less" : "See More"}
              </button>
            </div>
          )}
        </>
      ) : (
        <p>No locations found.</p>
      )}

      <h1 className="text-2xl font-bold text-gray-800 mb-4 mt-8">AI Curated Places</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {curatedCities.map((entry, idx) => (
          <Link
            to={`/prompt/${entry.id}`}
            key={idx}
            className="group bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800 group-hover:text-teal-600 transition-colors duration-200">
                  {entry.originalPrompt}
                </h2>
                <p className="text-sm text-gray-500 mt-2">Tap to view Gemini suggestions</p>
              </div>
              <div className="ml-4 bg-blue-100 text-teal-600 text-xs px-2 py-1 rounded-full font-medium">
                AI
              </div>
            </div>
          </Link>
        ))}
      </div> 
    </div>
  );
}
