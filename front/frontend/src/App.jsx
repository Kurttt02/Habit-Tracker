

import { useEffect, useState } from "react";

function App() {

    // Authentication state
    const [user, setUser] = useState(() => localStorage.getItem("user"));
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    // Theme state
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    // Habits 
    const [habits, setHabits] = useState(() => {
        try {
            const saved = localStorage.getItem(`habits_${localStorage.getItem("user")}`);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [newHabit, setNewHabit] = useState("");
    const [filter, setFilter] = useState("all");

    // Save habits
    useEffect(() => {
        if (user) {
            localStorage.setItem(`habits_${user}`, JSON.stringify(habits));
        }
    }, [habits, user]);

    // Save theme
    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    // Authentication logic
    const handleAuth = () => {
        if (!username || !password) return;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        if (isLogin) {
            const existingUser = users.find(
                u => u.username === username && u.password === password
            );

            if (!existingUser) {
                alert("Invalid login");
                return;
            }
        } else {
            const userExists = users.find(u => u.username === username);
            if (userExists) {
                alert("User already exists");
                return;
            }

            users.push({ username, password });
            localStorage.setItem("users", JSON.stringify(users));
        }

        localStorage.setItem("user", username);
        setUser(username);

        const saved = localStorage.getItem(`habits_${username}`);
        setHabits(saved ? JSON.parse(saved) : []);
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setHabits([]);
    };

    // Add habit
    const addHabit = () => {
        if (!newHabit.trim()) return;

        const newItem = {
            id: Date.now(),
            name: newHabit,
            completed: false,
            streak: 0,
            lastCompleted: null
        };

        setHabits([...habits, newItem]);
        setNewHabit("");
        setFilter("all");
    };

    // Toggle habit with streak logic
    const toggleHabit = (id) => {
        const today = new Date().toDateString();

        setHabits(habits.map(habit => {
            if (habit.id !== id) return habit;

            let newCompleted = !habit.completed;
            let newStreak = habit.streak;
            let newLastCompleted = habit.lastCompleted;

            if (newCompleted && habit.lastCompleted !== today) {
                if (habit.lastCompleted) {
                    const last = new Date(habit.lastCompleted);
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);

                    if (last.toDateString() === yesterday.toDateString()) {
                        newStreak++;
                    } else {
                        newStreak = 1;
                    }
                } else {
                    newStreak = 1;
                }

                newLastCompleted = today;
            }

            return {
                ...habit,
                completed: newCompleted,
                streak: newStreak,
                lastCompleted: newLastCompleted
            };
        }));
    };

    // Delete habit
    const deleteHabit = (id) => {
        setHabits(habits.filter(h => h.id !== id));
    };

    // Filter habits
    const filteredHabits = habits.filter(h => {
        if (filter === "completed") return h.completed;
        if (filter === "incomplete") return !h.completed;
        return true;
    });

    // Theme styles
    const theme = {
        bg: darkMode ? "#1e1e1e" : "#eef2f7",
        card: darkMode ? "#2c2c2c" : "#fff",
        text: darkMode ? "#fff" : "#333",
        input: darkMode ? "#444" : "#fff"
    };

    // Login screen
    if (!user) {
        return (
            <div style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.bg
            }}>
                <div style={{
                    padding: "30px",
                    backgroundColor: theme.card,
                    borderRadius: "15px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                    textAlign: "center",
                    width: "300px",
                    color: theme.text
                }}>
                    <h2>{isLogin ? "Login" : "Register"}</h2>

                    <input
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ marginBottom: "10px", width: "100%" }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ marginBottom: "15px", width: "100%" }}
                    />

                    <button onClick={handleAuth} style={{ width: "100%" }}>
                        {isLogin ? "Login" : "Register"}
                    </button>

                    <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer", marginTop: "10px" }}>
                        {isLogin ? "Create account" : "Already have an account?"}
                    </p>
                </div>
            </div>
        );
    }

    // Main app
    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.bg
        }}>
            <div style={{
                width: "400px",
                padding: "25px",
                backgroundColor: theme.card,
                borderRadius: "15px",
                color: theme.text
            }}>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h2>Habit Tracker</h2>
                    <button onClick={logout}>Logout</button>
                </div>

                <button onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? "Light" : "Dark"}
                </button>

                <div style={{ display: "flex", marginTop: "15px" }}>
                    <input
                        value={newHabit}
                        onChange={(e) => setNewHabit(e.target.value)}
                        placeholder="New habit"
                        style={{ flexGrow: 1 }}
                    />
                    <button onClick={addHabit}>Add</button>
                </div>

                <div style={{ marginTop: "10px" }}>
                    <button onClick={() => setFilter("all")}>All</button>
                    <button onClick={() => setFilter("completed")}>Completed</button>
                    <button onClick={() => setFilter("incomplete")}>Incomplete</button>
                </div>

                {filteredHabits.map(h => (
                    <div key={h.id} style={{ marginTop: "10px" }}>
                        <span onClick={() => toggleHabit(h.id)} style={{ cursor: "pointer" }}>
                            {h.name} (Streak: {h.streak}) {h.completed ? "Done" : "Not done"}
                        </span>
                        <button onClick={() => deleteHabit(h.id)}>Delete</button>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default App;