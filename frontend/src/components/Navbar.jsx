import { Link, useNavigate } from "react-router-dom";
import { BookOpen, User, Menu, LogOut, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function Navbar() {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-indigo-500" />
          <span className="font-bold text-xl tracking-tight text-white">SkillVault</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-neutral-300">
          <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
          
          <div className="flex items-center space-x-4 ml-4">
            {authUser ? (
              <>
                <Link to="/dashboard" className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="flex items-center space-x-3 border-l border-white/10 pl-4">
                  <Link to="/profile" className="flex items-center space-x-2 hover:bg-white/5 p-1.5 rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-white/10 overflow-hidden">
                      {authUser.avatar && authUser.avatar !== "default-avatar.png" ? (
                        <img src={authUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-neutral-400" />
                      )}
                    </div>
                    <span className="font-medium text-white">{authUser.name}</span>
                  </Link>
                  <button onClick={handleLogout} className="p-2 hover:bg-white/5 rounded-full text-neutral-400 hover:text-red-400 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-white transition-colors">Login</Link>
                <Link to="/signup" className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>

        <button className="md:hidden text-neutral-300">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
