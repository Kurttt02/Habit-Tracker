import { useEffect, useState } from "react";

function App() {
    // The logged in user
    const [user, setUser] = useState(() => localStorage.getItem("user"));
    //Login Inputs
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    //Toggles login or register 
    const [isLogin, setIsLogin] = useState(true);
    //Habit data
    const [habits, setHabits] = useState([]);
    //Input for creating new habit.
    const [newHabit, setNewHabit] = useState("");
    // Toggles light / dark mode
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });
    // Changes filter states
    const [filter, setFilter] = useState("all");

    //Saves the dark mode preference on startup
    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    // Fetch habits from db
    useEffect(() => {
        fetch("http://localhost:5000/habits")
            .then(res => res.json())
            .then(data => setHabits(data));
    }, []);

    // My basic auth process
    const handleAuth = () => {
        if (!username || !password) return;

        localStorage.setItem("user", username);
        setUser(username);
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    // Adds a new habit to the db
    const addHabit = async () => {
        if (!newHabit.trim()) return;

        const res = await fetch("http://localhost:5000/habits", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: newHabit })
        });
        //Updates the website
        const data = await res.json();
        setHabits([...habits, data]);
        setNewHabit("");
    };
    //Toggles the completion state
    const toggleHabit = async (id) => {
        const res = await fetch(`http://localhost:5000/habits/${id}`, {
            method: "PATCH"
        });

        const updated = await res.json();
        // Updates local storage 
        setHabits(habits.map(h => h.id === id ? updated : h));
    };
    //Deletes a habit
    const deleteHabit = async (id) => {
        await fetch(`http://localhost:5000/habits/${id}`, {
            method: "DELETE"
        });
        //Removes habit from the UI
        setHabits(habits.filter(h => h.id !== id));
    };
    // Filter logic
    const filteredHabits = habits.filter(h => {
        if (filter === "completed") return h.completed;
        if (filter === "active") return !h.completed;
        return true;
    });


    const total = habits.length;
    const completed = habits.filter(h => h.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Theme code
    const theme = {
        bg: darkMode ? "#0f172a" : "#e6ecf5",
        card: darkMode ? "#1e293b" : "#ffffff",
        text: darkMode ? "#f1f5f9" : "#1e293b"
    };

    // The login screen design
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
                            style={{ width: "90%", padding: "10px" }}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            onChange={e => setPassword(e.target.value)}
                            style={{ width: "90%", padding: "10px" }}
                        />
                    </div>

                    <button onClick={handleAuth} style={{ width: "90%", marginTop: "15px" }}>
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

    // Main application design to make sure its centered on my screen
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
                    <div>Completed: {completed}</div>
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
                    <button onClick={() => setFilter("active")}>Active</button>
                </div>

                {filteredHabits.map(h => (
                    <div key={h.id} style={{
                        marginTop: "10px",
                        padding: "12px",
                        borderRadius: "10px",
                        background: darkMode ? "#1e293b" : "#f0f3f8",
                        display: "flex",
                        justifyContent: "space-between"
                    }}>
                        <span
                            onClick={() => toggleHabit(h.id)}
                            style={{ cursor: "pointer" }}
                        >
                            {h.name} {h.completed ? "(Done)" : ""}
                        </span>

                        <button onClick={() => deleteHabit(h.id)}>
                            Delete
                        </button>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default App;