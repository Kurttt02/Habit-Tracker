import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Base habits list
let habits = [
    { id: 1, name: "Exercise", completed: false },
    { id: 2, name: "Read", completed: true },
    { id: 3, name: "Meditate", completed: false }
];

// Root route
app.get("/", (req, res) => {
    res.send("Habit Tracker API running");
});

// Get all the habits
app.get("/habits", (req, res) => {
    res.json(habits);
});

// Creates a new habit
app.post("/habits", (req, res) => {

    const newHabit = {
        id: Date.now(),
        name: req.body.name,
        completed: false
    };

    habits.push(newHabit);

    res.json(newHabit);
});

// Starts the server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});