const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sample In-Memory Contact Messages
const messages = [];

// REST API Endpoints
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/projects', (req, res) => {
    res.json([
        {
            id: 1,
            title: "3D Canvas Engine",
            tech: ["Three.js", "JavaScript", "WebGL"],
            description: "Interactive 3D graphics rendering engine in the browser."
        },
        {
            id: 2,
            title: "DSA & Algorithmic Suite",
            tech: ["C++", "Data Structures", "Algorithms"],
            description: "High performance algorithm implementations and sorting benchmarks."
        },
        {
            id: 3,
            title: "Full-Stack REST Pipeline",
            tech: ["Node.js", "Express", "REST API"],
            description: "Scalable backend service architecture with robust routing."
        }
    ]);
});

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    const newMessage = { id: Date.now(), name, email, message, date: new Date() };
    messages.push(newMessage);
    console.log('Received Message:', newMessage);

    return res.json({ success: true, message: 'Message received successfully!' });
});

// Fallback route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
