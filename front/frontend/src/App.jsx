import { useEffect, useState } from "react";

function App() {

  // Load habits
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem("habits");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newHabit, setNewHabit] = useState("");
  const [filter, setFilter] = useState("all");

  // Dark mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Adds a Habit
  const addHabit = () => {
    if (newHabit.trim() === "") return;

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
     // Toggles the habit
    const toggleHabit = (id) => {
        const today = new Date().toDateString();

        setHabits(habits.map(habit => {
            if (habit.id !== id) return habit;

            let newCompleted = !habit.completed;
            let newStreak = habit.streak;
            let newLastCompleted = habit.lastCompleted;

            if (newCompleted) {
                // Only updates the streak if not already completed today
                if (habit.lastCompleted !== today) {
                    if (habit.lastCompleted) {
                        const lastDate = new Date(habit.lastCompleted);
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);

                        if (lastDate.toDateString() === yesterday.toDateString()) {
                            newStreak += 1;
                        } else {
                            newStreak = 1;
                        }
                    } else {
                        newStreak = 1;
                    }

                    newLastCompleted = today;
                }
            }

            return {
                ...habit,
                completed: newCompleted,
                streak: newStreak,
                lastCompleted: newLastCompleted
            };
        }));
    };

  // Delete a habit
  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  // Filter
  const filteredHabits = habits.filter(habit => {
    if (filter === "completed") return habit.completed;
    if (filter === "incomplete") return !habit.completed;
    return true;
  });

  // Theme
  const theme = {
    background: darkMode ? "#1e1e1e" : "#eef2f7",
    card: darkMode ? "#2c2c2c" : "#ffffff",
    text: darkMode ? "#ffffff" : "#333",
    input: darkMode ? "#444" : "#fff"
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background
    }}>

      <div style={{
        width: "400px",
        padding: "30px",
        backgroundColor: theme.card,
        borderRadius: "15px",
        color: theme.text
      }}>

        <h1 style={{ textAlign: "center" }}>Habit Tracker</h1>

        {/* Dark mode */}
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light ☀️" : "Dark 🌙"}
          </button>
        </div>

        {/* User Input */}
        <div style={{ display: "flex", marginBottom: "15px" }}>
          <input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="New habit"
            style={{
              flexGrow: 1,
              padding: "10px",
              backgroundColor: theme.input,
              color: theme.text
            }}
          />
          <button onClick={addHabit}>Add</button>
        </div>

        {/* Filters */}
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
          <button onClick={() => setFilter("incomplete")}>Incomplete</button>
        </div>

        {/* Habits */}
        {filteredHabits.map(habit => (
          <div
            key={habit.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: habit.completed
                ? (darkMode ? "#2e7d32" : "#d4edda")
                : (darkMode ? "#7f1d1d" : "#f8d7da")
            }}
          >
            <span
              onClick={() => toggleHabit(habit.id)}
              style={{
                flexGrow: 1,
                cursor: "pointer",
                userSelect: "none"
              }}
            >
              {habit.name} {habit.completed ? "✅" : "❌"}
              <br />
              🔥 Streak: {habit.streak}
            </span>

            <button onClick={() => deleteHabit(habit.id)}>
              Delete
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}

export default App;