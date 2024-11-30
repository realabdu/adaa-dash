"use client"

import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Add this helper function at the top of the file, after the interfaces
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Restructured STAGES data to map filters to nationalities and genders
const STAGES = {
  "المدينة المنورة  - التصاريح": {
    id: "afb60c54-8975-45d9-94ea-7ad2ef177ab2",
    filters: {
      "أوزبكستان": { male: "33801d7f-b340-41ce-aabd-cb4783fd3bcd", female: "997e2e29-26b1-46f5-9dad-14636468cbae" }
    }
  },
  "المدينة المنورة - التنقل والخدمات المساندة": {
    id: "021f9c52-885f-46d2-a2c6-434e4dd7b2cb",
    filters: {
      "أوزبكستان": { male: "adf4a500-bdf2-4d45-8772-c687557f06fe", female: "50055960-7338-409a-98c4-73c5a48b382e" }
    }
  },
  "مكة المكرمة - مرحلة التنقل والخدمات المساندة": {
    id: "c5ac2e9b-f44f-4d8c-a688-8e7f13b5dc58",
    filters: {
      "أوزبكستان": { male: "0cea7cf2-4b0f-49cd-8851-825de1db14b0", female: "67872fdd-2fdb-4096-9cd8-0cbc658dfb22" }
    }
  },
  "المدينة المنورة - المغادرة": {
    id: "9aa0cb12-05f3-4f75-b205-383ac1be4b0a",
    filters: {
      "أوزبكستان": { male: "F4_1", female: "F4_2" }
    }
  },
  "المدينة المنورة - السفر": {
    id: "4fcfb48c-7645-4d72-966e-2f676c3e4002",
    filters: {
      "أوزبكستان": { male: "F5_1", female: "F5_2" }
    }
  },
  "مكة المكرمة - التصاريح": {
    id: "f3243c55-6f52-4550-85f4-268c46782418",
    filters: {
      "أوزبكستان": { male: "F6_1", female: "F6_2" }
    }
  },
  "مكة المكرمة - المغادرة": {
    id: "b2d83218-b55b-4ab3-bf7f-7fb183cbe502",
    filters: {
      "أوزبكستان": { male: "F7_1", female: "F7_2" }
    }
  },
  "مكة المكرمة - أداء المناسك": {
    id: "761daa02-b819-4bbe-81f2-19c638e7f33a",
    filters: {
      "أوزبكستان": { male: "F8_1", female: "F8_2" }
    }
  }
} as const

// Update the data object to use STAGES keys
const data = {
  stages: Object.keys(STAGES),
  nationalities: ["أوزبكستان"],
  statistics: {
    // This would contain the actual statistics from your data
    // Simplified for demo purposes
  }
}

// Add this interface for better type safety
interface NationalityStats {
  nationality: string;
  maleSample: number;
  maleCompleted: number;
  femaleSample: number;
  femaleCompleted: number;
  completionRate: number;
}

interface StatsDataType {
  nationalityStats: Record<string, NationalityStats>;
  totals: {
    totalSample: number;
    totalCompleted: number;
    remaining: number;
    completionRate: number;
  };
}

export function StatsDashboard() {
  const [selectedStage, setSelectedStage] = useState(data.stages[0])
  const [statsData, setStatsData] = useState<StatsDataType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Update the fetchStageData function
  const fetchStageData = async (stageName: string) => {
    setIsLoading(true)
    try {
      const stage = STAGES[stageName as keyof typeof STAGES]
      const accessToken = localStorage.getItem('access_token')
      
      if (!accessToken) {
        throw new Error('No access token found')
      }

      // Fetch data for all nationalities with random delays
      const allResponses = []
      for (const [nationality, filters] of Object.entries(stage.filters)) {
        // Male request
        const maleResponse = await fetch(`https://az2-api.xebo.ai/v3/survey-management/surveys/${stage.id}/responses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            filterId: filters.male,
            skip: 0,
            limit: 25,
            timeRange: ""
          })
        })
        allResponses.push(maleResponse)
        
        // Random delay between 0-2000ms
        await sleep(Math.random() * 2000)

        // Female request
        const femaleResponse = await fetch(`https://az2-api.xebo.ai/v3/survey-management/surveys/${stage.id}/responses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            filterId: filters.female,
            skip: 0,
            limit: 25,
            timeRange: ""
          })
        })
        allResponses.push(femaleResponse)
        
        // Random delay between 0-2000ms (except after the last request)
        if (nationality !== Object.keys(stage.filters).slice(-1)[0]) {
          await sleep(Math.random() * 2000)
        }
      }

      const allData = await Promise.all(allResponses.map(r => r.json()))
      
      // Process the data
      let totalSample = 0
      let totalCompleted = 0
      const nationalityStats: Record<string, NationalityStats> = {}

      Object.keys(stage.filters).forEach((nationality, index) => {
        const maleData = allData[index * 2]
        const femaleData = allData[index * 2 + 1]
        
        const maleSample = 48 // Replace with actual sample size from your requirements
        const femaleSample = 48 // Replace with actual sample size from your requirements
        const maleCompleted = maleData.total || 0
        const femaleCompleted = femaleData.total || 0
        
        totalSample += (maleSample + femaleSample)
        totalCompleted += (maleCompleted + femaleCompleted)

        nationalityStats[nationality] = {
          nationality,
          maleSample,
          maleCompleted,
          femaleSample,
          femaleCompleted,
          completionRate: ((maleCompleted + femaleCompleted) / (maleSample + femaleSample)) * 100
        }
      })

      setStatsData({
        nationalityStats,
        totals: {
          totalSample,
          totalCompleted,
          remaining: totalSample - totalCompleted,
          completionRate: (totalCompleted / totalSample) * 100
        }
      })
    } catch (error) {
      console.error('Error fetching stage data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStageData(selectedStage)
  }, [selectedStage])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-4">
            <img 
              src="https://sadacx.vercel.app/image/logo/sada.webp"
              alt="Sada Logo" 
              className="h-7 w-auto"
            />
            <span className="text-xl font-bold text-muted-foreground">×</span>
            <img 
              src="https://www.adaa.gov.sa/wp-content/uploads/2022/12/ADAA-Logo-English-Original-colors-01-1-e1672645487668.png"
              alt="Partner Logo" 
              className="h-10 w-auto"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">لوحة المعلومات</h1>
            <p className="text-sm text-muted-foreground">
              إحصائيات وتحليلات المسح
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select onValueChange={setSelectedStage} defaultValue={selectedStage}>
          <SelectTrigger className="w-full sm:w-[300px] text-right">
            <SelectValue placeholder="اختر المرحلة" />
          </SelectTrigger>
          <SelectContent>
            {data.stages.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "إجمالي العينة", value: statsData?.totals.totalSample || 0 },
          { title: "مكتمل", value: statsData?.totals.totalCompleted || 0, color: "text-green-600" },
          { title: "متبقي", value: statsData?.totals.remaining || 0, color: "text-yellow-600" },
          { title: "نسبة الإنجاز", value: `${statsData?.totals.completionRate || 0}%`, color: "text-blue-600" }
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right w-full">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-right">
              <div className={`text-2xl font-bold ${item.color || ''} ${isLoading ? 'opacity-50' : ''}`}>
                {isLoading ? '...' : item.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-right">إحصائيات مفصلة</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الجنسية</TableHead>
                <TableHead className="text-right">عينة الذكور</TableHead>
                <TableHead className="text-right">الذكور المكتملين</TableHead>
                <TableHead className="text-right">عينة الإناث</TableHead>
                <TableHead className="text-right">الإناث المكتملات</TableHead>
                <TableHead className="text-right">نسبة الإنجاز</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.nationalities.map((nationality) => {
                const stats = statsData?.nationalityStats[nationality]
                return (
                  <TableRow key={nationality}>
                    <TableCell className="font-medium text-right">{nationality}</TableCell>
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <TableCell key={i} className="text-right opacity-50">...</TableCell>
                      ))
                    ) : (
                      <>
                        <TableCell className="text-right">{stats?.maleSample || 0}</TableCell>
                        <TableCell className="text-right">{stats?.maleCompleted || 0}</TableCell>
                        <TableCell className="text-right">{stats?.femaleSample || 0}</TableCell>
                        <TableCell className="text-right">{stats?.femaleCompleted || 0}</TableCell>
                        <TableCell className="text-right">
                          {stats ? `${Math.round(stats.completionRate)}%` : '0%'}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

