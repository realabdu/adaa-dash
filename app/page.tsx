"use client"

import { useState } from "react"
import { PassKeyAuth } from "@/components/pass-key"
import { StatsDashboard } from "@/components/stats-dashboard"

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return <PassKeyAuth onAuth={setIsAuthenticated} />
  }

  return <StatsDashboard />
}

