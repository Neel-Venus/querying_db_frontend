"use client"

import { useState } from "react"
import { QueryBuilder } from "@/components/QueryBuilder"
import { Dashboard } from "@/components/Dashboard"
import { Analytics } from "@/components/Analytics"
import { Reports } from "@/components/Reports"
import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"

type TabType = "dashboard" | "query" | "analytics" | "reports"

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "query":
        return <QueryBuilder />
      case "analytics":
        return <Analytics />
      case "reports":
        return <Reports />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="min-w-0 flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
