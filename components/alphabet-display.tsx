"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import type { Alphabet } from "@/lib/alphabets"

interface AlphabetDisplayProps {
  alphabet: Alphabet
  index: number
}

export default function AlphabetDisplay({ alphabet, index }: AlphabetDisplayProps) {
  const [showAnimation, setShowAnimation] = useState(false)

  // Reset animation state when alphabet changes
  useEffect(() => {
    setShowAnimation(false)
  }, [])

  // Update local storage with the current alphabet's ID
  useEffect(() => {
    const storedId = localStorage.getItem("currentAlphabetId")
    const newId = alphabet.id.toString()

    if (storedId !== newId) {
      localStorage.setItem("currentAlphabetId", newId)
    }
  }, [alphabet])

  // Generate a random color for the alphabet
  const getRandomColor = () => {
    const colors = [
      "text-red-500",
      "text-blue-500",
      "text-green-500",
      "text-purple-500",
      "text-pink-500",
      "text-yellow-500",
      "text-indigo-500",
      "text-teal-500",
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Static display of the alphabet */}
        {!showAnimation && (
          <div
            className={`text-9xl font-bold ${getRandomColor()} drop-shadow-lg transform hover:scale-110 transition-transform duration-300`}
          >
            {alphabet.character}
          </div>
        )}

        {/* Animated stroke-by-stroke display */}
        
      </div>

      <div className="mt-4 text-center">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-1">
          {alphabet.name}
        </h2>
        <p className="text-indigo-800 font-medium">{alphabet.pronunciation}</p>
      </div>
    </div>
  )
}