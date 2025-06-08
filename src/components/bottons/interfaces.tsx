import { ReactNode } from "react";

export interface ICloseButtonProps {
    onClick?: () => void;
    children?: ReactNode;
    className?: string;
    title?: string;
    defaultRoute?: string;
    color?: "black" | "purple" | "red" | "white";
    size?: "sm" | "md" | "lg";
}
