"use client"

import {
  HomeIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline"
import { clsx } from "clsx"

type TabType = "dashboard" | "query" | "analytics" | "reports"

interface SidebarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const navigation = [
  { name: "Dashboard", tab: "dashboard" as TabType, icon: HomeIcon },
  { name: "Query Builder", tab: "query" as TabType, icon: MagnifyingGlassIcon },
  { name: "Analytics", tab: "analytics" as TabType, icon: ChartBarIcon },
  { name: "Reports", tab: "reports" as TabType, icon: DocumentTextIcon },
]

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.name}>
                <button
                  onClick={() => onTabChange(item.tab)}
                  className={clsx(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    activeTab === item.tab
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
