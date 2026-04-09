import { useRef, useState } from 'react';
import { Folder, Clock, Star, Trash2, Cloud, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { auth } from '../services/firebase';

// 1. Accept the new "prop" from the Dashboard
export default function Sidebar({ onUploadSuccess }) {
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const currentUser = auth.currentUser;
        if (!currentUser) {
            return toast.error("You must be logged in to upload files.");
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', currentUser.uid);

        try {
            setIsUploading(true);
            const toastId = toast.loading("Uploading to Azure...");

            await axios.post(`${import.meta.env.VITE_API_URL}/api/files/upload`, formData,{
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.update(toastId, {
                render: "File uploaded successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000
            });

            e.target.value = null;

            // 2. MAGIC MOMENT: Tell the Dashboard the upload is done!
            if (onUploadSuccess) {
                onUploadSuccess();
            }

        } catch (error) {
            console.error("Upload failed:", error);
            toast.dismiss();
            toast.error("Failed to upload file.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <aside className="w-64 bg-gray-50 border-r border-gray-200 h-[calc(100vh-65px)] hidden md:flex flex-col">
            <div className="p-4">
                <button
                    onClick={() => fileInputRef.current.click()}
                    disabled={isUploading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors"
                >
                    {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Cloud size={20} />}
                    <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
                </button>

                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                />
            </div>

            <nav className="flex-1 px-3 space-y-1 mt-4">
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-blue-700 bg-blue-50 rounded-lg font-medium">
                    <Folder size={20} />
                    My Files
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                    <Clock size={20} />
                    Recent
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                    <Star size={20} />
                    Starred
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                    <Trash2 size={20} />
                    Trash
                </a>
            </nav>

            <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Storage</span>
                    <span>1.2 GB / 15 GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '8%' }}></div>
                </div>
            </div>
        </aside>
    );
}