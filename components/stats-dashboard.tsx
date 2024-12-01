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
    default: "2644c2ca-ca2b-4a66-9461-4a0d39fb95cf",
    filters: {
      "أوزبكستان": { male: "33801d7f-b340-41ce-aabd-cb4783fd3bcd", female: "997e2e29-26b1-46f5-9dad-14636468cbae" },
      "باكستان": { male: "fe94b1c3-3aac-497d-a7cd-f68322740149", female: "1767aad6-fc92-466f-984c-0b3bc7f39b2e" },
      "مصر": { male: "a8081025-6a4f-4463-9602-1f1fbba764ab", female: "328692f6-ec5a-4345-bbb2-dfe0bb46eeae" },
      "الهند": { male: "6601bd4b-542c-4df2-aa7b-abe6362181ac", female: "28165d84-2a57-4309-a560-e1b6f7213be2" },
      "أندونيسيا": { male: "7f342565-dfe3-43f7-9af4-0916a81265ea", female: "0796e7d7-fae1-40b1-86fa-f8d07de8b52d" },
      "اليمن": { male: "803471ec-a218-4d52-8af2-74b98f5b372c", female: "8dd75843-7541-49cf-b054-81400b869509" },
      "العراق": { male: "befef414-a970-430a-9a00-267c66895eb3", female: "b00d6027-d699-4483-b81e-16c4de01ee09" },
      "بنجلاديش": { male: "5eecf642-8460-4bba-9098-c4b434a3646c", female: "9ebdbdcf-3d13-4556-9b2f-003dbfa4b31c" },
      "السودان": { male: "0ed9804a-ef0e-462b-b2dd-58975fc1e87f", female: "4e358822-1a13-40b2-9799-eac1f5c8768e" },
      "الجزائر": { male: "22d546c7-d684-410f-bbd0-8a28d27566a8", female: "f929d85f-a645-407e-a1bd-5607f451fe8b" },
      "تركيا": { male: "3dd5b126-9c66-4457-956b-3788161c58a5", female: "8c720bd1-2396-48a3-a0d0-1d9a5d5574f9" }
    }
  },
  "المدينة المنورة - التنقل والخدمات المساندة": {
    id: "021f9c52-885f-46d2-a2c6-434e4dd7b2cb",
    default: "4375383e-b537-4044-8277-ae009c761c66",
    filters: {
      "أوزبكستان": { male: "adf4a500-bdf2-4d45-8772-c687557f06fe", female: "50055960-7338-409a-98c4-73c5a48b382e" },
      "باكستان": { male: "c2472731-fb43-4f8b-a72a-4575d004b745", female: "991a9cdc-af96-45ad-93ae-9f243bd82002" },
      "مصر": { male: "1d5dd6a4-b313-4298-814f-d1aea7dcabf8", female: "76e40ddb-99bb-41ce-adc7-979242f4b988" },
      "الهند": { male: "cd936a52-78c0-4a2c-846f-0f489fc04320", female: "fad0b5cb-a0f8-4682-99f1-7c9322c1ecf3" },
      "أندونيسيا": { male: "32a2cfcd-08dd-4764-bd2b-968118199f09", female: "b133cec2-74d7-4007-a22a-4771b501b029" },
      "اليمن": { male: "ddb1d654-ee4d-4284-b153-44da5df4b232", female: "6ac0c46e-1500-42b8-a277-0b9275c60c4a" },
      "العراق": { male: "adbc3abb-7b2b-4115-9514-301e667fc7ff", female: "1eabadc4-ead1-4a23-bfef-ab344d0d3bcd" },
      "بنجلاديش": { male: "6a547b5c-e16d-49c4-92f2-e30c0019127b", female: "6899ba60-ca05-4ead-b6a2-8d2499ee0a52" },
      "السودان": { male: "5dbef857-a439-43b3-9e96-692bd263c2f4", female: "47985f2b-bcb6-40be-9d9e-836b03d3ebb5" },
      "الجزائر": { male: "2ffc0af3-c240-463f-8992-47044b6ecf52", female: "0eb67995-5433-4f23-a76a-570cf643b6e0" },
      "تركيا": { male: "3aca9482-121a-4473-b254-e342b10fd5a2", female: "af5cd07b-474e-4af4-a88d-e6b2c23ee240" }
    }
  },
  "مكة المكرمة - مرحلة التنقل والخدمات المساندة": {
    id: "c5ac2e9b-f44f-4d8c-a688-8e7f13b5dc58",
    default: "0cea7cf2-4b0f-49cd-8851-825de1db14b0",
    filters: {
      "أوزبكستان": { male: "0cea7cf2-4b0f-49cd-8851-825de1db14b0", female: "67872fdd-2fdb-4096-9cd8-0cbc658dfb22" }
    }
  },
  "المدينة المنورة - المغادرة": {
    id: "9aa0cb12-05f3-4f75-b205-383ac1be4b0a",
    default: "F4_1",
    filters: {
      "أوزبكستان": { male: "F4_1", female: "F4_2" },
      "باكستان": { male: "101", female: "102" },
      "مصر": { male: "103", female: "104" },
      "الهند": { male: "105", female: "106" },
      "أندونيسيا": { male: "107", female: "108" },
      "اليمن": { male: "109", female: "110" },
      "العراق": { male: "111", female: "112" },
      "بنجلاديش": { male: "113", female: "114" },
      "السودان": { male: "115", female: "116" },
      "الجزائر": { male: "117", female: "118" },
      "تركيا": { male: "119", female: "120" }
    }
  },
  "المدينة المنورة - السفر": {
    id: "4fcfb48c-7645-4d72-966e-2f676c3e4002",
    default: "F5_1",
    filters: {
      "أوزبكستان": { male: "F5_1", female: "F5_2" },
      "باكستان": { male: "101", female: "102" },
      "مصر": { male: "103", female: "104" },
      "الهند": { male: "105", female: "106" },
      "أندونيسيا": { male: "107", female: "108" },
      "اليمن": { male: "109", female: "110" },
      "العراق": { male: "111", female: "112" },
      "بنجلاديش": { male: "113", female: "114" },
      "السودان": { male: "115", female: "116" },
      "الجزائر": { male: "117", female: "118" },
      "تركيا": { male: "119", female: "120" }
    }
  },
  "مكة المكرمة - التصاريح": {
    id: "f3243c55-6f52-4550-85f4-268c46782418",
    default: "F6_1",
    filters: {
      "أوزبكستان": { male: "F6_1", female: "F6_2" },
      "باكستان": { male: "101", female: "102" },
      "مصر": { male: "103", female: "104" },
      "الهند": { male: "105", female: "106" },
      "أندونيسيا": { male: "107", female: "108" },
      "اليمن": { male: "109", female: "110" },
      "العراق": { male: "111", female: "112" },
      "بنجلاديش": { male: "113", female: "114" },
      "السودان": { male: "115", female: "116" },
      "الجزائر": { male: "117", female: "118" },
      "تركيا": { male: "119", female: "120" }
    }
  },
  "مكة المكرمة - المغادرة": {
    id: "b2d83218-b55b-4ab3-bf7f-7fb183cbe502",
    default: "F7_1",
    filters: {
      "أوزبكستان": { male: "F7_1", female: "F7_2" },
      "باكستان": { male: "101", female: "102" },
      "مصر": { male: "103", female: "104" },
      "الهند": { male: "105", female: "106" },
      "أندونيسيا": { male: "107", female: "108" },
      "اليمن": { male: "109", female: "110" },
      "العراق": { male: "111", female: "112" },
      "بنجلاديش": { male: "113", female: "114" },
      "السودان": { male: "115", female: "116" },
      "الجزائر": { male: "117", female: "118" },
      "تركيا": { male: "119", female: "120" }
    }
  },
  "مكة المكرمة - أداء المناسك": {
    id: "761daa02-b819-4bbe-81f2-19c638e7f33a",
    default: "F8_1",
    filters: {
      "أوزبكستان": { male: "F8_1", female: "F8_2" },
      "باكستان": { male: "101", female: "102" },
      "مصر": { male: "103", female: "104" },
      "الهند": { male: "105", female: "106" },
      "أندونيسيا": { male: "107", female: "108" },
      "اليمن": { male: "109", female: "110" },
      "العراق": { male: "111", female: "112" },
      "بنجلاديش": { male: "113", female: "114" },
      "السودان": { male: "115", female: "116" },
      "الجزائر": { male: "117", female: "118" },
      "تركيا": { male: "119", female: "120" }
    }
  }
} as const

// Update the data object to use STAGES keys
const data = {
  stages: Object.keys(STAGES),
  nationalities: [
    "باكستان",
    "مصر",
    "الهند",
    "أندونيسيا",
    "اليمن",
    "العراق",
    "أوزبكستان",
    "بنجلاديش",
    "السودان",
    "الجزائر",
    "تركيا"
  ],
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
  const [showDetailedStats, setShowDetailedStats] = useState(false)

  // Update the fetchStageData function
  const fetchStageData = async (stageName: string) => {
    setIsLoading(true)
    try {
      const stage = STAGES[stageName as keyof typeof STAGES]
      const accessToken = localStorage.getItem('access_token')
      
      if (!accessToken) {
        throw new Error('No access token found')
      }

      // Use the default filter ID from the stage configuration
      const totalResponse = await fetch(`https://az2-api.xebo.ai/v3/survey-management/surveys/${stage.id}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          filterId: stage.default,  // This will now use the default filter ID defined in STAGES
          skip: 0,
          limit: 25,
          timeRange: ""
        })
      })
      
      const totalData = await totalResponse.json()
      
      const nationalityStats: Record<string, NationalityStats> = {}
      
      // If detailed view is requested, fetch individual nationality data
      if (showDetailedStats) {
        const allResponses = []
        for (const [nationality, filters] of Object.entries(stage.filters)) {
          // Male and female requests as before
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
          
          await sleep(Math.random() * 1500)

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
          
          if (nationality !== Object.keys(stage.filters).slice(-1)[0]) {
            await sleep(Math.random() * 2000)
          }
        }

        const allData = await Promise.all(allResponses.map(r => r.json()))
        
        // Process detailed nationality data as before
        Object.keys(stage.filters).forEach((nationality, index) => {
          const maleData = allData[index * 2]
          const femaleData = allData[index * 2 + 1]
          
          nationalityStats[nationality] = {
            nationality,
            maleSample: 48,
            maleCompleted: maleData.total || 0,
            femaleSample: 48,
            femaleCompleted: femaleData.total || 0,
            completionRate: ((maleData.total + femaleData.total) / 96) * 100
          }
        })
      }

      // Set the stats using the total data
      setStatsData({
        nationalityStats,
        totals: {
          totalSample: 96, // Adjust based on your requirements
          totalCompleted: totalData.total || 0,
          remaining: 96 - (totalData.total || 0),
          completionRate: ((totalData.total || 0) / 96) * 100
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
  }, [selectedStage, showDetailedStats])

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

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowDetailedStats(!showDetailedStats)}
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
        >
          {showDetailedStats ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
        </button>
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

