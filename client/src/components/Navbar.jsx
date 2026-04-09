import { HardDrive, LogOut, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("User logged out");
        navigate('/login'); // Send them back to the login page
    };

    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
            {/* Left side: Logo */}
            <div className="flex items-center gap-2 text-blue-600">
                <HardDrive size={28} />
                <span className="text-xl font-bold text-gray-800 hidden sm:block">Mini Drive</span>
            </div>

            {/* Middle: Search Bar (Just UI for now) */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search in Drive..."
                        className="w-full bg-gray-100 border-transparent rounded-lg py-2 pl-10 pr-4 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>

            {/* Right side: User Profile & Logout */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                    <User size={20} />
                    <span className="text-sm font-medium hidden sm:block">Test User</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Log out"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
}