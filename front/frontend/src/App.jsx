import { useEffect, useState } from "react";

function App() {

    const [user, setUser] = useState(() => localStorage.getItem("user"));
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

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

    useEffect(() => {
        if (user) {
            localStorage.setItem(`habits_${user}`, JSON.stringify(habits));
        }
    }, [habits, user]);

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const handleAuth = () => {
        if (!username || !password) return;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        if (isLogin) {
            const existingUser = users.find(
                u => u.username === username && u.password === password
            );
            if (!existingUser) return alert("Invalid login");
        } else {
            if (users.find(u => u.username === username)) {
                return alert("User already exists");
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

    const addHabit = () => {
        if (!newHabit.trim()) return;

        setHabits([
            ...habits,
            {
                id: Date.now(),
                name: newHabit,
                completed: false,
                streak: 0,
                lastCompleted: null
            }
        ]);

        setNewHabit("");
    };

    const toggleHabit = (id) => {
        const today = new Date().toDateString();

        setHabits(habits.map(h => {
            if (h.id !== id) return h;

            let completed = !h.completed;
            let streak = h.streak;
            let lastCompleted = h.lastCompleted;

            if (completed && h.lastCompleted !== today) {
                if (h.lastCompleted) {
                    const last = new Date(h.lastCompleted);
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);

                    if (last.toDateString() === yesterday.toDateString()) {
                        streak++;
                    } else {
                        streak = 1;
                    }
                } else {
                    streak = 1;
                }

                lastCompleted = today;
            }

            return { ...h, completed, streak, lastCompleted };
        }));
    };

    const deleteHabit = (id) => {
        setHabits(habits.filter(h => h.id !== id));
    };

    const filteredHabits = habits.filter(h => {
        if (filter === "completed") return h.completed;
        if (filter === "incomplete") return !h.completed;
        return true;
    });

    const total = habits.length;
    const completedCount = habits.filter(h => h.completed).length;
    const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100);

    const theme = {
        bg: darkMode ? "#0f172a" : "#e6ecf5",
        card: darkMode ? "#1e293b" : "#ffffff",
        text: darkMode ? "#f1f5f9" : "#1e293b"
    };

    // LOGIN SCREEN (FIXED ALIGNMENT)
    if (!user) {
        return (
            <div style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: theme.bg
            }}>
                <div style={{
                    width: "320px",
                    padding: "30px",
                    borderRadius: "16px",
                    background: theme.card,
                    textAlign: "center",
                    color: theme.text
                }}>
                    <h2>{isLogin ? "Login" : "Register"}</h2>

                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px",
                        marginTop: "15px"
                    }}>
                        <input
                            placeholder="Username"
                            onChange={e => setUsername(e.target.value)}
                            style={{
                                width: "90%",
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #ccc"
                            }}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            onChange={e => setPassword(e.target.value)}
                            style={{
                                width: "90%",
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #ccc"
                            }}
                        />
                    </div>

                    <button
                        onClick={handleAuth}
                        style={{
                            width: "90%",
                            marginTop: "15px",
                            padding: "10px"
                        }}
                    >
                        {isLogin ? "Login" : "Register"}
                    </button>

                    <p
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ cursor: "pointer", marginTop: "10px" }}
                    >
                        {isLogin ? "Create account" : "Already have an account?"}
                    </p>
                </div>
            </div>
        );
    }

    // MAIN APP
    return (
        <div style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: theme.bg
        }}>
            <div style={{
                width: "100%",
                maxWidth: "500px",
                padding: "30px",
                borderRadius: "20px",
                background: theme.card,
                color: theme.text
            }}>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h2>Habit Tracker</h2>
                    <button onClick={logout}>Logout</button>
                </div>

                <button onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? "Light Mode" : "Dark Mode"}
                </button>

                <div style={{
                    marginTop: "20px",
                    padding: "15px",
                    borderRadius: "12px",
                    background: darkMode ? "#334155" : "#f1f5f9"
                }}>
                    <div>Total: {total}</div>
                    <div>Completed: {completedCount}</div>
                    <div>Progress: {percent}%</div>

                    <div style={{
                        height: "10px",
                        background: "#ccc",
                        borderRadius: "5px",
                        marginTop: "10px"
                    }}>
                        <div style={{
                            width: `${percent}%`,
                            height: "100%",
                            background: "#4caf50"
                        }} />
                    </div>
                </div>

                <div style={{ display: "flex", marginTop: "15px" }}>
                    <input
                        value={newHabit}
                        onChange={e => setNewHabit(e.target.value)}
                        placeholder="New habit"
                        style={{ flexGrow: 1, padding: "10px" }}
                    />
                    <button onClick={addHabit}>Add</button>
                </div>

                <div style={{ marginTop: "10px" }}>
                    <button onClick={() => setFilter("all")}>All</button>
                    <button onClick={() => setFilter("completed")}>Completed</button>
                    <button onClick={() => setFilter("incomplete")}>Active</button>
                </div>

                {filteredHabits.map(h => (
                    <div key={h.id} style={{
                        marginTop: "10px",
                        padding: "12px",
                        borderRadius: "10px",
                        background: darkMode ? "#1e293b" : "#f0f3f8"
                    }}>
                        <span onClick={() => toggleHabit(h.id)} style={{ cursor: "pointer" }}>
                            {h.name} (Streak: {h.streak}) {h.completed ? "Done" : "To Do"}
                        </span>
                        <button onClick={() => deleteHabit(h.id)} style={{ marginLeft: "10px" }}>
                            Delete
                        </button>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default App;