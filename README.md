# 🚀 Mini Drive - Full Stack Cloud Storage
Mini Drive is a secure, enterprise-grade cloud storage application built with the MERN stack. It allows users to authenticate, upload files to Microsoft Azure, and manage their cloud data through a modern, responsive dashboard.

## Link: https://mini-drive-pi.vercel.app/login
## 🛠️ Tech Stack
Frontend
React.js (Vite)

Tailwind CSS (v4 for modern styling)

Lucide React (Iconography)

React Router (Client-side navigation)

Axios (API communication)

Backend
Node.js & Express

Multer (Middleware for file handling)

CORS (Security)

## Cloud Services
Microsoft Azure Blob Storage: Secure hosting for raw file data.

Google Firebase Auth: Secure user registration and login.

Google Firestore: NoSQL database for file metadata (receipts).

Render: Backend hosting.

Vercel: Frontend hosting.

## ✨ Features
Secure Authentication: User sign-up and login powered by Firebase.

Cloud Uploads: Direct streaming of files to Azure Blob Storage via a Node.js proxy.

Real-time Dashboard: Automatically refreshes to show newly uploaded files.

Secure File Access: Implements SAS (Shared Access Signatures) for temporary, secure viewing links.

File Management: Users can view file metadata (size, type) and permanently delete files.

Responsive Design: Fully optimized for desktop and mobile browsers.

## 📂 Project Structure
Plaintext
mini-drive/
├── client/             # React Frontend (Vite)
│   ├── src/
│   │   ├── components/ # Reusable UI (Navbar, Sidebar, FileCard)
│   │   ├── pages/      # Dashboard, Login, Signup
│   │   └── services/   # Firebase configuration
├── server/             # Node.js Backend
│   ├── config/         # Azure & Firebase Admin SDK setup
│   ├── controllers/    # Logical "brains" (Upload, Fetch, Delete)
│   ├── middleware/     # Multer file upload config
│   └── routes/         # API Endpoints

##🚀 Installation & Local Setup
1. Clone the repository
Bash
git clone https://github.com/YourUsername/mini-drive.git
cd mini-drive
2. Setup the Backend
Bash
cd server
npm install
Create a .env file in the server folder.

Add your AZURE_STORAGE_CONNECTION_STRING.

Place your serviceAccountKey.json inside server/config/.

3. Setup the Frontend
Bash
cd ../client
npm install
Update client/src/services/firebase.js with your Firebase web config keys.

Create a .env file with VITE_API_URL=http://localhost:5000.

4. Run the App
Backend: npm run dev (inside /server)

Frontend: npm run dev (inside /client)

## 🔒 Security
This project follows industry best practices:

Private Storage: Azure containers are set to Private.

Temporary Tokens: Access to files is granted via 1-hour expiring SAS tokens.

CORS Protection: Backend only accepts requests from the verified production frontend.

Environment Variables: All secret keys are kept out of version control via .gitignore.

Paste the content above into it.

Commit and push to GitHub:

Bash
git add README.md
git commit -m "Add professional README"
git push
