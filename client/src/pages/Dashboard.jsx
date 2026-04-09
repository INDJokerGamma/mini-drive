import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FileCard from '../components/FileCard';

export default function Dashboard() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. We moved the fetching logic into its own reusable function
    const fetchFiles = async (userId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/files/${userId}`);
            setFiles(response.data);
        } catch (error) {
            console.error("Error fetching files:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchFiles(user.uid); // Call it when page loads
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // 2. A mini-function we will hand to the Sidebar
    const handleUploadSuccess = () => {
        const user = auth.currentUser;
        if (user) {
            fetchFiles(user.uid); // Re-fetch the files!
        }
    };

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                {/* 3. We pass the function to the Sidebar as a "prop" */}
                <Sidebar onUploadSuccess={handleUploadSuccess} />

                <main className="flex-1 overflow-y-auto p-6 bg-white">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Files</h1>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-blue-500">
                            <Loader2 className="animate-spin mb-2" size={40} />
                            <p className="text-gray-500">Loading your files...</p>
                        </div>
                    ) : files.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                            <p>No files uploaded yet.</p>
                            <p className="text-sm mt-1">Click the "Upload File" button to get started.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {files.map((file) => (
                                        <FileCard
                                            key={file.id}
                                            file={file}
                                            onDeleteSuccess={handleUploadSuccess}
                                        />
                                    ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}