import { FileText, ExternalLink, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Notice we added a new prop: onDeleteSuccess!
export default function FileCard({ file, onDeleteSuccess }) {
    const [isOpening, setIsOpening] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleOpen = async () => {
        try {
            setIsOpening(true);
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/files/download`, {
                fileUrl: file.url
            });
            window.open(response.data.url, '_blank');
        } catch (error) {
            toast.error("Could not securely open this file.");
        } finally {
            setIsOpening(false);
        }
    };

    // NEW: Function to delete the file
    const handleDelete = async () => {
        // Show a browser confirmation popup so they don't delete by accident
        const isConfirmed = window.confirm(`Are you sure you want to delete "${file.name}"?`);
        if (!isConfirmed) return;

        try {
            setIsDeleting(true);
            const toastId = toast.loading("Deleting file...");

            // Tell our backend to delete this specific file ID
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/files/${file.id}`);

            toast.update(toastId, { render: "File deleted!", type: "success", isLoading: false, autoClose: 3000 });

            // Tell the Dashboard to refresh the grid!
            if (onDeleteSuccess) {
                onDeleteSuccess();
            }

        } catch (error) {
            console.error(error);
            toast.dismiss();
            toast.error("Failed to delete file.");
            setIsDeleting(false); // Only set to false if it failed, otherwise the card is about to disappear anyway!
        }
    };

    return (
        // We added 'relative' and 'group' here so we can position the trash can properly
        <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center hover:shadow-md transition-shadow bg-white relative group">

            {/* NEW: The Trash Can Button (Hidden until you hover over the card!) */}
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                title="Delete file"
            >
                {isDeleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
            </button>

            <FileText size={48} className="text-blue-500 mb-3 mt-2" />

            <p className="text-sm font-medium text-gray-800 text-center truncate w-full mb-1" title={file.name}>
                {file.name}
            </p>

            <p className="text-xs text-gray-500 mb-4">{formatSize(file.size)}</p>

            <button
                onClick={handleOpen}
                disabled={isOpening || isDeleting}
                className="w-full flex justify-center items-center gap-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:bg-blue-200 py-2 rounded-lg transition-colors"
            >
                {isOpening ? <Loader2 className="animate-spin" size={16} /> : <ExternalLink size={16} />}
                {isOpening ? 'Opening...' : 'Open'}
            </button>
        </div>
    );
}