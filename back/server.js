const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Habit Tracker API running");
});

app.get("/habits", (req, res) => {
    const habits = [
        { id: 1, name: "Gym", completed: false },
        { id: 2, name: "Read", completed: true },
        { id: 3, name: "Uni Work", completed: false }
    ];

    res.json(habits);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});