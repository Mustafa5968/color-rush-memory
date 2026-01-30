"use client";
import React, { useState, useEffect, useCallback } from 'react';
import ColorButton from './ColorButton';
import Leaderboard from './Leaderboard';
import SubmitScoreForm from './SubmitScoreForm';

const GRID_SIZE = 16;
const COLORS = ['red', 'blue', 'green', 'yellow'];

// Generate a grid where colors are distributed (semi-patterned for now to ensure balance)
const GRID_COLORS = Array.from({ length: GRID_SIZE }, (_, i) => COLORS[i % 4]);
// Shuffle logic could be added here if we want random positions every refreshing, 
// but fixed positions are okay for memory of "location" + "color".
// Let's slightly shuffle or just use the modulo pattern which is:
// R B G Y
// R B G Y ...
// Actually a shifted pattern might be better to look less repetitive?
// Let's just do random for vibrancy.
const generateRandomGrid = () => {
    return Array.from({ length: GRID_SIZE }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
};

// We'll stick to one random grid per session or just generated inside the component.
// Let's use state for it so it doesn't change on re-renders unless we want it to.

export default function GameBoard() {
    const [gridColors] = useState<string[]>(generateRandomGrid); // Stable grid for the session
    const [sequence, setSequence] = useState<number[]>([]);
    const [playerInput, setPlayerInput] = useState<number[]>([]);
    const [isPlayingSequence, setIsPlayingSequence] = useState(false);
    const [activeButton, setActiveButton] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    // Sound effect helpers (using simple AudioContext or just visual for now)
    // We'll stick to visual for simplicity and robustness.

    const playSequence = useCallback(async (currentSequence: number[]) => {
        setIsPlayingSequence(true);
        setPlayerInput([]); // Reset player input

        // Wait a bit before starting
        await new Promise(resolve => setTimeout(resolve, 500));

        for (const buttonIndex of currentSequence) {
            setActiveButton(buttonIndex);
            // Stay active for a short duration
            await new Promise(resolve => setTimeout(resolve, 600));
            setActiveButton(null);
            // Pause between steps
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        setIsPlayingSequence(false);
    }, []);

    const addToSequence = useCallback(() => {
        const nextButton = Math.floor(Math.random() * GRID_SIZE);
        setSequence(prev => {
            const newSeq = [...prev, nextButton];
            playSequence(newSeq);
            return newSeq;
        });
    }, [playSequence]);

    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setSequence([]);
        setPlayerInput([]);

        // Start with one move
        // Need to wait for state update, so we can't just call addToSequence immediately with empty sequence dependency
        // Actually, we can just call a function that sets the initial sequence
        const firstButton = Math.floor(Math.random() * GRID_SIZE);
        setSequence([firstButton]);
        playSequence([firstButton]);
    };

    const handleButtonClick = (index: number) => {
        if (!gameStarted || gameOver || isPlayingSequence) return;

        // Visual feedback for click is handled by CSS active state mostly, 
        // but we can also trigger the active state briefly if we want sequence-like highlight logic
        // But CSS :active is usually enough for user feedback.

        const newInput = [...playerInput, index];
        setPlayerInput(newInput);

        // Check correctness
        const currentStepToCheck = newInput.length - 1;
        if (newInput[currentStepToCheck] !== sequence[currentStepToCheck]) {
            // Wrong move!
            setGameOver(true);
            return;
        }

        // Correct move
        if (newInput.length === sequence.length) {
            // Completed the sequence
            setScore(prev => prev + 1);
            setTimeout(() => {
                addToSequence();
            }, 500);
        }
    };

    const handleRestart = () => {
        startGame();
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
            {/* HUD */}
            <div className="flex justify-between w-full max-w-md mb-6 items-center bg-black/30 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <div className="text-white">
                    <p className="text-sm opacity-70">SCORE</p>
                    <p className="text-3xl font-bold font-mono text-yellow-400">{score}</p>
                </div>
                {!gameStarted && !gameOver && (
                    <button
                        onClick={startGame}
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:scale-105 transition-transform shadow-lg shadow-blue-500/30"
                    >
                        START GAME
                    </button>
                )}
                {(gameStarted || gameOver) && (
                    <div className={`px-4 py-1 rounded-full text-sm font-bold ${isPlayingSequence ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                        {gameOver ? 'GAME OVER' : isPlayingSequence ? 'WATCH' : 'YOUR TURN'}
                    </div>
                )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full max-w-md relative">
                {gameOver && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl animate-in fade-in zoom-in duration-300">
                        <p className="text-4xl font-extrabold text-white mb-2 tracking-tighter drop-shadow-lg">GAME OVER</p>
                        <button
                            onClick={handleRestart}
                            className="mt-4 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
                        >
                            TRY AGAIN
                        </button>
                        <SubmitScoreForm score={score} onSubmitted={() => { }} />
                    </div>
                )}

                {gridColors.map((color, index) => (
                    <ColorButton
                        key={index}
                        color={color}
                        isActive={activeButton === index}
                        onClick={() => handleButtonClick(index)}
                        disabled={!gameStarted || isPlayingSequence || gameOver}
                    />
                ))}
            </div>

            {/* Leaderboard - Show always or only when game not active? Let's show below always */}
            <div className="mt-12 w-full">
                <Leaderboard />
            </div>
        </div>
    );
}
