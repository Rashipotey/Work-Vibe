import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GeminiQuery from "./Gemini-Query";
import {collection,addDoc,query,where,getDocs,Timestamp,} from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";
import { BiArrowBack } from "react-icons/bi";

export default function TripPlanner() {
  const [tripName, setTripName] = useState("");
  const [cities, setCities] = useState([]);
  const [cityInput, setCityInput] = useState({
    name: "",
    startDate: "",
    endDate: "",
    notes: "",
  });
  const [userTrips, setUserTrips] = useState([]);

  const handleAddCity = () => {
    if (
      cityInput.name &&
      cityInput.startDate &&
      cityInput.endDate &&
      cityInput.notes
    ) {
      setCities(prev => [...prev, cityInput]);
      setCityInput({ name: "", startDate: "", endDate: "", notes: "" });
    } else {
      alert("Please fill all city fields before adding.");
    }
  };
  

  const handleSaveTrip = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please login first");
    const latestCities = [
      ...cities,
      ...(cityInput.name && cityInput.startDate && cityInput.endDate && cityInput.notes
        ? [cityInput]
        : []),
    ];
  
    if (!tripName || latestCities.length === 0) {
      return alert("Fill all trip details");
    }
  
    try {
      await addDoc(collection(db, "trips"), {
        userId: user.uid,
        tripName,
        cities: latestCities,
        createdAt: Timestamp.now(),
      });
  
      setTripName("");
      setCities([]);
      setCityInput({ name: "", startDate: "", endDate: "", notes: "" });
      fetchUserTrips();
      alert("Trip saved!");
    } catch (err) {
      console.error("Error saving trip:", err);
      alert("Failed to save trip");
    }
  };
  

  const fetchUserTrips = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "trips"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUserTrips(data);
  };

  useEffect(() => {
    fetchUserTrips();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4">
        <Link to="/home" className="flex items-center text-teal-600 hover:underline">
          <BiArrowBack className="mr-2" size={20} />
          Home
        </Link>
      </div>
      <GeminiQuery />
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Plan Your Trip
      </h1>

      {/* Trip Name */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Trip Name"
          value={tripName}
          onChange={e => setTripName(e.target.value)}
          className="w-full border-b-2 px-4 py-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="City Name"
          value={cityInput.name}
          onChange={e => setCityInput({ ...cityInput, name: e.target.value })}
          className="border-b-2 px-2 py-1 border-0"
        />
        <input
          type="date"
          value={cityInput.startDate}
          onChange={e =>
            setCityInput({ ...cityInput, startDate: e.target.value })
          }
          className="border-b-2 px-2 py-1"
        />
        <input
          type="date"
          value={cityInput.endDate}
          onChange={e =>
            setCityInput({ ...cityInput, endDate: e.target.value })
          }
          className="border-b-2 px-2 py-1"
        />
        <input
          type="text"
          placeholder="Notes"
          value={cityInput.notes}
          onChange={e => setCityInput({ ...cityInput, notes: e.target.value })}
          className="border-b-2 px-2 py-1"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button
          onClick={handleAddCity}
          className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Add City
        </button>
        <button
          onClick={handleSaveTrip}
          className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Save Trip
        </button>
      </div>

      {cities.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Trip Stops</h2>
          <ul className="list-disc pl-5">
            {cities.map((c, idx) => (
              <li key={idx}>
                <strong>{c.name}</strong> ({c.startDate} to {c.endDate}) —{" "}
                {c.notes}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Trips</h2>
        {userTrips.length === 0 ? (
          <p>No trips yet. Start planning!</p>
        ) : (
          <div className="space-y-4">
            {userTrips.map(trip => (
              <div key={trip.id} className="border p-4 rounded shadow">
                <h3 className="font-bold text-lg">{trip.tripName}</h3>
                <ul className="list-disc pl-5">
                  {trip.cities.map((c, i) => (
                    <li key={i}>
                      {c.name} ({c.startDate} - {c.endDate}): {c.notes}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
