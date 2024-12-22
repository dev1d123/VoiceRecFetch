import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Home";
import VoiceRecognition from "./VoiceRecognition";

const Navbar = () => (
    <nav style={{ padding: "10px", backgroundColor: "#007bff", color: "white" }}>
        <ul
            style={{
                listStyleType: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                justifyContent: "center",
            }}
        >
            <li style={{ margin: "0 15px" }}>
                <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                    Inicio
                </Link>
            </li>
            <li style={{ margin: "0 15px" }}>
                <Link to="/voice" style={{ color: "white", textDecoration: "none" }}>
                    Reconocimiento de Voz
                </Link>
            </li>
        </ul>
    </nav>
);

const App = () => {
    return (
        <Router>
            <div>
                <p>que estupido es gpt</p>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/voice" element={<VoiceRecognition />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
