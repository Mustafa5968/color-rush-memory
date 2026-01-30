"use client";
import React from 'react';

type ColorButtonProps = {
    color: string;
    isActive: boolean;
    onClick: () => void;
    disabled?: boolean;
};

const colorClasses: Record<string, string> = {
    red: 'bg-red-500 shadow-red-500/50',
    blue: 'bg-blue-500 shadow-blue-500/50',
    green: 'bg-green-500 shadow-green-500/50',
    yellow: 'bg-yellow-400 shadow-yellow-400/50',
};

const activeClasses: Record<string, string> = {
    red: 'bg-red-300 ring-4 ring-red-200 scale-95 brightness-125',
    blue: 'bg-blue-300 ring-4 ring-blue-200 scale-95 brightness-125',
    green: 'bg-green-300 ring-4 ring-green-200 scale-95 brightness-125',
    yellow: 'bg-yellow-200 ring-4 ring-yellow-100 scale-95 brightness-125',
};

export default function ColorButton({ color, isActive, onClick, disabled }: ColorButtonProps) {
    const baseClass = colorClasses[color] || 'bg-gray-500';
    const activeClass = activeClasses[color] || 'brightness-125';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        w-full h-24 sm:h-32 rounded-xl transition-all duration-150 transform
        shadow-lg border-b-4 border-black/20
        ${isActive ? activeClass : `${baseClass} hover:brightness-110 active:scale-95`}
        ${disabled ? 'cursor-default' : 'cursor-pointer active:border-b-0 active:translate-y-1'}
      `}
            aria-label={`${color} button`}
        />
    );
}
