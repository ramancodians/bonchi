import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2, Upload, Loader } from "lucide-react";
import { API_ENDPOINT } from "../../config/consts";

const AdminBannerManager = () => {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  // Fetch Banners
  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: async () =>
      (await axios.get(`${API_ENDPOINT}/banners/public`)).data?.data,
  });

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: async (imageBase64: string) => {
      return axios.post(`${API_ENDPOINT}/banners/upload`, { imageBase64 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner uploaded successfully");
      setUploading(false);
    },
    onError: () => {
      toast.error("Failed to upload banner");
      setUploading(false);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`${API_ENDPOINT}/banners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner deleted");
    },
    onError: () => {
      toast.error("Failed to delete banner");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit size (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large (Max 5MB)");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      uploadMutation.mutate(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Banner Management
      </h1>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New Banner</h2>
        <div className="flex items-center gap-4">
          <label className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer transition-all active:scale-95 shadow-lg shadow-blue-200">
            {uploading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <Upload size={20} />
            )}
            <span>{uploading ? "Uploading..." : "Upload Image"}</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
          <p className="text-sm text-gray-400">
            Recommended size: 800x400px. Max 5MB.
          </p>
        </div>
      </div>

      {/* Banner List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 flex justify-center text-gray-400">
            <Loader className="animate-spin" />
          </div>
        ) : (
          banners?.map((banner: any) => (
            <div
              key={banner.id}
              className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-gray-100 border border-gray-200"
            >
              <img
                src={banner.url}
                alt="Banner"
                className="w-full h-48 object-cover"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => deleteMutation.mutate(banner.id)}
                  className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {!isLoading && banners?.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No banners uploaded yet.
        </div>
      )}
    </div>
  );
};

export default AdminBannerManager;
