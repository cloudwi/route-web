import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

export function Loader({ size = "md", text, fullScreen = false }: LoaderProps) {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const content = (
    <>
      <Loader2 className={`${sizeMap[size]} text-blue-500 animate-spin mx-auto mb-4`} />
      {text && <p className="text-gray-500">{text}</p>}
    </>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">{content}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">{content}</div>
    </div>
  );
}
