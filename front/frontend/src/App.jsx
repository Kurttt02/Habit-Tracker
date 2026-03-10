import { useEffect, useState } from "react";

function App() {
    const [habits, setHabits] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/habits")
            .then(res => res.json())
            .then(data => setHabits(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>Habit Tracker</h1>

            {habits.map(habit => (
                <p key={habit.id}>
                    {habit.name} - {habit.completed ? "✅" : "❌"}
                </p>
            ))}
        </div>
    );
}

export default App;