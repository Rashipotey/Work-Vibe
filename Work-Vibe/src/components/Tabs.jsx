import React, { useState } from "react";

export function Tabs({ defaultValue, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return React.Children.map(children, (child) =>
    React.cloneElement(child, { activeTab, setActiveTab })
  );
}

export function TabsList({ children, activeTab, setActiveTab }) {
    return (
      <div className="flex bg-gray-100 rounded-lg">
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { activeTab, setActiveTab })
        )}
      </div>
    );
}

export function TabsTrigger({ value, children, activeTab, setActiveTab }) {
  const isActive = value === activeTab;

  const handleClick = () => {
    if (typeof setActiveTab === "function") {
      setActiveTab(value);
    } else {
      console.error("setActiveTab is not a function");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-white text-[#00B09F] shadow"
          : "text-gray-600 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, activeTab, children }) {
  return value === activeTab ? <div className="mt-4">{children}</div> : null;
}
