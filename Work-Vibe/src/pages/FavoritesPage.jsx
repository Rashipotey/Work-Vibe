import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { Link } from "react-router-dom";
import {doc,getDoc,} from "firebase/firestore";
import { BiArrowBack } from "react-icons/bi";

export default function FavoritesPage() {
  const [favoriteLocations, setFavoriteLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          setFavoriteLocations([]);
          return;
        }

        const favoriteIds = userDoc.data().favorites || [];

        const locationDocs = await Promise.all(
          favoriteIds.map((id) => getDoc(doc(db, "locations", id)))
        );

        const locations = locationDocs
          .filter((doc) => doc.exists())
          .map((doc) => ({ id: doc.id, ...doc.data() }));

        setFavoriteLocations(locations);
      } catch (error) {
        console.error("Error fetching favorite locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <div className="p-6">
      <div className="px-6 pt-6">
        <Link to="/home" className="flex items-center text-teal-600 hover:underline">
          <BiArrowBack className="mr-2" size={20} />Home
        </Link>
      </div>

      {loading && user && (
        <div className="p-8 text-center text-gray-600">Loading your favorites...</div>
      )}

      {!loading && !user && (
        <div className="p-8 text-center text-red-500">Please log in to view favorites.</div>
      )}

      {!loading && user && favoriteLocations.length === 0 && (
        <div className="p-8 text-center text-gray-600">You haven't added any favorites yet!</div>
      )}

      {!loading && user && favoriteLocations.length > 0 && (
        <>
          <div className="grid gap-6 p-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {favoriteLocations.map((loc) => (
              <div key={loc.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={loc.imageUrl || "https://via.placeholder.com/400x200?text=No+Image"}
                  alt={loc.locationName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-bold text-lg text-[#00B09F]">{loc.locationName}</h4>
                  <p className="text-sm text-gray-600">
                    {loc.country || "Unknown Country"} • {loc.selectedVibes?.join(", ") || "No Vibes"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created by: {user.displayName || "Anonymous"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
