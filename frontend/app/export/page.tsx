"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { 
  Download, 
  FileSpreadsheet, 
  FileText,
  Calendar,
  CheckCircle2,
  PawPrint,
  Mic,
  BarChart3
} from "lucide-react"

const exportOptions = [
  {
    id: "animals",
    label: "Animal Records",
    description: "All animal profiles, intake info, and current status",
    icon: PawPrint,
    records: 23
  },
  {
    id: "checkins",
    label: "Check-In History",
    description: "Voice transcripts and extracted data from all check-ins",
    icon: Mic,
    records: 147
  },
  {
    id: "insights",
    label: "Weekly Insights",
    description: "Care patterns, volunteer stats, and follow-up tracking",
    icon: BarChart3,
    records: 1
  }
]

const formatOptions = [
  {
    id: "excel",
    label: "Excel (.xlsx)",
    description: "Best for spreadsheet applications",
    icon: FileSpreadsheet
  },
  {
    id: "csv",
    label: "CSV",
    description: "Universal format for data import",
    icon: FileText
  }
]

export default function ExportPage() {
  const [selectedData, setSelectedData] = useState<string[]>(["animals", "checkins"])
  const [selectedFormat, setSelectedFormat] = useState("excel")
  const [isExporting, setIsExporting] = useState(false)
  const [exported, setExported] = useState(false)

  const toggleData = (id: string) => {
    setSelectedData(prev => 
      prev.includes(id) 
        ? prev.filter(d => d !== id)
        : [...prev, id]
    )
  }

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      setExported(true)
      setTimeout(() => setExported(false), 3000)
    }, 1500)
  }

  const totalRecords = exportOptions
    .filter(opt => selectedData.includes(opt.id))
    .reduce((sum, opt) => sum + opt.records, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Export Data
          </h1>
          <p className="mt-2 text-muted-foreground">
            Export your shelter data for reporting, backup, or analysis
          </p>
        </div>

        <div className="space-y-6">
          {/* Data Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Data to Export</CardTitle>
              <CardDescription>Choose which records to include in your export</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {exportOptions.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                    selectedData.includes(option.id)
                      ? "border-primary/50 bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <Checkbox
                    id={option.id}
                    checked={selectedData.includes(option.id)}
                    onCheckedChange={() => toggleData(option.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={option.id}
                      className="flex cursor-pointer items-center gap-2 text-base font-medium"
                    >
                      <option.icon className="h-4 w-4 text-muted-foreground" />
                      {option.label}
                    </Label>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {option.records} records
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Format Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Export Format</CardTitle>
              <CardDescription>Choose your preferred file format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {formatOptions.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                      selectedFormat === format.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <format.icon className={`h-5 w-5 ${
                      selectedFormat === format.id ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <div>
                      <div className="font-medium text-foreground">{format.label}</div>
                      <div className="mt-0.5 text-sm text-muted-foreground">
                        {format.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date Range */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                Date Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["Last 7 days", "Last 30 days", "Last 90 days", "All time"].map((range) => (
                  <Badge
                    key={range}
                    variant={range === "Last 30 days" ? "default" : "outline"}
                    className="cursor-pointer"
                  >
                    {range}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Summary */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <div>
                  <div className="text-lg font-semibold text-foreground">
                    Ready to Export
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedData.length} data types · {totalRecords} total records · {selectedFormat.toUpperCase()} format
                  </div>
                </div>
                <Button 
                  onClick={handleExport}
                  disabled={selectedData.length === 0 || isExporting}
                  className="gap-2"
                  size="lg"
                >
                  {exported ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Downloaded!
                    </>
                  ) : isExporting ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5" />
                      Export Data
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <p className="text-center text-sm text-muted-foreground">
            Exports are compatible with Google Sheets, Microsoft Excel, and most data analysis tools.
            Personal information is handled according to your organization&apos;s data policies.
          </p>
        </div>
      </main>
    </div>
  )
}
