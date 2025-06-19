import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchBlogs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
        <div className="mb-4">
        <Link to="/home" className="text-teal-600 hover:underline text-sm inline-flex items-center">
          ← Home
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-teal-700">Latest Blogs</h2>
      {blogs.map(blog => (
        <Link to={`/blogs/${blog.id}`} key={blog.id}>
          <div className="bg-white p-4 mb-4 shadow rounded hover:shadow-md transition">
            <h3 className="text-xl font-semibold">{blog.title}</h3>
            <p className="text-gray-600 line-clamp-2">{blog.content}</p>
            <p className="text-xs mt-2 text-teal-600">{blog.tags?.join(", ")}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
