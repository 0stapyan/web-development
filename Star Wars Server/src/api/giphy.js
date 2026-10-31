const axios = require("axios");
require("dotenv").config();

const getGiphy = async (req, res) => {
    try {
        const apiKey = process.env.GIPHY_API_KEY;
        const response = await axios.get(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=5`);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching Giphy data:", error.message);
        res.status(500).json({ error: "Failed to fetch Giphy data" });
    }
};

module.exports = getGiphy;
