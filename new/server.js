// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Proxy endpoint for GamerPower API
app.get('/api/giveaways', async (req, res) => {
  try {
    const { platform, sortBy } = req.query;
    const apiUrl = new URL('https://www.gamerpower.com/api/giveaways');
    
    if (platform && platform !== 'all') {
      apiUrl.searchParams.append('platform', platform);
    }
    
    if (sortBy) {
      apiUrl.searchParams.append('sort-by', sortBy);
    }

    const response = await axios.get(apiUrl.toString(), {
      headers: {
        'User-Agent': 'FreeGamesHub/1.0'
      }
    });

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('API Proxy Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch giveaways from upstream API'
    });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
