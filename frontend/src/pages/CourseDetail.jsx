import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCoursePurchaseStatus, initiateStripeCheckout } from "../api/purchase";
import { getCourseDetails } from "../api/course";
import { useAuthStore } from "../store/useAuthStore";
import { PlayCircle, CheckCircle, Clock, Award, Loader2, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function CourseDetail() {
  const { courseId } = useParams();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (authUser) {
          const res = await getCoursePurchaseStatus(courseId);
          setCourse(res.course);
          setIsPurchased(res.purchased);
        } else {
          const res = await getCourseDetails(courseId);
          setCourse(res.course);
        }
      } catch (error) {
        console.error("Error fetching course detail:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [courseId, authUser]);

  const handleCheckout = async () => {
    if (!authUser) {
      navigate("/login");
      return;
    }
    setIsCheckingOut(true);
    try {
      const res = await initiateStripeCheckout(courseId);
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!course) {
    return <div className="text-center text-white mt-10">Course not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        <div className="md:w-1/2 aspect-video relative">
          <img 
            src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        </div>
        
        <div className="md:w-1/2 p-8 flex flex-col justify-center bg-gradient-to-r from-neutral-900 to-black/50">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              {course.category}
            </span>
            <span className="text-xs font-medium text-neutral-400 uppercase">
              {course.level} Level
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {course.title}
          </h1>
          <p className="text-neutral-300 mb-8 leading-relaxed">
            {course.subtitle}
          </p>
          
          <div className="flex items-center space-x-6 text-sm text-neutral-400 mb-8">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Self-paced</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>Certificate of Completion</span>
            </div>
          </div>
          
          <div className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white/5 rounded-xl border border-white/10">
            <div>
              <p className="text-sm text-neutral-400">Total Price</p>
              <p className="text-3xl font-bold text-white">${course.price}</p>
            </div>
            {authUser?._id === course.instructor?._id ? (
              <div className="flex gap-4 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors">
                  Edit Details
                </button>
                <button className="flex-1 sm:flex-none px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors">
                  Manage Lectures
                </button>
              </div>
            ) : isPurchased ? (
              <button 
                onClick={() => navigate(`/course/${course._id}/play`)}
                className="w-full sm:w-auto px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Go to Course</span>
              </button>
            ) : (
              <button 
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full sm:w-auto px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
              >
                {isCheckingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                <span>Buy Now</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Description & Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">About this course</h2>
            <div 
              className="prose prose-invert max-w-none text-neutral-300"
              dangerouslySetInnerHTML={{ __html: course.description || "No description available." }}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-lg text-white mb-4">What you'll learn</h3>
            <ul className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <li key={i} className="flex space-x-3 text-neutral-300 text-sm">
                  <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <span>Master essential concepts to excel in this field.</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
