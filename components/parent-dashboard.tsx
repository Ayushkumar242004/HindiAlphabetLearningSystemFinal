"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Star, AlertTriangle, Trophy, BarChart3, BookOpen, Award } from "lucide-react"
import type { Alphabet } from "@/lib/alphabets"

interface ParentDashboardProps {
  progress: Record<number, number>
  stars: Record<number, number>
  alphabets: Alphabet[]
  onClose: () => void
}

export default function ParentDashboard({ progress, stars, alphabets, onClose }: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate statistics
  const completedCount = Object.keys(progress).length
  const totalAlphabets = alphabets.length
  const completionPercentage = Math.round((completedCount / totalAlphabets) * 100)

  const totalStars = Object.values(stars).reduce((sum, count) => sum + count, 0)
  const maxPossibleStars = completedCount * 3
  const starPercentage = maxPossibleStars > 0 ? Math.round((totalStars / maxPossibleStars) * 100) : 0

  // Find alphabets that need more practice (accuracy < 70%)
  const needsPractice = Object.entries(progress)
    .filter(([_, accuracy]) => accuracy < 70)
    .map(([index]) => alphabets[Number.parseInt(index)])

  // Find best performed alphabets (accuracy > 90%)
  const bestPerformed = Object.entries(progress)
    .filter(([_, accuracy]) => accuracy > 90)
    .map(([index]) => alphabets[Number.parseInt(index)])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-400 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="lg"
            onClick={onClose}
            className="mr-4 bg-white/30 hover:bg-white/40 text-indigo-900 rounded-full px-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Learning
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">Parent Dashboard</h1>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6 bg-white/30 p-1 rounded-full">
            <TabsTrigger
              value="overview"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Detailed Progress
            </TabsTrigger>
            <TabsTrigger
              value="recommendations"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-200" />
                    Completion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{completionPercentage}%</div>
                  <p className="text-sm text-blue-100">
                    {completedCount} of {totalAlphabets} alphabets
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-400 to-amber-500 text-white border-none shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Star className="h-5 w-5 mr-2 text-yellow-100 fill-yellow-100" />
                    Stars Earned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{totalStars}</div>
                  <p className="text-sm text-yellow-100">{starPercentage}% of possible stars</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-500 to-rose-500 text-white border-none shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <AlertTriangle className="h-5 w-5 mr-2 text-pink-200" />
                    Needs Practice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{needsPractice.length}</div>
                  <p className="text-sm text-pink-100">Alphabets requiring more practice</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/90 backdrop-blur-sm border-none shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-blue-100">Your child's recent learning progress</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Object.entries(progress)
                    .slice(-5)
                    .reverse()
                    .map(([index, accuracy]) => {
                      const alphabetIndex = Number.parseInt(index)
                      const alphabet = alphabets[alphabetIndex]
                      const starCount = stars[alphabetIndex] || 0

                      return (
                        <div key={index} className="flex items-center justify-between border-b border-indigo-100 pb-3">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mr-3 shadow-md">
                              <span className="text-xl font-bold text-indigo-600">{alphabet.character}</span>
                            </div>
                            <div>
                              <p className="font-medium text-indigo-800">{alphabet.name}</p>
                              <p className="text-sm text-indigo-500">Accuracy: {accuracy}%</p>
                            </div>
                          </div>
                          <div className="flex">
                            {[1, 2, 3].map((i) => (
                              <Star
                                key={i}
                                className={`h-6 w-6 ${i <= starCount ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card className="bg-white/90 backdrop-blur-sm border-none shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Detailed Progress
                </CardTitle>
                <CardDescription className="text-green-100">
                  Tracking your child's progress with each alphabet
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {alphabets.map((alphabet, index) => {
                    const accuracy = progress[index] || 0
                    const starCount = stars[index] || 0
                    const isCompleted = accuracy > 0

                    return (
                      <div
                        key={index}
                        className={`border-2 rounded-xl p-4 shadow-md transform transition-transform hover:scale-105 ${
                          isCompleted
                            ? accuracy > 90
                              ? "bg-gradient-to-br from-green-100 to-emerald-200 border-green-300"
                              : accuracy > 70
                                ? "bg-gradient-to-br from-blue-100 to-indigo-200 border-blue-300"
                                : "bg-gradient-to-br from-orange-100 to-amber-200 border-orange-300"
                            : "bg-gradient-to-br from-gray-100 to-slate-200 border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 shadow-md">
                            <span className="text-xl font-bold">{alphabet.character}</span>
                          </div>
                          {isCompleted && (
                            <div className="flex">
                              {[1, 2, 3].map((i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${i <= starCount ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="font-medium text-sm">{alphabet.name}</p>
                        {isCompleted ? (
                          <p className="text-xs text-indigo-700 bg-white/70 rounded-full px-2 py-1 mt-1 inline-block">
                            Accuracy: {accuracy}%
                          </p>
                        ) : (
                          <p className="text-xs text-gray-600 bg-white/70 rounded-full px-2 py-1 mt-1 inline-block">
                            Not started
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm border-none shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Practice Recommendations
                  </CardTitle>
                  <CardDescription className="text-orange-100">Alphabets that need more practice</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {needsPractice.length > 0 ? (
                    <div className="space-y-3">
                      {needsPractice.map((alphabet, i) => (
                        <div
                          key={i}
                          className="flex items-center p-3 border-2 border-orange-200 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 shadow-md"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-200 to-amber-300 flex items-center justify-center mr-3 shadow-md">
                            <span className="text-lg font-bold text-orange-700">{alphabet.character}</span>
                          </div>
                          <div>
                            <p className="font-medium text-orange-800">{alphabet.name}</p>
                            <p className="text-xs text-orange-600">{alphabet.pronunciation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-indigo-700 bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                      No alphabets currently need extra practice. Great job!
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-none shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-500 text-white">
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Strengths
                  </CardTitle>
                  <CardDescription className="text-green-100">Alphabets your child has mastered</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {bestPerformed.length > 0 ? (
                    <div className="space-y-3">
                      {bestPerformed.map((alphabet, i) => (
                        <div
                          key={i}
                          className="flex items-center p-3 border-2 border-green-200 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 shadow-md"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-200 to-emerald-300 flex items-center justify-center mr-3 shadow-md">
                            <span className="text-lg font-bold text-green-700">{alphabet.character}</span>
                          </div>
                          <div>
                            <p className="font-medium text-green-800">{alphabet.name}</p>
                            <p className="text-xs text-green-600">{alphabet.pronunciation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-indigo-700 bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                      No alphabets have been mastered yet. Keep practicing!
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="md:col-span-2 bg-white/90 backdrop-blur-sm border-none shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  <CardTitle>Learning Recommendations</CardTitle>
                  <CardDescription className="text-blue-100">
                    Personalized suggestions to improve learning
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start bg-blue-50 p-3 rounded-xl border-2 border-blue-100">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mr-3 text-white font-bold shadow-md">
                        1
                      </div>
                      <p className="text-indigo-800">
                        Focus on practicing the alphabets marked for extra practice, spending at least 5 minutes on
                        each.
                      </p>
                    </li>
                    <li className="flex items-start bg-purple-50 p-3 rounded-xl border-2 border-purple-100">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mr-3 text-white font-bold shadow-md">
                        2
                      </div>
                      <p className="text-purple-800">
                        Encourage your child to trace each letter multiple times to build muscle memory.
                      </p>
                    </li>
                    <li className="flex items-start bg-green-50 p-3 rounded-xl border-2 border-green-100">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mr-3 text-white font-bold shadow-md">
                        3
                      </div>
                      <p className="text-green-800">
                        Use the "Show Strokes" feature to demonstrate the correct stroke order for challenging letters.
                      </p>
                    </li>
                    <li className="flex items-start bg-amber-50 p-3 rounded-xl border-2 border-amber-100">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mr-3 text-white font-bold shadow-md">
                        4
                      </div>
                      <p className="text-amber-800">
                        Set a regular practice schedule of 15-20 minutes daily for optimal learning retention.
                      </p>
                    </li>
                    <li className="flex items-start bg-pink-50 p-3 rounded-xl border-2 border-pink-100">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center mr-3 text-white font-bold shadow-md">
                        5
                      </div>
                      <p className="text-pink-800">
                        Celebrate achievements with your child when they earn all three stars on an alphabet.
                      </p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

