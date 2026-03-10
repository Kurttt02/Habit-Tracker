import { useEffect } from "react";

function App() {

    useEffect(() => {
        fetch("http://localhost:5000/")
            .then(res => res.text())
            .then(data => console.log(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>Habit Tracker</h1>
            <p>Check the browser console for backend response.</p>
        </div>
    );
}

export default App;
