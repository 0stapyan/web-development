const fastify = require("fastify")();
const path = require("path");
const getGiphy = require("./api/giphy");
const getStarwars = require("./api/starwars");

fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "../public"),
    prefix: "/",
});

fastify.get("/api/giphy", getGiphy);
fastify.get("/api/starwars", getStarwars);

const start = async () => {
    try {
        await fastify.listen(3000, "0.0.0.0");
        console.log("Server running at http://localhost:3000");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
