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

  useEffect(() => {
    setShowAnimation(false)
  }, [])

  useEffect(() => {
    const storedId = localStorage.getItem("currentAlphabetId")
    const newId = alphabet.id.toString()

    if (storedId !== newId) {
      localStorage.setItem("currentAlphabetId", newId)
    }
  }, [alphabet])

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
    <div
  className="min-h-screen w-full flex flex-col items-center justify-center"
  style={{
    backgroundImage: `url(${alphabet.imageUrl})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }}
>

      
    </div>
  )
}
