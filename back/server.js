//all my imports
import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
//Enables the frontend and backend connection
app.use(cors());
//Parses the json requests.
app.use(express.json());

// In-memory habits list
let habits = [
    { id: 1, name: "Exercise", completed: false },
    { id: 2, name: "Read", completed: true },
    { id: 3, name: "Meditate", completed: false }
];

// GET all habits (in this case getches all the habits for user id=1)
app.get("/habits", async (req, res) => {
    try {
        
        const result = await pool.query(
            "SELECT * FROM habits WHERE user_id=$1",
            [1]
        );

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST to create a habit and store it in db
app.post("/habits", async (req, res) => {
    try {
        const { name } = req.body;
        //Makes a new habit in PostgreSQL and returns it.
        const result = await pool.query(
            "INSERT INTO habits (user_id, name) VALUES ($1, $2) RETURNING *",
            [1, name] 
        );

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Patch in the toggle completion
aapp.patch("/habits/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Gets tehe current habit from the database        
        const habitRes = await pool.query(
            "SELECT * FROM habits WHERE id=$1",
            [id]
        );

        const habit = habitRes.rows[0];
        if (!habit) {
            return res.status(404).json({ error: "Habit not found" });
        }
        //Toggles completion within the database
        const updated = await pool.query(
            "UPDATE habits SET completed=$1 WHERE id=$2 RETURNING *",
            [!habit.completed, id]
        );

        res.json(updated.rows[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Deletes habit
app.delete("/habits/:id", async (req, res) => {
    try {
        const { id } = req.params;
        //Deletes the habit from the db
        await pool.query(
            "DELETE FROM habits WHERE id=$1",
            [id]
        );

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




// Starts the  server 
app.listen(5000, () => {
    console.log("Server running on port 5000");
}); 