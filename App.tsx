import React from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./src/components/Sidebar";

const App: React.FC = () => {
  return (
    <div className="flex h-screen bg-base-200 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default App;
