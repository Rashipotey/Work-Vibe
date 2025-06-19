import { useState } from "react";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const getFlagEmoji = (country) => {
  const flagMap = {
    "India": "🇮🇳",
    "United States": "🇺🇸",
    "United Kingdom": "🇬🇧",
    "Canada": "🇨🇦",
    "Australia": "🇦🇺",
    "Germany": "🇩🇪",
    "France": "🇫🇷",
    "Japan": "🇯🇵",
    "Other": "🌍",
  };
  return flagMap[country] || "";
};

const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan", "Other",
];

const vibes = [
  "Chill", "Party", "Romantic", "Family", "Adventure", "Cultural", "Nature",
];

const climates = ["Tropical", "Mild", "Cold", "Dry", "Any"];
const qualities = ["Excellent", "Good", "Average", "Poor", "Any"];

export default function AddLocationPage() {
  const [form, setForm] = useState({
    locationName: "",
    country: "",
    description: "",
    selectedVibes: [],
    climate: "Any",
    cost: "Any",
    quality: "Any",
    travelMonth: "",
    travelYear: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVibeToggle = (vibe) => {
    setForm((prev) => {
      const vibes = prev.selectedVibes;
      return {
        ...prev,
        selectedVibes: vibes.includes(vibe)
          ? vibes.filter((v) => v !== vibe)
          : [...vibes, vibe],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        alert("You must be logged in to submit a location.");
        return;
      }

      let imageUrl = "";

      // Cloudinary image upload
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "unsigned_preset_1"); 

        const res = await fetch("https://api.cloudinary.com/v1_1/dnp8dxt7o/image/upload", { 
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        imageUrl = data.secure_url;
      }

      const locationRef = collection(db, "locations");
      await addDoc(locationRef, {
        ...form,
        userId: user.uid,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      alert("Location submitted successfully!");

      setForm({
        locationName: "",
        country: "",
        description: "",
        selectedVibes: [],
        climate: "Any",
        cost: "Any",
        quality: "Any",
        travelMonth: "",
        travelYear: "",
      });
      setImageFile(null);
    } catch (error) {
      console.error("Error adding location:", error);
      alert("Failed to submit location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 pt-6">
        <Link to="/home" className="flex items-center text-teal-600 hover:underline">
          <BiArrowBack className="mr-2" size={20} /> Home
        </Link>
      </div>

      <main className="flex-grow max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">Add Location</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Name */}
          <div>
            <label htmlFor="locationName" className="block mb-1 font-medium">Location Name</label>
            <input
              type="text"
              id="locationName"
              name="locationName"
              value={form.locationName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter location name"
            />
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block mb-1 font-medium">Country</label>
            <select
              id="country"
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="" disabled>Select country</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {getFlagEmoji(c)} {c}
                </option>
              ))}
            </select>
          </div>

          {/* Climate */}
          <div>
            <label htmlFor="climate" className="block mb-1 font-medium">Climate</label>
            <select
              id="climate"
              name="climate"
              value={form.climate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2">
              {climates.map((cl) => (
                <option key={cl} value={cl}>{cl}</option>
              ))}
            </select>
          </div>

          {/* Approx Cost */}
          <div>
            <label htmlFor="cost" className="block mb-1 font-medium">Approx Trip Cost</label>
            <input
              type="text"
              id="cost"
              name="cost"
              value={form.cost}
              onChange={handleChange}
              placeholder="e.g. ₹10000–₹15000"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Quality */}
          <div>
            <label htmlFor="quality" className="block mb-1 font-medium">Quality</label>
            <select
              id="quality"
              name="quality"
              value={form.quality}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2">
              {qualities.map((quality) => (
                <option key={quality} value={quality}>{quality}</option>
              ))}
            </select>
          </div>

          {/* Travel Month */}
          <div>
            <label htmlFor="travelMonth" className="block mb-1 font-medium">Month of Visit</label>
            <select
              id="travelMonth"
              name="travelMonth"
              value={form.travelMonth}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="" disabled>Select month</option>
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          {/* Travel Year */}
          <div>
            <label htmlFor="travelYear" className="block mb-1 font-medium">Year of Visit</label>
            <select
              id="travelYear"
              name="travelYear"
              value={form.travelYear}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="" disabled>Select year</option>
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-1 font-medium">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none"
              placeholder="Describe your experience"
            />
          </div>

          {/* Vibes */}
          <div>
            <label className="block mb-1 font-medium">Vibe Tags</label>
            <div className="flex flex-wrap gap-2">
              {vibes.map((vibe) => {
                const selected = form.selectedVibes.includes(vibe);
                return (
                  <button
                    type="button"
                    key={vibe}
                    onClick={() => handleVibeToggle(vibe)}
                    className={`px-3 py-1 rounded-full border ${
                      selected
                        ? "bg-teal-600 text-white border-teal-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-teal-100"
                    } focus:outline-none`}
                  >
                    {vibe}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="imageUpload" className="block mb-1 font-medium">Upload Image (Optional)</label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-3 rounded-md font-semibold hover:bg-teal-700 transition disabled:opacity-50">
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
