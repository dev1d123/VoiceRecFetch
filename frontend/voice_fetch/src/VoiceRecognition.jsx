import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

const VoiceRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef(null);

    // Inicializar SpeechRecognition
    if (!recognitionRef.current && 'webkitSpeechRecognition' in window) {
        recognitionRef.current = new window.webkitSpeechRecognition();
        const recognition = recognitionRef.current;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "es-US";

        recognition.onresult = (event) => {
            let finalTranscript = "";
            for (let i = 0; i < event.results.length; i++) {
                finalTranscript += event.results[i][0].transcript;
            }
            setTranscript(finalTranscript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognition.onend = () => {
            setIsListening(false);
        };
    }

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            alert("Empiece a hablar");
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    return (
        <Router>
            <div>
                {/* Barra de navegación */}
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

                {/* Rutas */}
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div style={{ textAlign: "center", marginTop: "50px" }}>
                                <h1>Bienvenido a la Búsqueda de Vivienda</h1>
                                <p>
                                    Utiliza nuestra herramienta de reconocimiento de voz para buscar
                                    viviendas de forma rápida.
                                </p>
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
                        }
                    />
                    <Route
                        path="/voice"
                        element={
                            <div style={{ textAlign: "center", marginTop: "50px" }}>
                                <h1>Busqueda de vivienda</h1>
                                <h4>Introduzca la consulta</h4>

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();


                                        
                                        alert(`Búsqueda realizada: ${transcript}`);




                                    }}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    <div style={{ position: "relative", marginBottom: "20px" }}>
                                        <input
                                            type="text"
                                            placeholder="Escriba o hable su consulta..."
                                            value={transcript}
                                            onChange={(e) => setTranscript(e.target.value)}
                                            style={{
                                                padding: "10px",
                                                width: "700px",
                                                borderRadius: "5px",
                                                border: "1px solid #ccc",
                                                fontSize: "16px",
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={isListening ? stopListening : startListening}
                                            style={{
                                                position: "absolute",
                                                right: "10px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                backgroundColor: isListening ? "#d62d20" : "#008744",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "50%",
                                                cursor: "pointer",
                                                padding: "10px",
                                            }}
                                        >
                                            🎤
                                        </button>
                                    </div>
                                    <button
                                        type="submit"
                                        style={{
                                            padding: "10px 20px",
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            fontSize: "16px",
                                        }}
                                    >
                                        Buscar vivienda
                                    </button>
                                </form>
                            </div>
                        }
                    />

                </Routes>
            </div>
        </Router>
    );
};

export default VoiceRecognition;
