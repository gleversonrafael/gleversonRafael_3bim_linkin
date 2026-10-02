const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { query } = require('./database');

const app = express();

const accountRoutes = require('./routes/accountRoutes');
const adminRoutes = require('./routes/adminRoutes');
const postRoutes = require("./routes/postRoutes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve images folder (002-linkin/images) at http://localhost:3001/images
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/admin', adminRoutes);
app.use('/account', accountRoutes);
app.use('/posts', postRoutes);

app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
    console.log(`\n=================================`);
    console.log(`🚀 Server running on port ${PORT}`);
    
    try {
        await query('SELECT 1');
        console.log(`✅ Database ${process.env.DB_NAME} connected successfully!`);
    } catch (error) {
        console.error(`❌ DATABASE CONNECTION FAILED: ${error.message}`);
    }
    console.log(`=================================\n`);
});