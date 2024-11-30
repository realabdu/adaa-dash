"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function PassKeyAuth({ onAuth }: { onAuth: (isAuth: boolean) => void }) {
  const [passKey, setPassKey] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passKey === "demo123") {
      try {
        const response = await fetch('https://api.xebo.ai/api/v1/login', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'x-service-name': 'survey-dashboard-frontend-service',
          },
          body: JSON.stringify({
            email: "osama@almalath.com",
            password: "QWRhYUAxMTIyMzM0NA=="
          })
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();
        // Assuming the response includes access_token and refresh_token
        // Store tokens in localStorage or secure storage
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        onAuth(true);
        setError("");
      } catch  {
        setError("Authentication failed. Please try again.");
      }
    } else {
      setError("Invalid pass-key");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>الوصول إلى لوحة المعلومات</CardTitle>
          <CardDescription>أدخل كلمة المرور لعرض لوحة الإحصائيات</CardDescription>
        </CardHeader>
        <CardContent className="text-right">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPass ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                value={passKey}
                onChange={(e) => setPassKey(e.target.value)}
                className="pl-10 text-right"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full">
              الدخول إلى لوحة المعلومات
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

