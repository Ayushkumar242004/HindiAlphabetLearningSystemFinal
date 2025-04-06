"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, RefreshCw, Volume2, Star, Award, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import DrawingCanvas from "@/components/drawing-canvas"
import AlphabetDisplay from "@/components/alphabet-display"
import FeedbackMessage from "@/components/feedback-message"
import ParentDashboard from "@/components/parent-dashboard"
import { alphabets } from "@/lib/alphabets"
import ConfettiExplosion from "react-confetti-explosion"
import { useAuth } from "@/contexts/auth-context"

export default function AlphabetLearningSystem() {
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuth()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showParentDashboard, setShowParentDashboard] = useState(false)
  const [progress, setProgress] = useState<Record<number, number>>({})
  const [stars, setStars] = useState<Record<number, number>>({})
  const [isExploding, setIsExploding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication
  useEffect(() => {
    // Short delay to prevent flash of content
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push("/login")
      } else {
        setIsLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [isAuthenticated, router])



  const currentAlphabet = alphabets[currentIndex];
  const overallProgress = Math.round(
    (Object.keys(progress).length / alphabets.length) * 100
  );

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const playAudio = () => {
    if (!isClient || !currentAlphabet) return; // Prevent execution during SSR

    const audioPath = `/hindi_${currentAlphabet.character}.mp3`; // Dynamically load based on the current alphabet
    const audio = new Audio(audioPath);

    audio.play().catch((err) => console.error("Audio playback error:", err));
  };


  const handleNext = () => {
    if (currentIndex < alphabets.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleReset = () => {
    window.location.reload();
  };


  const handleDrawingComplete = (accuracy: number) => {
    // Update progress for the current alphabet
    setProgress({
      ...progress,
      [currentIndex]: accuracy,
    });

    // Award stars based on accuracy
    const starCount = accuracy > 90 ? 3 : accuracy > 70 ? 2 : 1;
    setStars({
      ...stars,
      [currentIndex]: starCount,
    });

    // Show confetti for good performance
    if (accuracy > 85) {
      setIsExploding(true);
      setTimeout(() => setIsExploding(false), 2000);
    }
  };

  const toggleParentDashboard = () => {
    setShowParentDashboard(!showParentDashboard);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    )
  }

  if (showParentDashboard) {
    return (
      <ParentDashboard
        progress={progress}
        stars={stars}
        alphabets={alphabets}
        onClose={toggleParentDashboard}
      />
    );
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex flex-col">
      {/* Confetti effect for celebration */}
      {isExploding && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <ConfettiExplosion
            force={0.8}
            duration={2000}
            particleCount={100}
            width={1600}
          />
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg p-4 flex justify-between items-center rounded-b-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">
          Learn Indian Alphabets
        </h1>

        <div className="flex items-center gap-2">
          <div className="mr-4 text-white">
            <span className="hidden md:inline">Hello, </span>
            <span className="font-bold">{user?.fullName}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleParentDashboard}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full px-4"
          >
            <Award className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">Parent Dashboard</span>
          </Button>

          <Button
  variant="ghost"
  size="sm"
  onClick={logout}
  className="bg-white/20 hover:bg-white/30 text-white rounded-full px-4"
>
  Logout
</Button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-4 py-3 bg-white/30 backdrop-blur-sm border-b border-white/20">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-indigo-900">
            Your Progress
          </span>
          <span className="text-sm font-bold text-indigo-900">
            {overallProgress}%
          </span>
        </div>
        <Progress
          value={overallProgress}
          className="h-3 bg-white/50"
          indicatorClassName="bg-gradient-to-r from-green-400 to-blue-500"
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 md:p-8 flex flex-col">
        {/* Alphabet Learning Area */}
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl shadow-2xl p-6 md:p-8 flex-1 flex flex-col md:flex-row gap-8 border-4 border-yellow-300">
          {/* Left Side - Alphabet Display */}
          <div className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-orange-300 rounded-2xl p-4 bg-white/50 backdrop-blur-sm">
            <AlphabetDisplay alphabet={currentAlphabet} index={currentIndex} />
            <Button
              variant="default"
              size="lg"
              className=" rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold px-6 py-6 h-auto shadow-lg transform hover:scale-105 transition-transform"
              onClick={playAudio}
              disabled={!isClient} // Prevents interaction before hydration
            >
              <Volume2 className="h-5 w-5 mr-2" />
              Hear Pronunciation
            </Button>
          </div>

          {/* Right Side - Drawing Area */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-xl md:text-2xl font-bold text-center mb-4 text-indigo-800 bg-yellow-200 py-2 rounded-full shadow-md">
              Trace the letter
            </h3>
            <DrawingCanvas
              alphabet={currentAlphabet}
              onComplete={handleDrawingComplete}
              backgroundSvg={`/svgs/hindi_${currentAlphabet.character}.svg`}
            />
            <FeedbackMessage
              accuracy={progress[currentIndex] || 0}
              stars={stars[currentIndex] || 0}
            />
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white border-none rounded-full px-6 py-6 h-auto shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Previous
          </Button>

         


          <Button
            onClick={handleNext}
            disabled={currentIndex === alphabets.length - 1}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-full px-6 py-6 h-auto shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-center text-white rounded-t-3xl shadow-inner">
        <p className="text-lg font-medium">
          Learning is fun with Indian Alphabets!
        </p>
        <p className="text-sm opacity-80">© 2025 Alphabet Learning System</p>
      </footer>
    </div>
  );
}