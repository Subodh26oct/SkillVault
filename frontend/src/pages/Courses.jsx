import { useEffect, useState } from "react";
import { getPublishedCourses } from "../api/course";
import { Search, Loader2, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getPublishedCourses();
        setCourses(data.courses || []);
      } catch (error) {
        console.error("Error fetching published courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => 
    course.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    course.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Explore Courses</h1>
          <p className="text-neutral-400 mt-1">Discover new skills with our expert-led courses.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-12 text-center">
          <Filter className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Courses Found</h3>
          <p className="text-neutral-400">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, idx) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-colors group flex flex-col"
            >
              <div className="aspect-video bg-neutral-800 relative overflow-hidden">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600">No Image</div>
                )}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white border border-white/10">
                  ${course.price}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-indigo-500/20 text-indigo-300">
                    {course.category || "General"}
                  </span>
                  <span className="text-xs text-neutral-400 uppercase">{course.level || "Beginner"}</span>
                </div>
                <h3 className="font-semibold text-lg text-white mb-1 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-neutral-400 line-clamp-2 mb-4 flex-grow">{course.subtitle}</p>
                <Link
                  to={`/course/${course._id}`}
                  className="w-full block text-center bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-neutral-200 transition-colors mt-auto"
                >
                  View Course
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
