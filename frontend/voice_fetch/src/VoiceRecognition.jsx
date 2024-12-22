import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from 'axios';

const VoiceRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef(null);
    const [viviendas, setViviendas] = useState([]); // Datos de todas las viviendas
    const [filteredResults, setFilteredResults] = useState([]); // Resultados filtrados
    const [error, setError] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!transcript.trim()) {
            alert("Por favor, introduzca una consulta.");
            return;
        }

        try {
            const queryPatterns = [
                { 
                    id: 1, 
                    pattern: /busco tipo (\w+)/i, 
                    filter: (viviendas, values) => viviendas.filter(item => item.tipo.toLowerCase() === values[0].toLowerCase()) 
                },
                { 
                    id: 2, 
                    pattern: /busco zona (\w+)/i, 
                    filter: (viviendas, values) => viviendas.filter(item => item.zona.toLowerCase() === values[0].toLowerCase()) 
                },
                { 
                    id: 3, 
                    pattern: /busco tipo (\w+) zona (\w+)/i, 
                    filter: (viviendas, values) => viviendas.filter(item => 
                        item.tipo.toLowerCase() === values[0].toLowerCase() && 
                        item.zona.toLowerCase() === values[1].toLowerCase()) 
                },
                { 
                    id: 4, 
                    pattern: /busco tipo (\w+) numero dormitorios (\d+) zona (\w+)/i, 
                    filter: (viviendas, values) => viviendas.filter(item => 
                        item.tipo.toLowerCase() === values[0].toLowerCase() && 
                        item.dormitorios === parseInt(values[1]) && 
                        item.zona.toLowerCase() === values[2].toLowerCase()) 
                },
                { 
                    id: 5, 
                    pattern: /deseo una (\w+) en (\w+)/i, 
                    filter: (viviendas, values) => viviendas.filter(item => 
                        item.tipo.toLowerCase() === values[0].toLowerCase() && 
                        (item.zona.toLowerCase() === values[1].toLowerCase() || item.zona.toLowerCase() === values[0].toLowerCase())) 
                },
                { 
                    id: 6, 
                    pattern: /deseo un (\w+) con más de (\d+) dormitorios en (el centro)/i, 
                    filter: (viviendas, values) => viviendas.filter(item => 
                        item.tipo.toLowerCase() === values[0].toLowerCase() && 
                        item.dormitorios > parseInt(values[1]) && 
                        item.zona.toLowerCase() === values[2].toLowerCase()) 
                },
                { 
                    id: 7, 
                    pattern: /deseo una (\w+) de más de (\d+) metros cuadrados/i, 
                    filter: (viviendas, values) => viviendas.filter(item => 
                        item.tipo.toLowerCase() === values[0].toLowerCase() && 
                        item.tamaño > parseInt(values[1])) 
                },
                { 
                    id: 8, 
                    pattern: /deseo un (\w+) barato/i, 
                    filter: (viviendas, values) => {
                        const precioBarato = 200000; // Definimos "barato" como viviendas con precio menor a 200000
                        return viviendas.filter(item => 
                            item.tipo.toLowerCase() === values[0].toLowerCase() && 
                            parseFloat(item.precio) < precioBarato
                        );
                    } 
                },
                { 
                    id: 9, 
                    pattern: /deseo un (\w+) en (\w+) con (\w+)/i, 
                    filter: (viviendas, values) => viviendas.filter(item => 
                        item.tipo.toLowerCase() === values[0].toLowerCase() && 
                        item.zona.toLowerCase() === values[1].toLowerCase() && 
                        item.extras.toLowerCase().includes(values[2].toLowerCase())
                    )
                }
            ];
                     
            let matchedQuery = null;

            for (const query of queryPatterns) {
                const match = transcript.match(query.pattern);
                if (match) {
                    matchedQuery = { ...query, values: match.slice(1) }; // Extrae valores capturados
                    break;
                }
            }
            
            if (!matchedQuery) {
                console.log("No se encontró un patrón que coincida con la consulta.");
                return;
            }

            const filteredData = matchedQuery.filter(viviendas, matchedQuery.values);
            console.log("Datos filtrados:", filteredData);



        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        const fetchViviendas = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/viviendas/"); // URL de tu API Django
                setViviendas(response.data);
                console.log(response);
            } catch (err) {
                console.error(err);
                setError("Hubo un error al cargar los datos. Intente más tarde.");
            }
        };
        fetchViviendas();
    }, []);


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
                                    onSubmit={handleSubmit}

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
