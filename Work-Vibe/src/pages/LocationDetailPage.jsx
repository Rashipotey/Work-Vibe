import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function LocationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocation() {
      try {
        const docRef = doc(db, "locations", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLocation({ id: docSnap.id, ...docSnap.data() });
        } else {
          alert("Location not found");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLocation();
  }, [id, navigate]);

  if (loading) {
    return <div className="p-6 max-w-6xl mx-auto">Loading...</div>;
  }

  if (!location) {
    return null;
  }

  return (
    <div className="relative p-6 max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-[#00B09F] hover:underline text-sm sm:text-base"
      >
        &larr; Back
      </button>

      <h1 className="text-3xl font-bold mb-4 text-center">{location.locationName||""}, {location.country||""}</h1>

      {location.imageUrl && (
      <div className="flex justify-center my-4">
        <img
          src={location.imageUrl}
          alt={location.name}
          className="w-80 h-80 object-cover rounded-full border-4 border-[#00B09F] shadow-md"
        />
      </div>
    )}  


      <p className="mb-4">{location.description || "No description provided."}</p>

      <ul className="mb-4 space-y-2">
        <li><strong>Climate:</strong> {location.climate || "N/A"}</li>
        <li><strong>Cost:</strong> {location.cost || "N/A"}</li>
        <li><strong>Internet:</strong> {location.internet || "N/A"}</li>
        <li><strong>Time:</strong> {location.travelYear || "N/A"} {location.travelMonth || "N/A"}</li>
        <li><strong>Created by:</strong> {location.username || "Anonymous"}</li>
      </ul>
    </div>
  );
}
