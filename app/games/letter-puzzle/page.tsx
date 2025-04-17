"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, RefreshCw, Check } from "lucide-react"

export default function LetterPuzzle() {
  const puzzles = [
    {
      word: "नमस्ते",
      hint: "A common greeting in Hindi",
      image: "🙏",
    },
    {
      word: "भारत",
      hint: "The country India in Hindi",
      image: "🇮🇳",
    },
    {
      word: "स्कूल",
      hint: "Where children go to learn",
      image: "🏫",
    },
    {
      word: "आम",
      hint: "A sweet yellow fruit",
      image: "🥭",
    },
    {
      word: "पानी",
      hint: "What we drink when thirsty",
      image: "💧",
    },
  ]

  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [currentPuzzle, setCurrentPuzzle] = useState(puzzles[0])
  const [scrambledLetters, setScrambledLetters] = useState([])
  const [selectedLetters, setSelectedLetters] = useState([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    setupPuzzle(currentPuzzleIndex)
  }, [currentPuzzleIndex])

  const setupPuzzle = (index) => {
    const puzzle = puzzles[index]
    setCurrentPuzzle(puzzle)

    // Create scrambled letters
    const letters = puzzle.word.split("")

    // Ensure the letters are actually scrambled and not in the original order
    let scrambled = [...letters]
    while (scrambled.join("") === letters.join("")) {
      scrambled = [...letters].sort(() => Math.random() - 0.5)
    }

    setScrambledLetters(
      scrambled.map((letter, i) => ({
        id: i,
        letter,
        selected: false,
      })),
    )

    setSelectedLetters([])
    setIsCorrect(false)
  }

  const handleLetterClick = (letter) => {
    if (letter.selected) return

    // Play a soft click sound effect (would be implemented in a real app)
    // For now we'll just add a visual feedback through the animation
    playSound("click")

    // Update scrambled letters
    setScrambledLetters(scrambledLetters.map((l) => (l.id === letter.id ? { ...l, selected: true } : l)))

    // Add to selected letters
    setSelectedLetters([...selectedLetters, letter])
  }

  const checkAnswer = () => {
    const selectedWord = selectedLetters.map((l) => l.letter).join("")

    if (selectedWord === currentPuzzle.word) {
      setIsCorrect(true)
      setScore(score + 10)
      playSound("correct")

      // Play success sound (would be implemented in a real app)
    } else {
      // Reset the selected letters but keep the puzzle
      setSelectedLetters([])
      setScrambledLetters(scrambledLetters.map((l) => ({ ...l, selected: false })))
      setScore(Math.max(0, score - 2))
      playSound("incorrect")

      // Play error sound (would be implemented in a real app)
    }
  }

  // Add a new function to reset the current puzzle
  const resetCurrentPuzzle = () => {
    setupPuzzle(currentPuzzleIndex)
  }

  const nextPuzzle = () => {
    const nextIndex = (currentPuzzleIndex + 1) % puzzles.length
    setCurrentPuzzleIndex(nextIndex)
  }

  const resetGame = () => {
    setCurrentPuzzleIndex(0)
    setScore(0)
    setupPuzzle(0)
  }

  const HomeGame = () => {
    window.location.href = "http://localhost:3000/play";
  };

  // Function to play a simple sound effect
  const playSound = (type) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      if (type === "correct") {
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
      } else if (type === "incorrect") {
        // Incorrect sound - lower pitch
        oscillator.type = "sine"
        oscillator.frequency.value = 300
        gainNode.gain.value = 0.1
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.3)
      } else if (type === "click") {
        // Click sound - neutral pitch
        oscillator.type = "sine"
        oscillator.frequency.value = 500
        gainNode.gain.value = 0.05
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.1)
      }
    } catch (e) {
      console.log("Web Audio API not supported or not allowed")
    }
  }

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

          <div className="bg-white rounded-full px-6 py-2 shadow-md">
            <span className="font-bold text-purple-800">Score: {score}</span>
          </div>

          <button
            onClick={resetGame}
            className="bg-pink-100 text-pink-700 rounded-full px-4 py-2 flex items-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Reset</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center mb-8 text-purple-800">Hindi Letter Puzzle</h1>

        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-purple-800 mb-2">
                Puzzle {currentPuzzleIndex + 1} of {puzzles.length}
              </h2>
              <p className="text-lg text-purple-700 mb-4">Hint: {currentPuzzle.hint}</p>
            </div>

            <div className="text-7xl">{currentPuzzle.image}</div>
          </div>

          {isCorrect ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center">
              <div className="bg-green-100 text-green-800 rounded-xl p-4 mb-4 inline-flex items-center gap-2">
                <Check className="h-5 w-5" />
                <span>Correct! Well done!</span>
              </div>

              <button
                onClick={nextPuzzle}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg"
              >
                Next Puzzle
              </button>
            </motion.div>
          ) : (
            <>
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-purple-800 text-center">Your Answer:</h3>
                <div className="flex justify-center gap-2 min-h-16 mb-8">
                  {selectedLetters.length > 0 ? (
                    selectedLetters.map((letter, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl font-bold text-blue-800"
                      >
                        {letter.letter}
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-purple-400 italic">Click the letters below to form the word</div>
                  )}
                  {!isCorrect && selectedLetters.length > 0 && (
                    <button
                      onClick={resetCurrentPuzzle}
                      className="mt-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      Reset Letters
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-purple-800 text-center">Available Letters:</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {scrambledLetters.map((letter) => (
                    <motion.button
                      key={letter.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold shadow-md
                        ${
                          letter.selected
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white text-purple-800 hover:bg-purple-100"
                        }
                      `}
                      onClick={() => handleLetterClick(letter)}
                      disabled={letter.selected}
                    >
                      {letter.letter}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={checkAnswer}
                  disabled={selectedLetters.length === 0}
                  className={`py-3 px-8 rounded-full font-bold shadow-lg
                    ${
                      selectedLetters.length === 0
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    }
                  `}
                >
                  Check Answer
                </button>
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-xl font-bold mb-2 text-purple-800">How to Play:</h3>
          <p className="text-purple-700">
            Arrange the scrambled Hindi letters to form the correct word based on the hint and image. Click on the
            letters in the correct order. Click "Check Answer" when you're done. Get 10 points for each correct answer
            and lose 2 points for incorrect answers.
          </p>
        </div>
      </div>
    </div>
  )
}
