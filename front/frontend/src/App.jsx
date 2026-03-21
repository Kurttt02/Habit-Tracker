import { useEffect, useState } from "react";

function App() {

    const [habits, setHabits] = useState([]);
    const [newHabit, setNewHabit] = useState("");
    const [filter, setFilter] = useState("all");

    // Fetch habits
    useEffect(() => {
        fetch("http://localhost:5000/habits")
            .then(res => res.json())
            .then(data => setHabits(data))
            .catch(err => console.error(err));
    }, []);

    // Add a habit
    const addHabit = () => {
        if (newHabit.trim() === "") return;

        fetch("http://localhost:5000/habits", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: newHabit })
        })
            .then(res => res.json())
            .then(data => {
                setHabits([...habits, data]);
                setNewHabit("");
            });
    };

    // Toggle a habit
    const toggleHabit = (id) => {
        fetch(`http://localhost:5000/habits/${id}`, {
            method: "PATCH"
        })
            .then(res => res.json())
            .then(updatedHabit => {
                setHabits(habits.map(h => h.id === id ? updatedHabit : h));
            });
    };

    // Delete a habit
    const deleteHabit = (id) => {
        fetch(`http://localhost:5000/habits/${id}`, {
            method: "DELETE"
        })
            .then(() => {
                setHabits(habits.filter(h => h.id !== id));
            });
    };

    // Filter 
    const filteredHabits = habits.filter(habit => {
        if (filter === "completed") return habit.completed;
        if (filter === "incomplete") return !habit.completed;
        return true;
    });

    return (

        <div style={{
            width: "100vw", 
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#eef2f7"
        }}>

            <div style={{
                width: "400px",
                padding: "30px",
                backgroundColor: "white",
                borderRadius: "15px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
            }}>

                <h1 style={{
                    textAlign: "center",
                    marginBottom: "20px",
                    color: "#333"
                }}>
                    Habit Tracker
                </h1>

                {/* user input */}
                <div style={{ display: "flex", marginBottom: "20px" }}>
                    <input
                        value={newHabit}
                        onChange={(e) => setNewHabit(e.target.value)}
                        placeholder="New habit"
                        style={{
                            flexGrow: 1,
                            padding: "10px",
                            borderRadius: "8px 0 0 8px",
                            border: "1px solid #ccc"
                        }}
                    />
                    <button
                        onClick={addHabit}
                        style={{
                            padding: "10px",
                            border: "none",
                            backgroundColor: "#4caf50",
                            color: "white",
                            borderRadius: "0 8px 8px 0",
                            cursor: "pointer"
                        }}
                    >
                        Add
                    </button>
                </div>

                {/* Filter Buttons */}
                <div style={{ marginBottom: "15px", textAlign: "center" }}>
                    <button onClick={() => setFilter("all")} style={{ margin: "5px" }}>All</button>
                    <button onClick={() => setFilter("completed")} style={{ margin: "5px" }}>Completed</button>
                    <button onClick={() => setFilter("incomplete")} style={{ margin: "5px" }}>Incomplete</button>
                </div>

                {/* Habits */}
                {filteredHabits.length === 0 && (
                    <p style={{ textAlign: "center", color: "#777" }}>
                        No habits found
                    </p>
                )}

                {filteredHabits.map(habit => (
                    <div
                        key={habit.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "10px",
                            padding: "10px",
                            borderRadius: "8px",
                            backgroundColor: habit.completed ? "#d4edda" : "#f8d7da"
                        }}
                    >
                        <span
                            onClick={() => toggleHabit(habit.id)}
                            style={{
                                flexGrow: 1,
                                cursor: "pointer",
                                userSelect: "none",
                                opacity: habit.completed ? 0.6 : 1
                            }}
                        >
                            {habit.name} {habit.completed ? "✅" : "❌"}
                        </span>

                        <button
                            onClick={() => deleteHabit(habit.id)}
                            style={{
                                backgroundColor: "#f44336",
                                color: "white",
                                border: "none",
                                padding: "5px 10px",
                                borderRadius: "5px",
                                cursor: "pointer"
                            }}
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