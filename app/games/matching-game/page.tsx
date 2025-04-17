"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, RefreshCw } from "lucide-react"

export default function MatchingGame() {
  const [letters, setLetters] = useState([
    { id: 1, letter: "अ", matched: false },
    { id: 2, letter: "आ", matched: false },
    { id: 3, letter: "इ", matched: false },
    { id: 4, letter: "ई", matched: false },
    { id: 5, letter: "उ", matched: false },
    { id: 6, letter: "ऊ", matched: false },
  ])

  const [words, setWords] = useState([
    { id: 1, word: "अनार", image: "🍎", matched: false, for: "अ" },
    { id: 2, word: "आम", image: "🥭", matched: false, for: "आ" },
    { id: 3, word: "इमली", image: "🌳", matched: false, for: "इ" },
    { id: 4, word: "ईख", image: "🍬", matched: false, for: "ई" },
    { id: 5, word: "उल्लू", image: "🦉", matched: false, for: "उ" },
    { id: 6, word: "ऊन", image: "🧶", matched: false, for: "ऊ" },
  ])

  const [selectedLetter, setSelectedLetter] = useState(null)
  const [selectedWord, setSelectedWord] = useState(null)
  const [score, setScore] = useState(0)
  const [matches, setMatches] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Shuffle the letters and words
    setLetters([...letters].sort(() => Math.random() - 0.5))
    setWords([...words].sort(() => Math.random() - 0.5))
  }, [])

  useEffect(() => {
    if (selectedLetter && selectedWord) {
      setIsAnimating(true)

      if (selectedLetter.letter === selectedWord.for) {
        // Match found
        setLetters(letters.map((l) => (l.id === selectedLetter.id ? { ...l, matched: true } : l)))
        setWords(words.map((w) => (w.id === selectedWord.id ? { ...w, matched: true } : w)))
        setScore(score + 10)
        setMatches(matches + 1)

        // Add a small delay before resetting selections to show the match
        setTimeout(() => {
          setSelectedLetter(null)
          setSelectedWord(null)
          setIsAnimating(false)
        }, 800)
      } else {
        // No match - show both selections briefly then reset
        setScore(Math.max(0, score - 2))
        setTimeout(() => {
          setSelectedLetter(null)
          setSelectedWord(null)
          setIsAnimating(false)
        }, 1000)
      }
    }
  }, [selectedLetter, selectedWord])

  // Add this useEffect to check for game completion
  useEffect(() => {
    if (matches === letters.length && matches > 0) {
      // All matches found - game completed!
      // We don't need to do anything special here as the UI already handles this state
    }
  }, [matches, letters.length])

  const resetGame = () => {
    setLetters(letters.map((l) => ({ ...l, matched: false })).sort(() => Math.random() - 0.5))
    setWords(words.map((w) => ({ ...w, matched: false })).sort(() => Math.random() - 0.5))
    setSelectedLetter(null)
    setSelectedWord(null)
    setScore(0)
    setMatches(0)
  }

  const gameCompleted = matches === letters.length

  // Function to play a simple sound effect
  const playSound = (type) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      if (type === "match") {
        // Match sound - higher pitch
        oscillator.type = "sine"
        oscillator.frequency.value = 800
        gainNode.gain.value = 0.1
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.15)

        // Add a second tone for a "match" jingle
        setTimeout(() => {
          const osc2 = audioContext.createOscillator()
          osc2.connect(gainNode)
          osc2.type = "sine"
          osc2.frequency.value = 1200
          osc2.start()
          osc2.stop(audioContext.currentTime + 0.15)
        }, 150)
      } else if (type === "nomatch") {
        // No match sound - lower pitch
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

  const handleLetterClick = (letter) => {
    if (isAnimating || letter.matched) return

    playSound("click")
    setSelectedLetter(letter)
  }

  const handleWordClick = (word) => {
    if (isAnimating || word.matched || !selectedLetter) return

    setSelectedWord(word)

    // Play sound based on whether it's a match
    if (selectedLetter.letter === word.for) {
      playSound("match")
    } else {
      playSound("nomatch")
    }
  }
  const HomeGame = () => {
    window.location.href = "http://localhost:3000/play";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 overflow-hidden relative">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="bg-purple-100 text-purple-700 rounded-full px-4 py-2 flex items-center gap-2">
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>

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

        <h1 className="text-3xl font-bold text-center mb-8 text-purple-800">अ से अनार Matching Game</h1>

        {gameCompleted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 text-center shadow-xl"
          >
            <h2 className="text-2xl font-bold text-purple-800 mb-4">🎉 Congratulations! 🎉</h2>
            <p className="text-lg text-purple-700 mb-6">You completed the game with a score of {score}!</p>
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-full shadow-lg"
            >
              Play Again
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4 text-purple-800 text-center">Hindi Letters</h2>
              <div className="grid grid-cols-2 gap-4">
                {letters.map((letter) => (
                  <motion.button
                    key={letter.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      h-24 rounded-2xl font-bold text-3xl shadow-md
                      ${
                        letter.matched
                          ? "bg-green-200 text-green-800 cursor-default"
                          : selectedLetter?.id === letter.id
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-white text-purple-800 hover:bg-purple-100"
                      }
                    `}
                    onClick={() => handleLetterClick(letter)}
                    disabled={letter.matched || isAnimating}
                  >
                    {letter.letter}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 text-purple-800 text-center">Words & Images</h2>
              <div className="grid grid-cols-2 gap-4">
                {words.map((word) => (
                  <motion.button
                    key={word.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      h-24 rounded-2xl font-bold shadow-md flex flex-col items-center justify-center
                      ${
                        word.matched
                          ? "bg-green-200 text-green-800 cursor-default"
                          : selectedWord?.id === word.id
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-white text-purple-800 hover:bg-purple-100"
                      }
                    `}
                    onClick={() => handleWordClick(word)}
                    disabled={word.matched || isAnimating || !selectedLetter}
                  >
                    <span className="text-3xl mb-1">{word.image}</span>
                    <span className="text-lg">{word.word}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-xl font-bold mb-2 text-purple-800">How to Play:</h3>
          <p className="text-purple-700">
            Match each Hindi letter with the correct word that starts with that letter. Click on a letter first, then
            click on the matching word. Get 10 points for each correct match and lose 2 points for incorrect matches.
          </p>
        </div>
      </div>
    </div>
  )
}
