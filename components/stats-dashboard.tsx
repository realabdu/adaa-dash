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
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

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
    default: "38dea87e-0a36-4be6-9d6e-34cd9ea80844",
    filters: {
      "أوزبكستان": { male: "0cea7cf2-4b0f-49cd-8851-825de1db14b0", female: "67872fdd-2fdb-4096-9cd8-0cbc658dfb22" },
      "باكستان": { male: "17b7ff5c-6f72-4aac-8849-813e9e1cda40", female: "a028a956-3104-46e2-85db-9806729a618f" },
      "مصر": { male: "0abdc112-3120-4174-a56b-6903a5aa784d", female: "a4b6327b-2c0e-4428-838c-1036a87d4e90" },
      "الهند": { male: "bb7b72ef-52c9-4b8e-875e-8844840695f3", female: "3e4d3adb-a76f-4de0-b24f-5c1516724346" },
      "أندونيسيا": { male: "36b454f6-7b50-4ed7-a45c-1cbcacc38ca7", female: "5471979f-f4c4-480f-952c-1007b8a2e2e4" },
      "اليمن": { male: "d18e68fc-4302-4b96-95d6-4b9879bc8eec", female: "8cb0160f-b268-40ab-b78e-6a3cab15b6f7" },
      "العراق": { male: "46db9724-d88d-401c-982f-fa7c3b373126", female: "b6ba304a-02c1-49df-8873-0f9b0c506a98" },
      "بنجلاديش": { male: "6e0d5e72-82cd-4078-9033-08c57fac4e7d", female: "f951c772-918d-4081-bae1-1dba7bdf2b8a" },
      "السودان": { male: "a94c4cf9-4efc-4572-82ed-e9aa155f12f0", female: "3091c1d6-677f-4e7e-9f02-271b6fe6ab40" },
      "الجزائر": { male: "8c831e6f-e48f-4fdb-ac8c-f8bba4fddb49", female: "9c91bc38-28c7-449a-ab9d-14891be76411" },
      "تركيا": { male: "00be04e0-cc4f-4d35-b33d-f9da0f01fdb1", female: "b9f6a720-18f2-47d5-a939-39ce1dc9e991" }
    }
  },
  "المدينة المنورة - المغادرة": {
    id: "9aa0cb12-05f3-4f75-b205-383ac1be4b0a",
    default: "fa124aa4-39e5-44e5-9108-58a33e1021d8",
    filters: {
      "أوزبكستان": { male: "b5fe0fe1-ab77-4680-8b82-3a32f87096e0", female: "22d19da6-91c7-427b-bb11-32a218ba6db6" },
      "باكستان": { male: "77e29a9d-2525-4a00-bd13-8e7a681e4e62", female: "7943981c-df8e-417d-afaa-d2097ff3c419" },
      "مصر": { male: "14180bbf-ecd5-46ef-96f5-3b6616dcae64", female: "738e08f9-0c48-4927-b104-dfffee72a618" },
      "الهند": { male: "c30f5b43-4674-4582-a8c5-f3b7166d9115", female: "7eaa875e-ade6-4419-bd60-d64fd1913db3" },
      "أندونيسيا": { male: "68e50f93-f440-4c7c-9633-757b869c0f61", female: "038c71b2-03d2-4943-a88a-cfbeec265628" },
      "اليمن": { male: "a7db0c47-f9c5-42ab-b3a3-cbed64033a65", female: "35662fde-ccaf-4faf-a629-4da5db39632a" },
      "العراق": { male: "d79cf692-bde8-4f4b-b351-78f663b8bcf3", female: "2ff36db4-19aa-4ea4-b449-a0a8bb7f76cc" },
      "بنجلاديش": { male: "4adff2c2-fcaa-4d7c-b930-0601afb764e3", female: "b5263a6a-971f-4300-b5a4-229a29d28c47" },
      "السودان": { male: "e9d81202-0d22-48a9-90cd-e2e71c13307c", female: "bd522a57-913d-4ee3-8c04-445316b94ee0" },
      "الجزائر": { male: "25bd67ef-0eb2-4555-9df3-9750bcf52141", female: "a107d8a9-51bf-4041-888b-9762ee9207a8" },
      "تركيا": { male: "c5b18df6-8c7c-43d8-98a4-d73f0c4512e5", female: "f012f2c7-ef38-44f2-9b8b-8c6e9a8364f9" }
    }
  },
  "المدينة المنورة - السفر": {
    id: "4fcfb48c-7645-4d72-966e-2f676c3e4002",
    default: "93457af8-8c5c-45d5-af18-a189ca9821f6",
    filters: {
      "أوزبكستان": { male: "b41ddc0c-2910-4947-92ed-b7c9cfd524af", female: "d9d547d9-b44b-44e3-a6ae-ad29d40053ff" },
      "باكستان": { male: "adc215a4-7503-4593-815a-ceb87d8d61d4", female: "1d334ae9-1235-4780-8ba9-e9a83d13852c" },
      "مصر": { male: "046ed344-7fea-46de-802f-c7ce8acdab83", female: "4a9f5296-27e3-49fd-92ee-977683d9c676" },
      "الهند": { male: "0631dbd9-3e2f-43b2-b124-5be40ec70e4c", female: "8f8a3eff-d90f-49df-b897-2ab3f01255a4" },
      "أندونيسيا": { male: "151b729e-419c-4fe3-93bd-5db87934952b", female: "d6dfe6a5-85a4-4256-9c34-1ba5ec810b5a" },
      "اليمن": { male: "2b479783-7a00-4ac2-8697-6a8de2d28b57", female: "08125f37-56e3-416e-9bb9-1f10fd20ed2c" },
      "العراق": { male: "28cf0e51-d223-43d3-9fca-99c5602f22fa", female: "852d5ef9-aa92-4eed-83b3-0d0c77c51ab6" },
      "بنجلاديش": { male: "588cb59c-d5c8-4933-90f3-5b244ef00c03", female: "d7c195ef-28f4-4b43-98f4-a1f158b44508" },
      "السودان": { male: "0bb67ce9-a807-4cd1-a55a-5c149c2453c1", female: "3a318db4-5d3a-4bf1-9f81-c917f181c7f5" },
      "الجزائر": { male: "60a1e75a-708b-463b-8e83-671e0271ef38", female: "229e9176-055c-48fe-98aa-e13f6ed3e95a" },
      "تركيا": { male: "a7d5976b-d2d4-4859-8c3f-d1106dc5e799", female: "cbe3c1e8-a73a-4277-973a-cb3773f37a00" }
    }
  },
  "مكة المكرمة - التصاريح": {
    id: "f3243c55-6f52-4550-85f4-268c46782418",
    default: "19afdfb9-a710-4d22-b2e4-1b02ee0c33bc",
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
    default: "fbf9f2a8-c547-4930-ba79-8b624869803d",
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
  "مكة المكرمة - السفر": {
    id: "761daa02-b819-4bbe-81f2-19c638e7f33a",
    default: "5cec0bde-85ec-4ed9-a565-420a4a536b7b",
    filters: {
      "أوزبكستان": { male: "F8_1", female: "F8_2" },
      "باكستان": { male: "101", female: "102" },
      "مصر": { male: "103", female: "104" },
      "الهند": { male: "105", female: "106" },
      "أندونيسيا": { male: "107", female: "108" },
      "اليمن": { male: "109", female: "110" },
      "العراق": { male: "111", female: "112" },
      "بنجلادي": { male: "113", female: "114" },
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
          totalSample: 1164, // Adjust based on your requirements
          totalCompleted: totalData.total || 0,
          remaining: 1164 - (totalData.total || 0),
          completionRate: Number((((totalData.total || 0) / 1164) * 100).toFixed(2))
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

  // Add animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  return (
    <motion.div 
      className="p-6 space-y-6"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      <motion.div 
        className="flex items-center justify-between pb-4 border-b"
        variants={fadeIn}
        transition={{ delay: 0.2 }}
      >
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
      </motion.div>

      <motion.div 
        className="flex flex-col sm:flex-row gap-4"
        variants={fadeIn}
        transition={{ delay: 0.3 }}
      >
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
      </motion.div>

      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={fadeIn}
        transition={{ delay: 0.4 }}
      >
        {[
          { 
            title: "إجمالي العينة",
            value: statsData?.totals.totalSample || 0,
            icon: "📊"
          },
          { 
            title: "مكتمل",
            value: statsData?.totals.totalCompleted || 0,
            color: "text-green-600",
            icon: "✅"
          },
          { 
            title: "متبقي",
            value: statsData?.totals.remaining || 0,
            color: "text-yellow-600",
            icon: "⏳"
          },
          { 
            title: "نسبة الإنجاز",
            value: `${statsData?.totals.completionRate || 0}%`,
            color: "text-blue-600",
            icon: "📈"
          }
        ].map((item, index) => (
          <motion.div
            key={item.title}
            variants={fadeIn}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-right w-full flex items-center justify-between">
                  {item.title}
                  <span className="text-xl">{item.icon}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-right">
                <div className={`text-2xl font-bold ${item.color || ''}`}>
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  ) : (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                    >
                      {item.value}
                    </motion.span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="flex justify-center mb-4"
        variants={fadeIn}
        transition={{ delay: 0.6 }}
      >
        <button
          onClick={() => setShowDetailedStats(!showDetailedStats)}
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {showDetailedStats ? '⬆️ إخفاء التفاصيل' : '⬇️ عرض التفاصيل'}
        </button>
      </motion.div>

      {showDetailedStats && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-right">إحصائيات مفصلة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
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
                    {data.nationalities.map((nationality, index) => {
                      const stats = statsData?.nationalityStats[nationality]
                      return (
                        <motion.tr
                          key={nationality}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
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
                        </motion.tr>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}

