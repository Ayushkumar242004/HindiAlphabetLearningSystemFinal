"use client"

import { Star } from "lucide-react"
import { motion } from "framer-motion"

interface FeedbackMessageProps {
  accuracy: number
  stars: number
}

export default function FeedbackMessage({ accuracy, stars }: FeedbackMessageProps) {
  if (accuracy === 0) {
    return (
      <div className="mt-6 text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border-2 border-dashed border-purple-300">
        <p className="text-indigo-700 font-medium">Trace the letter to get feedback!</p>
      </div>
    )
  }

  let message = ""
  let emoji = ""
  if (accuracy > 90) {
    message = "Excellent! Perfect tracing!"
    emoji = "🎉"
  } else if (accuracy > 80) {
    message = "Great job! Very good tracing!"
    emoji = "🌟"
  } else if (accuracy > 70) {
    message = "Good effort! Keep practicing!"
    emoji = "👍"
  } else {
    message = "Nice try! Let's practice more!"
    emoji = "😊"
  }

  return (
    <div className="mt-6 text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-2 border-purple-300 shadow-md">
      <div className="flex justify-center mb-3">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: i <= stars ? 1 : 0.7 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: i * 0.1,
            }}
          >
            <Star
              className={`h-8 w-8 ${
                i <= stars ? "text-yellow-400 fill-yellow-400 drop-shadow-md" : "text-gray-300"
              } mx-1`}
            />
          </motion.div>
        ))}
      </div>
      <p className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
        {emoji} {message} {emoji}
      </p>
      <div className="mt-2 bg-white/70 rounded-full px-4 py-1 inline-block">
        <p className="text-sm font-medium text-indigo-800">Accuracy: {accuracy}%</p>
      </div>
    </div>
  )
}

