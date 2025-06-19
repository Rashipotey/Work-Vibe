import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function AddBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [locationId, setLocationId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return alert("Please log in first");

    try {
      await addDoc(collection(db, "blogs"), {
        title,
        content,
        imageUrl,
        tags: tags.split(",").map((t) => t.trim()),
        locationId,
        userId: user.uid,
        createdAt: Timestamp.now(),
      });
      navigate("/blogs");
    } catch (err) {
      console.error("Error adding blog:", err);
      alert("Failed to post blog.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-6">
      <div className="mb-4">
        <Link
          to="/home"
          className="text-teal-600 hover:underline text-sm inline-flex items-center"
        >
          ← Back to Home
        </Link>
      </div>

      <h2 className="text-xl font-bold mb-4 text-teal-600">Write a New Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border-b p-2"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          rows={8}
          className="w-full border p-2"
        />
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Cover Image URL (optional)"
          className="w-full border p-2"
        />
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma-separated)"
          className="w-full border p-2"
        />
        <input
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          placeholder="Location ID (optional)"
          className="w-full border p-2"
        />
        <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded">
          Post Blog
        </button>
      </form>
    </div>
  );
}
