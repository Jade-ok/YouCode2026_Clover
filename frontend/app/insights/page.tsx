"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  PawPrint, 
  Mic,
  AlertCircle,
  CheckCircle2,
  Download,
  Stethoscope,
  Heart,
  Utensils,
  Brain
} from "lucide-react"
import { insightsData } from "@/lib/data"
import { cn } from "@/lib/utils"

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Insights
            </h1>
            <p className="mt-2 text-muted-foreground">
              Organization-wide patterns and volunteer performance
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export to Excel
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mic className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{insightsData.weeklyStats.totalCheckIns}</div>
                  <div className="text-sm text-muted-foreground">Check-ins this week</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/30 text-accent-foreground">
                  <PawPrint className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{insightsData.weeklyStats.animalsMonitored}</div>
                  <div className="text-sm text-muted-foreground">Animals monitored</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10 text-info">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{insightsData.weeklyStats.volunteersActive}</div>
                  <div className="text-sm text-muted-foreground">Active volunteers</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{insightsData.completionRate}%</div>
                  <div className="text-sm text-muted-foreground">Completion rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Care Needs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                Most Common Care Needs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insightsData.commonCareNeeds.map((need, index) => {
                  const maxCount = Math.max(...insightsData.commonCareNeeds.map(n => n.count))
                  const percentage = (need.count / maxCount) * 100
                  
                  const icons = [Stethoscope, Brain, Utensils, Heart, PawPrint]
                  const Icon = icons[index % icons.length]
                  
                  return (
                    <div key={need.need} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{need.need}</span>
                        </div>
                        <span className="text-muted-foreground">{need.count} this week</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div 
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Medical Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                Check-In Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="relative flex h-48 w-48 items-center justify-center">
                  {/* Circular Progress */}
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-muted"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeDasharray={`${insightsData.medicalPercentage * 2.51} 251`}
                      strokeLinecap="round"
                      className="text-destructive"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <div className="text-3xl font-bold text-foreground">{insightsData.medicalPercentage}%</div>
                    <div className="text-xs text-muted-foreground">Medical Issues</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-destructive">{insightsData.medicalPercentage}%</div>
                  <div className="text-xs text-muted-foreground">Involve medical concerns</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-success">{100 - insightsData.medicalPercentage}%</div>
                  <div className="text-xs text-muted-foreground">Routine check-ins</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unresolved Follow-ups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                Unresolved Follow-ups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insightsData.unresolvedFollowups.map((item) => (
                  <div 
                    key={item.animal + item.issue}
                    className="flex items-start gap-3 rounded-lg bg-muted/50 p-3"
                  >
                    <div className={cn(
                      "mt-1 h-2 w-2 shrink-0 rounded-full",
                      item.priority === "high" ? "bg-destructive" : "bg-warning"
                    )} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{item.animal}</span>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            item.priority === "high" 
                              ? "border-destructive/30 bg-destructive/10 text-destructive" 
                              : "border-warning/30 bg-warning/20 text-warning-foreground"
                          )}
                        >
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{item.issue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Volunteer Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                Volunteer Note Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-6">
                <div className="relative flex h-32 w-32 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-muted"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      strokeDasharray={`${insightsData.completionRate * 2.51} 251`}
                      strokeLinecap="round"
                      className="text-success"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <div className="text-2xl font-bold text-foreground">{insightsData.completionRate}%</div>
                  </div>
                </div>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Volunteers are completing {insightsData.completionRate}% of scheduled check-ins on time
                </p>
              </div>
              
              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg check-ins per animal</span>
                  <span className="font-medium text-foreground">{insightsData.weeklyStats.avgCheckInsPerAnimal}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active volunteers</span>
                  <span className="font-medium text-foreground">{insightsData.weeklyStats.volunteersActive}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Animals monitored</span>
                  <span className="font-medium text-foreground">{insightsData.weeklyStats.animalsMonitored}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Value Proposition */}
        <Card className="mt-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="py-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Institutional Knowledge, Preserved
              </h2>
              <p className="mt-4 text-muted-foreground">
                EchoSource helps nonprofits find patterns, support volunteers, and retain institutional knowledge. 
                A new volunteer can understand an animal&apos;s full context in 30 seconds, ensuring consistent, 
                compassionate care across shift changes.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                  Voice-first input
                </Badge>
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                  AI-extracted insights
                </Badge>
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                  Seamless handoffs
                </Badge>
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                  Pattern detection
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
