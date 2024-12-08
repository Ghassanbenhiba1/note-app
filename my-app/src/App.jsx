import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import NotesList from "./components/NotesList";

function App() {
    const [isConect, setisConect] = useState(
        !!localStorage.getItem("token") // Automatically log in if a token exists
    );

    return (
        <Router>
            <Routes>
                {/* Redirect to NotesList if connected */}
                <Route
                    path="/"
                    element={
                        isConect ? (
                            <Navigate to="/notes" replace />
                        ) : (
                            <Login setisConect={setisConect} />
                        )
                    }
                />
                {/* NotesList is protected */}
                <Route
                    path="/notes"
                    element={
                        isConect ? (
                            <NotesList setisConect={setisConect} />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
