import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle, Image as ImageIcon, Video, FileText, Settings, Loader2, DollarSign, AlignLeft } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../api/axios";

export default function CreateCourse() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    level: "Beginner",
    price: "",
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thumbnailFile) {
      toast.error("Please upload a course thumbnail");
      return;
    }
    
    setIsCreating(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle || "Learn amazing things");
      data.append("description", formData.description || "A comprehensive course");
      data.append("category", formData.category);
      data.append("level", formData.level.toLowerCase());
      data.append("price", formData.price || "0");
      data.append("thumbnail", thumbnailFile);

      await axiosInstance.post("/course", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      toast.success("Course created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-900 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full"></div>
        
        <div className="relative z-10 flex items-center mb-10 pb-6 border-b border-white/10">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mr-6 border border-indigo-500/30">
            <PlusCircle className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Create New Course</h1>
            <p className="text-neutral-400 mt-1">Start building your premium learning experience</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Course Title</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="e.g. Advanced Web Development 2026"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
                <div className="relative">
                  <AlignLeft className="absolute left-4 top-4 w-5 h-5 text-neutral-500" />
                  <textarea
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all min-h-[100px]"
                    placeholder="Describe what students will learn..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Category</label>
                  <div className="relative">
                    <Settings className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <select
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white appearance-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="" disabled>Select category</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Price ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="number"
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      placeholder="e.g. 49.99"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Experience Level</label>
                <div className="flex bg-black/50 border border-white/10 rounded-xl overflow-hidden p-1">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, level })}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                        formData.level === level
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "text-neutral-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Course Thumbnail</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleThumbnailChange}
                />
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="w-full h-48 bg-black/40 border-2 border-dashed border-white/10 hover:border-indigo-500/50 rounded-xl flex flex-col items-center justify-center text-neutral-500 hover:text-indigo-400 transition-all cursor-pointer group overflow-hidden relative"
                >
                  {thumbnailPreview ? (
                    <img src={thumbnailPreview} alt="Thumbnail preview" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity" />
                  ) : null}
                  
                  <div className="relative z-10 flex flex-col items-center p-4 bg-black/40 rounded-xl backdrop-blur-sm">
                    <ImageIcon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-white">{thumbnailPreview ? "Change Thumbnail" : "Click to upload thumbnail"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-3">
                <Video className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <h4 className="text-indigo-300 font-semibold mb-1">Upload Lectures Later</h4>
                  <p className="text-indigo-200/70">
                    Once you create the curriculum foundation here, you will be able to upload your promo video and all course lectures on the dedicated Course Management page.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-xl font-bold text-neutral-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
            >
              {isCreating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              <span>Create Course Foundation</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
