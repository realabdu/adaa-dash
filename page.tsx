"use client"

import { useState } from "react"
import { PassKeyAuth } from "./auth/pass-key"
import { StatsDashboard } from "./dashboard/stats-dashboard"

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return <PassKeyAuth onAuth={setIsAuthenticated} />
  }

  return <StatsDashboard />
}

