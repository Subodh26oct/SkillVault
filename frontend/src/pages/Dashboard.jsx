import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { getMyCourses } from "../api/course";
import { BookOpen, Plus, PlayCircle, Loader2, Trophy, Clock, Star, Flame, ChevronRight, User } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { authUser } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getMyCourses(authUser.role);
        if (authUser.role === "instructor") {
          setCourses(data.courses || []);
        } else {
          const purchasedCourses = (data.purchasedCourse || []).map(p => p.courseId);
          setCourses(purchasedCourses);
        }
      } catch (error) {
        console.error("Error fetching dashboard courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [authUser.role]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-10 h-10 text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 pb-20">
      
      {/* Welcome Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black border border-white/10 p-8 md:p-12 shadow-2xl shadow-indigo-500/10"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-500/20 blur-3xl rounded-full"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300">
              <Flame className="w-4 h-4 mr-2 text-orange-500" /> 3 Day Learning Streak!
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{authUser.name}</span>
            </h1>
            <p className="text-lg text-neutral-400 max-w-xl">
              {authUser.role === "instructor" 
                ? "Manage your courses, track student progress, and create new learning experiences." 
                : "Pick up right where you left off. You're making great progress!"}
            </p>
          </div>
          
          {authUser.role === "instructor" && (
            <Link
              to="/course/create"
              className="flex-shrink-0 flex items-center space-x-2 bg-white text-black hover:bg-indigo-50 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Course</span>
            </Link>
          )}
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {authUser.role === "instructor" ? (
          <>
            <motion.div variants={itemVariants} className="bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <BookOpen className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <p className="text-neutral-400 text-sm font-medium">Active Courses</p>
                <p className="text-3xl font-bold text-white">{courses.length}</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <User className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <p className="text-neutral-400 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-white">
                  {courses.reduce((acc, course) => acc + (course.enrolledStudents?.length || 0), 0)}
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Trophy className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <p className="text-neutral-400 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-white">
                  ${courses.reduce((acc, course) => acc + (course.price * (course.enrolledStudents?.length || 0)), 0).toLocaleString()}
                </p>
              </div>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div variants={itemVariants} className="bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <BookOpen className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <p className="text-neutral-400 text-sm font-medium">Enrolled Courses</p>
                <p className="text-3xl font-bold text-white">{courses.length}</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Clock className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <p className="text-neutral-400 text-sm font-medium">Hours of Content</p>
                <p className="text-3xl font-bold text-white">
                  {Math.round(courses.reduce((acc, course) => acc + (course.totalDuration || 0), 0) / 60)} <span className="text-sm font-normal text-neutral-500">hrs</span>
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <Trophy className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <p className="text-neutral-400 text-sm font-medium">Certificates</p>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Main Content Area */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {authUser.role === "instructor" ? "Your Created Courses" : "Continue Learning"}
          </h2>
          <Link to="/courses" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center transition-colors">
            Browse All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {courses.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-xl border border-white/10">
                <Star className="w-10 h-10 text-neutral-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Courses Yet</h3>
              <p className="text-neutral-400 mb-8 max-w-md mx-auto text-lg">
                {authUser.role === "instructor" 
                  ? "Share your knowledge with the world. Start building your first premium course today." 
                  : "Your learning journey begins here. Explore our library to find the perfect course."}
              </p>
              <Link
                to={authUser.role === "instructor" ? "/course/create" : "/courses"}
                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:-translate-y-1"
              >
                <span>{authUser.role === "instructor" ? "Create Course" : "Explore Library"}</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {courses.map((course, idx) => (
              <motion.div
                key={course._id || idx}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group flex flex-col h-full"
              >
                <div className="aspect-video bg-neutral-800 relative overflow-hidden">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 text-neutral-600">No Image</div>
                  )}
                  
                  {/* Glassmorphic Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform scale-50 group-hover:scale-100 transition-transform duration-300">
                      <PlayCircle className="w-8 h-8 text-white fill-white/20" />
                    </div>
                  </div>

                  {/* Level Badge */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
                    {course.level || "Beginner"}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-block">
                      {course.category || "General"}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 leading-tight group-hover:text-indigo-300 transition-colors">
                    {course.title || "Untitled Course"}
                  </h3>
                  
                  {authUser.role !== "instructor" && (
                    <div className="mt-auto pt-4">
                      <div className="flex justify-between text-xs text-neutral-400 mb-1.5 font-medium">
                        <span>Progress</span>
                        <span>{Math.floor(Math.random() * 100)}%</span> {/* Mocked progress for UI */}
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full" 
                          style={{ width: `${Math.floor(Math.random() * 60) + 10}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <Link
                    to={`/course/${course._id}`}
                    className="mt-5 w-full block text-center bg-white/5 border border-white/10 text-white font-medium py-2.5 rounded-xl hover:bg-white hover:text-black transition-colors"
                  >
                    {authUser.role === "instructor" ? "Manage Course" : "Resume Course"}
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
