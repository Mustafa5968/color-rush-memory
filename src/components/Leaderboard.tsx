"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

type Score = {
    id: string;
    name: string;
    score: number;
};

export default function Leaderboard() {
    const [scores, setScores] = useState<Score[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(5));
                const querySnapshot = await getDocs(q);
                const fetchedScores: Score[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedScores.push({ id: doc.id, ...doc.data() } as Score);
                });
                setScores(fetchedScores);
            } catch (error) {
                console.error("Error fetching scores: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchScores();
    }, []);

    if (loading) {
        return <div className="text-white text-center mt-8 animate-pulse">Loading leaderboard...</div>;
    }

    return (
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full max-w-md mx-auto mt-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                <span>🏆</span> Top 5 Leaderboard
            </h3>
            <div className="space-y-2">
                {scores.length === 0 ? (
                    <p className="text-white/60 text-center">No scores yet. Be the first!</p>
                ) : (
                    scores.map((s, index) => (
                        <div key={s.id} className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                            <div className="flex items-center gap-3">
                                <span className={`
                    w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                    ${index === 0 ? 'bg-yellow-400 text-black' :
                                        index === 1 ? 'bg-gray-300 text-black' :
                                            index === 2 ? 'bg-orange-400 text-black' : 'bg-white/10 text-white'}
                `}>
                                    {index + 1}
                                </span>
                                <span className="text-white font-medium">{s.name}</span>
                            </div>
                            <span className="text-yellow-400 font-bold">{s.score}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
