"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, RefreshCw, VolumeIcon as VolumeUp, Check, X } from "lucide-react"

export default function SoundMatch() {
  const letters = [
    { id: 1, letter: "अ", sound: "a", image: "🍎" },
    { id: 2, letter: "आ", sound: "aa", image: "🥭" },
    { id: 3, letter: "इ", sound: "i", image: "🌳" },
    { id: 4, letter: "ई", sound: "ee", image: "🍬" },
    { id: 5, letter: "उ", sound: "u", image: "🦉" },
    { id: 6, letter: "ऊ", sound: "oo", image: "🧶" },
    { id: 7, letter: "ए", sound: "e", image: "🐘" },
    { id: 8, letter: "ऐ", sound: "ai", image: "🥚" },
    { id: 9, letter: "ओ", sound: "o", image: "🚗" },
    { id: 10, letter: "औ", sound: "au", image: "👁️" },
    { id: 11, letter: "क", sound: "ka", image: "🍌" },
    { id: 12, letter: "ख", sound: "kha", image: "🐇" },
  ]

  const [currentLetter, setCurrentLetter] = useState(null)
  const [options, setOptions] = useState([])
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [round, setRound] = useState(1)
  const [gameOver, setGameOver] = useState(false)

  const totalRounds = 10

  useEffect(() => {
    if (round <= totalRounds) {
      setupRound()
    } else {
      setGameOver(true)
    }
  }, [round])

  const setupRound = () => {
    // Select a random letter
    const randomIndex = Math.floor(Math.random() * letters.length)
    const selected = letters[randomIndex]
    setCurrentLetter(selected)

    // Create options (3 wrong + 1 correct)
    let wrongOptions = letters.filter((l) => l.id !== selected.id)
    wrongOptions = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 3)

    const allOptions = [...wrongOptions, selected].sort(() => Math.random() - 0.5)
    setOptions(allOptions)

    setFeedback(null)
  }

  const playSound = () => {
    // In a real app, this would play pre-recorded audio files of Hindi letter sounds
    // For this demo, we'll use text-to-speech as a fallback

    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      // Create a new utterance with the letter sound
      const utterance = new SpeechSynthesisUtterance(currentLetter.sound)
      utterance.rate = 0.8
      utterance.pitch = 1.2 // Slightly higher pitch for clarity

      // Use a different voice if available (preferably a female voice which works better for teaching children)
      const voices = window.speechSynthesis.getVoices()
      const femaleVoice = voices.find((voice) => voice.name.includes("female") || voice.name.includes("Female"))
      if (femaleVoice) {
        utterance.voice = femaleVoice
      }

      // Speak the sound
      window.speechSynthesis.speak(utterance)
    }
  }

  // Add a function to play a correct/incorrect sound
  const playFeedbackSound = (correct) => {
    // In a real app, this would play actual sound files
    // For this demo, we'll use simple beeps with the Web Audio API

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      if (correct) {
        // Correct sound - higher pitch
        oscillator.type = "sine"
        oscillator.frequency.value = 800
        gainNode.gain.value = 0.1
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.15)

        // Add a second tone for a "correct" jingle
        setTimeout(() => {
          const osc2 = audioContext.createOscillator()
          osc2.connect(gainNode)
          osc2.type = "sine"
          osc2.frequency.value = 1200
          osc2.start()
          osc2.stop(audioContext.currentTime + 0.15)
        }, 150)
      } else {
        // Incorrect sound - lower pitch
        oscillator.type = "sine"
        oscillator.frequency.value = 300
        gainNode.gain.value = 0.1
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.3)
      }
    } catch (e) {
      console.log("Web Audio API not supported or not allowed")
    }
  }

  const handleOptionClick = (option) => {
    if (feedback) return // Prevent clicking during feedback

    if (option.id === currentLetter.id) {
      // Correct answer
      playFeedbackSound(true)
      setFeedback({ correct: true, message: "Correct! Well done!" })
      setScore(score + 10)

      // Move to next round after delay
      setTimeout(() => {
        if (round < totalRounds) {
          setRound(round + 1)
        } else {
          setGameOver(true)
        }
      }, 1500)
    } else {
      // Wrong answer
      playFeedbackSound(false)
      setFeedback({
        correct: false,
        message: `Oops! That's ${option.letter}. The correct answer is ${currentLetter.letter}.`,
      })
      setScore(Math.max(0, score - 2))

      // Move to next round after delay
      setTimeout(() => {
        if (round < totalRounds) {
          setRound(round + 1)
        } else {
          setGameOver(true)
        }
      }, 2000)
    }
  }
  const HomeGame = () => {
    window.location.href = "http://localhost:3000/play";
  };


  const resetGame = () => {
    setScore(0)
    setRound(1)
    setGameOver(false)
    setupRound()
  }

  // Add an effect to load voices when the component mounts
  useEffect(() => {
    // Load voices for speech synthesis
    if ("speechSynthesis" in window) {
      // Chrome needs this to load voices
      window.speechSynthesis.getVoices()

      // Some browsers need this event to get voices
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices()
      }
    }

    return () => {
      // Cancel any ongoing speech when component unmounts
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Add automatic sound playing when a new round starts
  useEffect(() => {
    if (currentLetter && !gameOver) {
      // Play the sound automatically after a short delay
      const timer = setTimeout(() => {
        playSound()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [currentLetter, gameOver])

  if (!currentLetter && !gameOver) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 overflow-hidden relative">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
        <button
            onClick={HomeGame}
            className="bg-pink-100 text-pink-700 rounded-full px-4 py-2 flex items-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Home</span>
          </button>

          <div className="bg-white rounded-full px-6 py-2 shadow-md flex items-center gap-4">
            <span className="font-bold text-purple-800">Score: {score}</span>
            <span className="font-bold text-teal-800">
              Round: {round}/{totalRounds}
            </span>
          </div>

          <button
            onClick={resetGame}
            className="bg-pink-100 text-pink-700 rounded-full px-4 py-2 flex items-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Reset</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center mb-8 text-teal-800">Sound & Match</h1>

        {gameOver ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 text-center shadow-xl"
          >
            <h2 className="text-2xl font-bold text-teal-800 mb-4">🎉 Game Complete! 🎉</h2>
            <p className="text-lg text-teal-700 mb-6">You finished with a score of {score}!</p>
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-teal-500 to-green-500 text-white font-bold py-3 px-6 rounded-full shadow-lg"
            >
              Play Again
            </button>
          </motion.div>
        ) : (
          <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
            <div className="text-center mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={playSound}
                className="bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-full p-6 shadow-lg mx-auto flex items-center justify-center"
              >
                <VolumeUp className="h-12 w-12" />
              </motion.button>
              <p className="mt-4 text-teal-700">Click to hear the sound, then select the matching Hindi letter</p>
            </div>

            {feedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mb-8 rounded-xl p-4 flex items-center gap-2 justify-center
                  ${feedback.correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                `}
              >
                {feedback.correct ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                <span>{feedback.message}</span>
              </motion.div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {options.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    h-24 rounded-2xl font-bold shadow-md flex flex-col items-center justify-center
                    ${
                      feedback && option.id === currentLetter.id
                        ? "bg-green-200 text-green-800"
                        : "bg-white text-teal-800 hover:bg-teal-50"
                    }
                  `}
                  onClick={() => handleOptionClick(option)}
                  disabled={!!feedback}
                >
                  <span className="text-4xl mb-1">{option.letter}</span>
                  <span className="text-sm">{option.image}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-xl font-bold mb-2 text-teal-800">How to Play:</h3>
          <p className="text-teal-700">
            Listen to the sound by clicking the speaker button, then select the matching Hindi letter. Get 10 points for
            each correct answer and lose 2 points for incorrect answers. Complete 10 rounds to finish the game.
          </p>
        </div>
      </div>
    </div>
  )
}
