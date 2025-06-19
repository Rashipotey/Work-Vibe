import React, { useState, useEffect } from "react";
import LocationCard from "../components/LocationCard";
import { auth } from "../firebase"; // ✅ Import Firebase auth

export default function ForYou() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const res = await fetch(`https://lwg65fu1l1.execute-api.ap-south-1.amazonaws.com/dev/for-you?userId=${user.uid}`)
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecs();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-teal-700">Recommended For You</h1>

      {loading ? (
        <p>Loading...</p>
      ) : recommendations.length === 0 ? (
        <p>No recommendations yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((loc, i) => (
            <LocationCard key={i} location={loc} />
          ))}
        </div>
      )}
    </div>
  );
}
