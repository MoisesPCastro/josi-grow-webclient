"use client";

import { useEffect, useState } from "react";
import "./modal.css";

export default function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        setTimeout(() => setIsOpen(false), 3600);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="welcomeModalOverlay">
            <div className="welcomeModalContainer">
                <div
                    className="welcomeModalLogo welcomeModalPulse"
                    style={{
                        backgroundImage: "url('/imgs/logo-josi-glow.png')",
                    }}
                />
                <div className="welcomeModalText">
                    <p className="welcomeModalMessage">
                        Ilumine seu brilho, liberte sua beleza!
                    </p>
                </div>
            </div>
        </div>
    );
}