import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { Loader2 } from "lucide-react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CreateCourse from "./pages/CreateCourse";
import Profile from "./pages/Profile";

export default function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-indigo-500/30">
        <Navbar />
        <main className="w-full max-w-full px-4 py-8 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={authUser ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/create" element={authUser?.role === "instructor" ? <CreateCourse /> : <Navigate to="/dashboard" />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />
            {/* Additional routes will go here */}
          </Routes>
        </main>
      </div>
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
        },
      }} />
    </Router>
  );
}
