# 3D Interactive Web Application & Developer Portfolio

A responsive, high-performance web application featuring an interactive 3D WebGL background rendered using **Three.js**, styled with modern **glassmorphic CSS**, and powered by a **Node.js Express** REST backend.

---

## 🚀 Features

- **Interactive 3D Geometry:** Custom wireframe icosahedron with glowing core and ambient particle field.
- **Mouse & Camera Controls:** Integrated `OrbitControls` with smooth rotation damping and toggle controls.
- **Responsive Glassmorphism UI:** Clean dark-mode layout with floating glass cards and subtle micro-interactions.
- **RESTful API Service:** Built-in Express backend endpoints (`/api/projects`, `/api/contact`, `/api/health`).
- **Contact Form Handling:** Client-side AJAX fetch integration with real-time feedback.

---

## 🛠️ Project Structure

```
interactive_3d_web_app/
├── public/
│   ├── index.html     # Main HTML structure with WebGL canvas wrapper
│   ├── styles.css     # Responsive glassmorphism styling & animations
│   └── main.js        # Three.js 3D scene setup, render loop & UI logic
├── server.js          # Node.js Express backend server & REST API
├── package.json       # Project dependencies & scripts
└── README.md          # Setup & execution instructions
```

---

## 💻 Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm (Node Package Manager)

### Installation & Execution

1. Extract the `.zip` archive.
2. Open terminal in the project directory:
   ```bash
   cd interactive_3d_web_app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## ⚙️ Tech Stack Summary

- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Three.js (r128), WebGL
- **Backend:** Node.js, Express.js
- **Design:** Dark Mode, Glassmorphic UI, CSS Grid & Flexbox
- **Architecture:** Static Asset Hosting + REST API Pipeline
