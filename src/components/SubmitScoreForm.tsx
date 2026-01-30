"use client";
import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type SubmitScoreFormProps = {
    score: number;
    onSubmitted: () => void;
};

export default function SubmitScoreForm({ score, onSubmitted }: SubmitScoreFormProps) {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        setError('');

        try {
            await addDoc(collection(db, 'scores'), {
                name: name.trim(),
                score,
                createdAt: serverTimestamp(),
            });
            onSubmitted();
        } catch (err) {
            console.error("Error writing document: ", err);
            setError('Failed to submit score. Please check your connection.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-fit mx-auto mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Submit Your Score</h3>
            <p className="text-white mb-4">You scored: <span className="font-bold text-yellow-400 text-2xl">{score}</span></p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={20}
                    className="px-4 py-2 rounded-lg bg-black/20 text-white placeholder-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    disabled={isSubmitting}
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={!name.trim() || isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}
