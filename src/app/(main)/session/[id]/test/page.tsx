'use client';

import {useState} from "react";

const mockQuizData = {
    quizType: "classic",
    title: "APIs REST",
    questions: [
        {
            question: "¿Qué es una API según el documento?",
            options: [
                "Un tipo de base de datos",
                "Un conjunto de reglas y protocolos para la comunicación entre aplicaciones",
                "Un programa de diseño gráfico",
                "Un sistema operativo",
            ],
            correct_answer: 1,
            explanation:
                "El documento define una API como 'un conjunto de reglas y protocolos que permite a diferentes aplicaciones de software comunicarse e intercambiar datos entre sí'.",
        },
        {
            question: "¿Cuál es la función principal de una API?",
            options: [
                "Crear aplicaciones desde cero",
                "Diseñar interfaces de usuario",
                "Actuar como intermediario para integrar funcionalidades",
                "Gestionar el almacenamiento de datos",
            ],
            correct_answer: 2,
            explanation:
                "La API 'actúa como un intermediario que facilita la integración de funcionalidades... sin necesidad de crearlas desde cero'.",
        },
        {
            question: "¿En qué formato se suele devolver una respuesta de la API?",
            options: [
                "Solo en formato de texto plano",
                "En formato MP3 o WAV",
                "Generalmente en formato JSON o XML",
                "En formato PDF",
            ],
            correct_answer: 2,
            explanation:
                "El texto menciona que la API devuelve una respuesta 'generalmente en formato JSON o XML'.",
        },
        {
            question: "¿Qué se compara la estructura de una API?",
            options: [
                "Una receta de cocina",
                "Un 'contrato' entre dos aplicaciones",
                "Un mapa de carreteras",
                "Un libro de instrucciones",
            ],
            correct_answer: 1,
            explanation:
                "La estructura de las APIs se compara con un 'contrato' entre dos aplicaciones, definiendo cómo deben interactuar.",
        },
        {
            question: "¿Cuál es uno de los beneficios de usar APIs mencionado en el texto?",
            options: [
                "Aumentar la complejidad del desarrollo",
                "Reducir la eficiencia",
                "Ahorrar tiempo y costos de desarrollo",
                "Limitar la seguridad",
            ],
            correct_answer: 2,
            explanation:
                "El documento lista como beneficio 'Ahorran tiempo y costos de desarrollo, aumentan la eficiencia, mejoran la seguridad y permiten la automatización'.",
        },
    ],
};

export default function TestPage() {
    const {title, questions} = mockQuizData;
    const total = questions.length;

    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [finished, setFinished] = useState(false);

    const q = questions[current];
    const selected = answers[current];
    const hasAnswer = selected != undefined;

    const handleSelect = (i: number) => {
        if (submitted) return;
        setAnswers((prev) => ({...prev, [current]: i}));
    };

    const handleNext = () => {
        if (!submitted) {
            if (!hasAnswer) return;
            setSubmitted(true);
            return;
        }
        setFinished(false);
        if (current + 1 < total) {
            setCurrent((c: number) => c + 1);
        } else {
            setFinished(true);
        }
    }

    const handleBack = () => {
        if (submitted) {
            setSubmitted(false);
            return
        }
        if (current > 0) {
            setCurrent((c:number) => c - 1);
            setSubmitted(false);
        }
    }

    const handleRestart = () => {
        setAnswers({});
        setCurrent(0);
        setSubmitted(false);
        setFinished(false);
    }

    const getOptionState = (i: number) => {
        if (!submitted) return selected === 1 ? 'selected' : 'idle';
        if (i === q.correct_answer) return 'correct';
        if (selected === i) return 'wrong';
        return 'idle';
    }

    const score = questions.reduce(
        (acc, q, i) => acc + (answers[i] === q.correct_answer ? 1 : 0),
        0
    );

}