const axios = require("axios");

const getStarwars = async (req, res) => {
    try {
        const response = await axios.get("https://swapi.dev/api/people/1/");
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching Star Wars data:", error.message);
        res.status(500).json({ error: "Failed to fetch Star Wars data" });
    }
};

module.exports = getStarwars;
