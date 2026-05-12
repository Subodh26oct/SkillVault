import { useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Loader2, Save, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
  const { authUser, updateProfile } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    bio: authUser?.bio || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(
    authUser?.avatar && authUser.avatar !== "default-avatar.png" ? authUser.avatar : null
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("bio", formData.bio);
    if (avatarFile) {
      submitData.append("avatar", avatarFile);
    }

    await updateProfile(submitData);
    setIsUpdating(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-900 border border-white/10 rounded-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-white mb-8">Your Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8 border-b border-white/10 pb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-neutral-800 bg-neutral-800 flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-neutral-500" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-500 transition-colors border-2 border-neutral-900 group-hover:scale-110"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-semibold text-white mb-1">Profile Picture</h3>
              <p className="text-sm text-neutral-400 max-w-sm">
                A picture helps people recognize you and lets you know when you're signed in to your account.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Display Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Email Address</label>
              <input
                type="email"
                value={authUser?.email || ""}
                disabled
                className="w-full bg-neutral-900/50 border border-white/5 rounded-xl px-4 py-3 text-neutral-500 cursor-not-allowed"
              />
              <p className="mt-2 text-xs text-neutral-500">Your email address cannot be changed.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows="4"
                placeholder="Tell us a little bit about yourself..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isUpdating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
