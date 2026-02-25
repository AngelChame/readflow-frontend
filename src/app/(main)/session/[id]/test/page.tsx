'use client';
import {useEffect, useState} from "react";
import {navigate} from "next/dist/client/components/segment-cache/navigation";

const testType = 'Clasico';
const summaryTitle = 'La ansiedad';

interface Question {
    id: number;
    pregunta: string;
    opciones: string[];
    correcta: string;
}

//preguntas de ejemplo, se reemplaza al terminar API
const fetchPreguntas = async (): Promise<Question[]> => {
    return [
        { id: 1, pregunta: "¿Cuál es la capital de Francia?", opciones: ["Madrid", "París", "Roma", "Berlín"], correcta: "París" },
        { id: 2, pregunta: "¿Cuánto es 8 × 7?", opciones: ["54", "56", "58", "64"], correcta: "56" },
        { id: 3, pregunta: "¿En qué año llegó el hombre a la Luna?", opciones: ["1965", "1967", "1969", "1971"], correcta: "1969" },
        { id: 4, pregunta: "¿Cuál es el elemento más abundante en la atmósfera?", opciones: ["Oxígeno", "Argón", "Nitrógeno", "CO₂"], correcta: "Nitrógeno" },
        { id: 5, pregunta: "¿Quién escribió 'Cien años de soledad'?", opciones: ["Vargas Llosa", "Borges", "Cortázar", "García Márquez"], correcta: "García Márquez" },
        { id: 6, pregunta: "¿Cuál es el planeta más grande del sistema solar?", opciones: ["Saturno", "Júpiter", "Neptuno", "Urano"], correcta: "Júpiter" },
        { id: 7, pregunta: "¿Cuántos lados tiene un hexágono?", opciones: ["5", "6", "7", "8"], correcta: "6" },
        { id: 8, pregunta: "¿Cuál es el océano más grande del mundo?", opciones: ["Atlántico", "Índico", "Ártico", "Pacífico"], correcta: "Pacífico" },
        { id: 9, pregunta: "¿Cuál es el símbolo químico del oro?", opciones: ["Go", "Ag", "Au", "Or"], correcta: "Au" },
        { id: 10, pregunta: "¿En qué continente está Brasil?", opciones: ["África", "Asia", "América del Sur", "Oceanía"], correcta: "América del Sur" },
    ];
};

export default function TestPage() {

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>([]);
    const [finished, setFinished] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPreguntas().then((data) => {
            setQuestions(data);
            setLoading(false);
        });
    }, []);

    const currentQuestion = questions[currentIndex];
    const isLast = currentIndex === questions.length - 1;
    const selectedAnswer = answers[currentIndex];

    const navigate = (direction: number)=> {
        setTimeout(() =>{
            setCurrentIndex((prev) => prev + direction);
        }, 200);
    }

    const handleNext = () => {
        if (isLast) {
            setTimeout(() => {
                setFinished(true);
            }, 200)
        } else {
            navigate(1);
        }
    }

    const letters = ['A', 'B', 'C', 'D'];

    return(
        <div className="bg-background-secondary h-full w-full rounded-2xl flex flex-col gap-4 px-20 py-10">
            <h2 className="text-foreground text-3xl font-medium">{summaryTitle}</h2>
            <h4 className="text-foreground text-xl font-light">Pregunta {currentIndex + 1} de {questions.length}</h4>
        </div>
    )};