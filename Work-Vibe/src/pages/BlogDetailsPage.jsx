import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const docRef = doc(db, "blogs", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setBlog(docSnap.data());
    };
    fetchBlog();
  }, [id]);

  if (!blog) return <div className="p-4">Loading blog...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <Link
        to="/blogs"
        className="text-teal-600 hover:underline text-sm inline-flex items-center mb-4"
      >
        ← Back to Blogs
      </Link>

      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      {blog.imageUrl && (
        <img
          src={blog.imageUrl}
          alt=""
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}
      <p className="whitespace-pre-line text-gray-800 mb-4">{blog.content}</p>
      <div className="text-sm text-teal-600">{blog.tags?.join(", ")}</div>
    </div>
  );
}
