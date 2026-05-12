import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, BookOpen, Star, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 relative overflow-hidden">
      {/* Background glowing blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl space-y-8 relative z-10"
      >
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300 font-medium shadow-lg shadow-indigo-500/5 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
            SkillVault 2.0 is now live
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-neutral-500 pb-2">
            Master the Future <br /> of Learning.
          </h1>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Elevate your career with premium courses from industry leaders. 
            Experience an engaging, interactive platform designed to help you achieve mastery.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link to="/courses" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-white/10">
            Explore Library <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-neutral-900 text-white font-bold hover:bg-neutral-800 border border-white/10 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg">
            <PlayCircle className="w-5 h-5" /> Start Learning
          </Link>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 mt-16 border-t border-white/5">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/20">
              <Zap className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-white font-semibold mb-1">Fast-Paced</h3>
            <p className="text-neutral-500 text-sm">Learn efficiently with bite-sized, high-impact modules.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold mb-1">Expert Instructors</h3>
            <p className="text-neutral-500 text-sm">Taught by industry veterans and top-tier professionals.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4 border border-green-500/20">
              <Star className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-white font-semibold mb-1">Premium Quality</h3>
            <p className="text-neutral-500 text-sm">Crystal clear videos, resources, and interactive quizzes.</p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
