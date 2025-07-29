import React from "react";
import { Link } from "react-router-dom";
import goaImg from "../assets/goa.jpg";
import himalayanImg from "../assets/himalayan.jpg";
import urbanJungleImg from "../assets/urban-jungle.jpg";


const sampleLocations = [
  { name: "Goa Beach Shack", city: "Goa", type: "Cafe", image: goaImg },
  { name: "Himalayan CoWork", city: "Dharamshala", type: "Co-Working", image: himalayanImg },
  { name: "Urban Jungle", city: "Bangalore", type: "Cafe", image: urbanJungleImg },
];


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#00B09F]">Work Vibe</h1>
        <Link to="/auth" className="text-sm text-[#00B09F] hover:underline">
            Login/Sign up
        </Link>

      </header>
      <section className="text-center py-16 px-4 bg-blue-50">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          Work From Anywhere, Discover Your Vibe 🌍
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore the best cafes, coworking spaces, and remote-friendly spots tailored for digital nomads.
        </p>
      </section>

      <section className="px-6 py-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Top Spots Preview</h3>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {sampleLocations.map((loc, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={loc.image} alt={loc.name} className="w-full h-56 object-cover" />
              <div className="p-4">
                <h4 className="font-bold text-lg text-[#00B09F]">{loc.name}</h4>
                <p className="text-sm text-gray-600">{loc.city} • {loc.type}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
