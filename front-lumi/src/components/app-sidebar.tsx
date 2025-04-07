import { Link, useLocation } from "react-router-dom"
import { BarChart3, FileText, Home } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"

export function AppSidebar() {
  const location = useLocation()
  const pathname = location.pathname

  const menuItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      href: "/dashboard",
      isActive: pathname === "/dashboard",
    },
    {
      title: "Biblioteca de Faturas",
      icon: FileText,
      href: "/faturas",
      isActive: pathname === "/faturas",
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary p-1">
            <BarChart3 className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Energy Dashboard</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className = "mt-10">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={item.isActive}>
                <Link to={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">© 2025 Energy Dashboard</div>
      </SidebarFooter>
    </Sidebar>
  )
}

