"use client";

import { useEffect, useState } from "react";
import "./modal.css";

interface WelcomeModalProps {
    onClose: () => void;
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(false);
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="welcomeModalOverlay">
            <div className="welcomeModalContainer">
                <div
                    className="welcomeModalLogo welcomeModalPulse"
                    style={{ backgroundImage: "url('/imgs/logo-josi-glow.png')" }}
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
