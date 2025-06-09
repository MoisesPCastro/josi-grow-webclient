"use client";

import Image from "next/image";

export const ImageModal = ({
    src,
    alt,
    onClose
}: {
    src: string;
    alt: string;
    onClose: () => void
}) => {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="relative max-w-4xl w-full max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-white hover:text-yellowgreen text-3xl z-10"
                >
                    ✕
                </button>
                <div className="relative w-full max-h-[80vh] h-auto aspect-[4/3]">
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                    />
                </div>
            </div>
        </div>
    );
};