import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import {collection,query,where,getDocs,deleteDoc,doc,} from "firebase/firestore";
import { FiHeart, FiLogOut, FiEdit, FiTrash2 } from "react-icons/fi";
import { BiArrowBack, BiUser } from "react-icons/bi";

export default function ProfilePage() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [loadingLocs, setLoadingLocs] = useState(true);
  const [errorLocs, setErrorLocs] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchUserLocations = async () => {
      try {
        const q = query(collection(db, "locations"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        const userLocs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched locations:", userLocs);
        setLocations(userLocs);
      } catch (err) {
        console.error(err);
        setErrorLocs("Failed to load your locations.");
      } finally {
        setLoadingLocs(false);
      }
    };

    fetchUserLocations();
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (err) {
      alert("Failed to logout. Try again.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      try {
        await deleteDoc(doc(db, "locations", id));
        setLocations((prev) => prev.filter((loc) => loc.id !== id));
      } catch (err) {
        console.error("Error deleting location:", err);
        alert("Could not delete location. Try again.");
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0fdfa] p-6">
        <p className="text-red-500 text-lg mb-4">You need to be logged in to view your profile.</p>
        <Link to="/login" className="text-teal-600 hover:underline">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 px-6 max-w-6xl mx-auto">
   
      <Link to="/home" className="flex items-center text-teal-600 hover:underline mb-4">
        <BiArrowBack className="mr-2" size={20} />
        Home
      </Link>

      <div className="bg-white shadow-md rounded-2xl p-8">
  
        <div className="flex items-center space-x-6 border-b pb-6 mb-6">
          <BiUser size={36} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user.displayName || "Jane Doe"}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <Link
            to="/favorites"
            className="flex items-center bg-teal-50 text-teal-700 px-4 py-2 rounded-lg hover:bg-teal-100 transition"
          >
            <FiHeart className="mr-2" />
            Favorites
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Added Locations</h3>

        {loadingLocs && <p className="text-gray-600">Loading your locations...</p>}
        {errorLocs && <p className="text-red-500">{errorLocs}</p>}
        {!loadingLocs && locations.length === 0 && (
          <p className="text-gray-600">You haven't added any locations yet.</p>
        )}

          {!loadingLocs && locations.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {locations.map((loc) => (
              <div key={loc.id} className="bg-white border shadow-md rounded-lg p-4">
                <img
                  src={loc.imageUrl || "https://via.placeholder.com/150"}
                  alt={loc.locationName}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />

                <div className="space-y-2 text-sm text-gray-700">
                  <div><strong>Location:</strong> {loc.locationName || "—"}</div>
                  <div><strong>Country:</strong> {loc.country || "—"}</div>
                  <div><strong>Climate:</strong> {loc.climate || "—"}</div>
                  <div><strong>Cost:</strong> {loc.cost || "—"}</div>
                  <div><strong>Quality:</strong> {loc.quality || "—"}</div>
                </div>

                <div className="flex justify-end space-x-4 mt-4">
                  <Link to={`/locations/edit/${loc.id}`}>
                    <FiEdit className="text-blue-600 hover:text-blue-800 cursor-pointer" />
                  </Link>
                  <FiTrash2
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => handleDelete(loc.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
