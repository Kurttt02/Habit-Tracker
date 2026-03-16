
import { useEffect, useState } from "react";

function App() {

    // State to store all habits
    const [habits, setHabits] = useState([]);

    // State for the input field
    const [newHabit, setNewHabit] = useState("");

    // Fetch habits from backend when page loads
    useEffect(() => {
        fetch("http://localhost:5000/habits")
            .then(res => res.json())
            .then(data => setHabits(data))
            .catch(err => console.error(err));
    }, []);

    // Function to add a new habit
    const addHabit = () => {
        if (newHabit.trim() === "") return;

        fetch("http://localhost:5000/habits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newHabit })
        })
            .then(res => res.json())
            .then(data => {
                setHabits([...habits, data]);
                setNewHabit("");
            })
            .catch(err => console.error(err));
    };

    // Function to toggle completion of a habit
    const toggleHabit = (id) => {
        fetch(`http://localhost:5000/habits/${id}`, { method: "PATCH" })
            .then(res => res.json())
            .then(updatedHabit => {
                setHabits(habits.map(h => h.id === id ? updatedHabit : h));
            })
            .catch(err => console.error(err));
    };

    // Function to delete a habit
    const deleteHabit = (id) => {
        fetch(`http://localhost:5000/habits/${id}`, { method: "DELETE" })
            .then(res => res.json())
            .then(() => {
                setHabits(habits.filter(h => h.id !== id));
            })
            .catch(err => console.error(err));
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "500px", margin: "0 auto" }}>
            <h1>Habit Tracker</h1>

            {/* Input for new habit */}
            <div style={{ display: "flex", marginBottom: "20px" }}>
                <input
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    placeholder="New habit"
                    style={{ flexGrow: 1, padding: "5px", fontSize: "16px" }}
                />
                <button onClick={addHabit} style={{ marginLeft: "10px", padding: "5px 10px", fontSize: "16px" }}>
                    Add
                </button>
            </div>

            {/* Habit list */}
            {habits.length === 0 && <p>No habits yet. Add one above!</p>}
            <div>
                {habits.map(habit => (
                    <div
                        key={habit.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "10px",
                            padding: "5px 10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            backgroundColor: habit.completed ? "#e0ffe0" : "#ffe0e0"
                        }}
                    >
                        {/* Habit text - clickable to toggle */}
                        <span
                            onClick={() => toggleHabit(habit.id)}
                            style={{ flexGrow: 1, cursor: "pointer", userSelect: "none" }}
                        >
                            {habit.name} - {habit.completed ? "\u2705" : "\u274C"}
                        </span>

                        {/* Delete button */}
                        <button
                            onClick={() => deleteHabit(habit.id)}
                            style={{ marginLeft: "10px", padding: "2px 6px", cursor: "pointer" }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App; 