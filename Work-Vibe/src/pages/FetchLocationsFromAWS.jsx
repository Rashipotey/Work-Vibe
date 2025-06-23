import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function LocationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocation() {
      try {
        const res = await fetch(`https://lwg65fu1l1.execute-api.ap-south-1.amazonaws.com/dev/locations/${id}`);
        const data = await res.json();

        if (data?.error) {
          alert("Location not found");
          navigate("/explore");
        } else {
          setLocation(data);
        }
      } catch (err) {
        console.error("Error fetching location:", err);
        navigate("/explore");
      } finally {
        setLoading(false);
      }
    }

    fetchLocation();
  }, [id, navigate]);

  if (loading) return <div className="p-6 max-w-6xl mx-auto">Loading...</div>;
  if (!location) return null;

  return (
    <div className="relative p-6 max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-[#00B09F] hover:underline text-sm sm:text-base"
      >
        &larr; Back
      </button>

      <h1 className="text-3xl font-bold mb-4 text-center">
        {location.locationName || ""}, {location.city || ""}, {location.country || ""}
      </h1>

      {location.image && (
        <div className="flex justify-center my-4">
          <img
            src={location.image}
            alt={location.locationName}
            className="w-80 h-80 object-cover rounded-full border-4 border-[#00B09F] shadow-md"
          />
        </div>
      )}

      <p className="mb-4">{location.description || "No description provided."}</p>

      <ul className="mb-4 space-y-2">
        <li><strong>Climate:</strong> {location.climate || "N/A"}</li>
        <li><strong>Cost:</strong> {location.cost || "N/A"}</li>
        <li><strong>Things To Do:</strong> {location.thingsToDo?.join(", ") || "N/A"}</li>
        <li><strong>Best Time:</strong> {location.bestTimeToVisit || "N/A"}</li>
        <li><strong>Vibes:</strong> {location.selectedVibes?.join(", ") || "N/A"}</li>
      </ul>
    </div>
  );
}
