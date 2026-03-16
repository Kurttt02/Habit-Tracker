

import { useEffect, useState } from "react";

function App() {

    // State to store all habits
    const [habits, setHabits] = useState([]);

    // State for the input field
    const [newHabit, setNewHabit] = useState("");

    // Fetch habits from backend
    useEffect(() => {
        fetch("http://localhost:5000/habits")
            .then(res => res.json())
            .then(data => setHabits(data))
            .catch(err => console.error(err));
    }, []);

    // Function to add a new habit
    const addHabit = () => {

        // Stops empty habits
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

                // Add the new habit to the existing list
                setHabits([...habits, data]);

                // Clear input field
                setNewHabit("");

            })
            .catch(err => console.error(err));
    };

    // Function to toggle the completion of a habit
    const toggleHabit = (id) => {

        fetch(`http://localhost:5000/habits/${id}`, {
            method: "PATCH"
        })
            .then(res => res.json())
            .then(updatedHabit => {

                // Update the habits list with the new modified habit
                setHabits(
                    habits.map(h =>
                        h.id === id ? updatedHabit : h
                    )
                );

            })
            .catch(err => console.error(err));
    };

    return (

        <div style={{ padding: "20px", fontFamily: "Arial" }}>

            <h1>Habit Tracker</h1>

            
            <input
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="New habit"
            />

            
            <button onClick={addHabit}>
                Add
            </button>

            
            <div style={{ marginTop: "20px" }}>

                {habits.map(habit => (

                    <div
                        key={habit.id}

                        // Clicking the habit toggles completion
                        onClick={() => toggleHabit(habit.id)}

                        
                        style={{ cursor: "pointer" }}
                    >
                        {habit.name} - {habit.completed ? "\u2705" : "\u274C"}
                    </div>

                ))}

            </div>

        </div>

    );

}

export default App;