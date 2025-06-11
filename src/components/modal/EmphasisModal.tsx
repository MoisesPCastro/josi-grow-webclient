"use client";

import { useEffect, useState } from "react";
import "./modal.css";
import { IEmphasisModalProps } from "./interfaces";



export default function EmphasisModal({ products, onDone }: IEmphasisModalProps) {
    const [index, setIndex] = useState(0);
    const [isBlinkCount, setBlinkCount] = useState(0);
    const [isVisible, setVisible] = useState(true);

    const BLINK_INTERVAL = 800;
    const BLINK_CYCLES = 2;

    useEffect(() => {
        if (index >= products.length) return onDone();
        const maxToggles = BLINK_CYCLES * 2;
        const timer = setTimeout(() => {
            setVisible(v => !v);
            setBlinkCount(c => c + 1);
            if (isBlinkCount + 1 >= maxToggles) {
                setIndex(i => i + 1);
                setBlinkCount(0);
                setVisible(true);
            }
        }, BLINK_INTERVAL);
        return () => clearTimeout(timer);
    }, [isBlinkCount, index]);


    if (index >= products.length) return null;

    const prod = products[index];

    return (
        <div className="emphasisModalOverlay">
            <div className="emphasisModalContainer">
                {/* Novo título */}
                <h1 className="emphasisModalTitle">Item em promoção</h1>

                <div
                    className={`emphasisModalImage ${isVisible ? "emphasisModalPulse" : ""}`}
                    style={{
                        backgroundImage: `url('${prod.imageUrl}')`,
                    }}
                />

                <div className="emphasisModalText">
                    <h2 className="emphasisModalMessage">{prod.name}</h2>
                    <p className="emphasisModalPrice">{prod.price}</p>
                </div>
            </div>
        </div>
    );
}
