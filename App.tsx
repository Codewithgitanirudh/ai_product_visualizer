import { Outlet } from "react-router";
import { Sidebar } from "./src/components/Sidebar";
import { SidebarProvider, useSidebarContext } from "./context/contextProvider";
import { Menu } from "lucide-react";
import { Header } from "./src/components/Header";

function AppContent() {
  return (
    <div className="flex h-screen bg-base-200 overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <AppHeader />
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function AppHeader() {
  const { setMobileOpen } = useSidebarContext();
  return (
    <div className="flex md:hidden items-center md:justify-between px-4 h-20 border-b border-base-300 bg-white sticky top-0 z-30">
      <button
        onClick={() => setMobileOpen(true)}
        className="p-2 rounded-lg hover:bg-base-200 transition"
        aria-label="Open sidebar navigation"
      >
        <Menu className="w-7 h-7" />
      </button>
      <Header />
    </div>
  );
}

function App() {
  return (
    <SidebarProvider>
      <AppContent />
    </SidebarProvider>
  );
}

export default App;
