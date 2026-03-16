import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// In-memory habits list
let habits = [
    { id: 1, name: "Exercise", completed: false },
    { id: 2, name: "Read", completed: true },
    { id: 3, name: "Meditate", completed: false }
];

// Root route
app.get("/", (req, res) => {
    res.send("Habit Tracker API running");
});

// GET all habits
app.get("/habits", (req, res) => {
    res.json(habits);
});

// POST create habit
app.post("/habits", (req, res) => {

    const newHabit = {
        id: Date.now(),
        name: req.body.name,
        completed: false
    };

    habits.push(newHabit);

    res.json(newHabit);

});

// PATCH toggle completion
app.patch("/habits/:id", (req, res) => {

    const habit = habits.find(h => h.id == req.params.id);

    if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
    }

    habit.completed = !habit.completed;

    res.json(habit);

});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});