import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = "", onClick, hover = false }: CardProps) {
  const hoverStyles = hover ? "hover:shadow-lg hover:scale-[1.01]" : "";
  const cursorStyle = onClick ? "cursor-pointer" : "";

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm transition-all ${hoverStyles} ${cursorStyle} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`p-4 border-b border-gray-100 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`p-4 border-t border-gray-100 ${className}`}>{children}</div>;
}