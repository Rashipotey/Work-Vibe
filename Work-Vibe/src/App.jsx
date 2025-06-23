import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Navigate } from "react-router-dom";
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import FavoritesPage from './pages/FavoritesPage'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import AddLocationPage from './pages/AddLocPage';
import LocationDetailPage from './pages/LocationDetailPage';
import ProfilePage from './pages/ProfilePage';
import TripPlanner from './pages/TripPlanner';
import PromptDetails from './pages/PrompDetails';
import AddBlog from './pages/AddBlog';
import BlogDetails from './pages/BlogDetailsPage';
import DisplayBlogs from './pages/DisplayBlogs'
import ForYou from './pages/ForYou';
import ExplorePage from './pages/ExplorePage'
import FetchLocationsFromAWS from './pages/FetchLocationsFromAWS'


function AppLayout() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsub();
  }, []);

  const hideNavbar = location.pathname === '/' || location.pathname === '/auth';

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/home" replace /> : <LandingPage />}
          />
          <Route
            path="/auth"
            element={user ? <Navigate to="/home" replace /> : <AuthPage />}
          />
          <Route
            path="/home"
            element={user ? <HomePage /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/favorites"
            element={user ? <FavoritesPage /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/addLoc"
            element={user ? <AddLocationPage /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/about"
            element={user ? <AboutPage /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/locations/:id"
            element={user ? <LocationDetailPage /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/trip-planner"
            element={user ? <TripPlanner /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/prompt/:id"
            element={user ? <PromptDetails /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/blogs/add"
            element={user ? <AddBlog /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/blogs/:id"
            element={user ? <BlogDetails /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="blogs"
            element={user ? <DisplayBlogs /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="for-you"
            element={user ? <ForYou /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="explore"
            element={user ? <ExplorePage /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="fetch-loc/:id"
            element={user ? <FetchLocationsFromAWS /> : <Navigate to="/auth" replace />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router> 
  );
}
