import React, { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate, Link } from "react-router-dom";

export default function ExplorePage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await fetch("https://lwg65fu1l1.execute-api.ap-south-1.amazonaws.com/dev/locations");
        const data = await res.json();
        setLocations(data);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLocations();
  }, []);

  if (loading) return <div className="p-6">Loading locations...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-4">
            <Link to="/home" className="flex items-center text-teal-600 hover:underline">
            <BiArrowBack className="mr-2" size={20} />
            Home
            </Link>
        </div>
      <h1 className="text-3xl font-bold mb-6 text-center">Explore Locations</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="cursor-pointer border rounded-lg p-4 shadow hover:shadow-lg transition"
            onClick={() => navigate(`/fetch-loc/${loc.id}`)}
          >
            <img
              src={loc.image}
              alt={loc.locationName}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold">{loc.locationName}, {loc.city}, {loc.country}</h2>
            <p className="text-sm text-gray-600 mt-1">{loc.description?.slice(0, 80)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
