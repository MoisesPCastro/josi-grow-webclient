"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { ICloseButtonProps } from "./interfaces";

export default function CloseButton({
    onClick,
    children = "X",
    className = "",
    title = "Voltar para a página inicial",
    defaultRoute = "/",
    color = "black",
    size = "md",
}: ICloseButtonProps) {
    const router = useRouter();

    const colorClasses = {
        black: "bg-black hover:bg-gray-800 text-white",
        purple: "bg-purple-500 hover:bg-purple-600 text-white",
        red: "bg-red-500 hover:bg-red-600 text-white",
        white: "bg-white hover:bg-gray-100 text-black border border-gray-300",
    };

    const sizeClasses = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-5 py-3 text-lg",
    };

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            router.push(defaultRoute);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`
        rounded-full transition-colors
        ${colorClasses[color]}
        ${sizeClasses[size]}
        ${className}
      `}
            title={title}
        >
            {children}
        </button>
    );
}