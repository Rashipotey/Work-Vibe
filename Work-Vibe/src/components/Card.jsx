import React from "react";

export function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>{children}</div>;
}

export function CardHeader({ children, activeTab, setActiveTab }) {
    return React.Children.map(children, (child) =>
      React.cloneElement(child, { activeTab, setActiveTab })
    );
}  

export function CardContent({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return <div className={`mt-4 ${className}`}>{children}</div>;
}
