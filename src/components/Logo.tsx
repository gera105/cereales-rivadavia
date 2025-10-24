// src/components/Logo.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const Logo: React.FC = () => {
    return (
        <Link to="/" className="text-xl font-extrabold text-indigo-600">
            CerealesR
        </Link>
    );
};