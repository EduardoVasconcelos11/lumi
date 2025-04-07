import "./App.css"
import { Routes, Route } from "react-router-dom"
import { SidebarProvider } from "./components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"
import DashboardPage from "./pages/DashboardPage"
import FaturasPage from "./pages/FaturasPage"

function App() {
  return (    
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/faturas" element={<FaturasPage />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  )
}
export default App
