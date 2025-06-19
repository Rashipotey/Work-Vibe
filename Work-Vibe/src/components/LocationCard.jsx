import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from "firebase/firestore";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function LocationCard({ location }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      checkFavorite(user.uid);
    }
  }, []);

  const checkFavorite = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const favorites = userSnap.data().favorites || [];
      setIsFavorite(favorites.includes(location.id));
    }
  };

  const toggleFavorite = async () => {
    if (!userId) return alert("Login to favorite locations");

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, { favorites: [] });
    }

    await updateDoc(userRef, {
      favorites: isFavorite
        ? arrayRemove(location.id)
        : arrayUnion(location.id),
    });

    setIsFavorite(!isFavorite);
  };

  const handleSeeMore = () => {
    navigate(`/locations/${location.id}`);
  };

  return (
    <div className="relative bg-white shadow-lg rounded-xl p-4 w-full max-w-xs flex flex-col items-center text-center min-h-[340px]">

      <div className="absolute top-2 left-3 text-gray-300 text-3xl">“</div>
      <div className="absolute bottom-2 right-3 text-gray-300 text-3xl">”</div>

      <button
        onClick={toggleFavorite}
        className="absolute top-2 right-3 text-[#00B09F] text-xl"
        title={isFavorite ? "Unfavorite" : "Favorite"}
      >
        {isFavorite ? <FaHeart /> : <FaRegHeart />}
      </button>

      <img
        src={location.imageUrl}
        alt={location.title}
        className="w-32 h-32 object-cover rounded-full border-4 border-[#00B09F] shadow-md mt-4 mb-2"
      />

      <p className="text-gray-700 text-sm px-2 line-clamp-3">
        {location.description || "Discover this hidden gem ideal for remote work, relaxation, and inspiration."}
      </p>

      {location.description?.length > 120 && (
        <button
          onClick={handleSeeMore}
          className="text-xs text-[#00B09F] mt-1 hover:underline"
        >
          See More
        </button>
      )}

      <div className="mt-4">
        <p className="text-l text-[#00B09F]">
          {location.locationName || "Unknown"}, {location.country || "Unknown"}
        </p>
      </div>
    </div>
  );
}
