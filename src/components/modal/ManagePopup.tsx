"use client";

import { useState } from "react";
import CloseButton from "../bottons/closeButton";

export default function ManagePopup({ onSuccess }: { onSuccess: (success: boolean) => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        const user = process.env.NEXT_PUBLIC_ADMIN_USER;
        const pass = process.env.NEXT_PUBLIC_ADMIN_PASS;

        if (username === user && password === pass) {
            onSuccess(true);
        } else {
            setError("Usuário ou senha inválidos");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl text-red-600 font-bold">Acesso Restrito</h2>
                    <CloseButton
                        className="ml-4 font-bold hover:bg-red-600 text-white"
                        size="sm"
                        onClick={() => onSuccess(false)}
                    />
                </div>
                <input
                    type="text"
                    placeholder="Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full px-3 py-2 border 'border-purple-500' rounded-md text-black placeholder-gray-400`}
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-3 py-2 mb-3 mt-3 border 'border-purple-500' rounded-md text-black placeholder-gray-400`}
                />
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <button
                    onClick={handleLogin}
                    className="w-full bg-purple-400 text-white py-2 rounded hover:bg-purple-600"
                >
                    Entrar
                </button>
            </div>
        </div>
    );
}
