import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import VoiceRecognition from "./VoiceRecognition";

const Home = () => (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Bienvenido a la Búsqueda de Vivienda</h1>
        <p>Utiliza nuestra herramienta de reconocimiento de voz para buscar viviendas de forma rápida.</p>
        <Link to="/voice">
            <button
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#008744",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                    margin: "10px",
                }}
            >
                Ir al Reconocimiento de Voz
            </button>
        </Link>
    </div>
);

export default Home;