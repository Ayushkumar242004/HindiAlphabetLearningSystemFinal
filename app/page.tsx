"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Trophy,
  Award,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles,
  Heart,
  Sun,
  Laugh
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DrawingCanvas from "@/components/drawing-canvas";
import AlphabetDisplay from "@/components/alphabet-display";
import FeedbackMessage from "@/components/feedback-message";
import ParentDashboard from "@/components/parent-dashboard";
import { alphabets } from "@/lib/alphabets";
import ConfettiExplosion from "react-confetti-explosion";
import { useAuth } from "@/contexts/auth-context";

export default function AlphabetLearningSystem() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showParentDashboard, setShowParentDashboard] = useState(false);
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [stars, setStars] = useState<Record<number, number>>({});
  const [isExploding, setIsExploding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    // Short delay to prevent flash of content
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  const currentAlphabet = alphabets[currentIndex];
  const overallProgress = useMemo(() => {
    const checkValue = localStorage.getItem("check");
    if (checkValue === "yes") {
      return Math.round(
        (Object.keys(progress).length / alphabets.length) * 100
      );
    }
    return 0; // Keep progress as it is if "check" is not "yes"
  }, [progress, alphabets.length]);
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
    const starCount = accuracy > 90 ? 3 : accuracy > 60 ? 2 : 1;
    setStars({
      ...stars,
      [currentIndex]: starCount,
    });

    // Show confetti for good performance
    if (accuracy > 85) {
      setIsExploding(true);
      setTimeout(() => setIsExploding(false), 3000);
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
    );
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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex flex-col relative overflow-hidden">
      {/* ====================== */}
      {/* FLOATING ANIMATED ELEMENTS */}
      {/* ====================== */}
      
     
      <div className="absolute bottom-1/3 left-1/4 animate-swing">
        <img src="/monkey.png" alt="Monkey" className="w-24 h-24" />
      </div>
  
      {/* ====================== */}
      {/* INTERACTIVE CONFETTI */}
      {/* ====================== */}
      {isExploding && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <ConfettiExplosion
            force={0.8}
            duration={3000}
            particleCount={150}
            width={2000}
            colors={['#FFD700', '#FF1493', '#00BFFF', '#7CFC00']}
          />
        </div>
      )}
  
      {/* ====================== */}
      {/* ENHANCED HEADER */}
      {/* ====================== */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg p-4 flex justify-between items-center rounded-b-3xl relative border-b-4 border-yellow-300">
        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md animate-bounce-slow">
          Learn Indian Alphabets <span className="text-yellow-300">!</span>
        </h1>
        <div className=" transform -translate-x-1/2">
          <img
            src="/balloon.png"
            alt="Red Balloon"
            className="w-20 h-20 animate-float-delay"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="mr-4 text-white flex items-center">
            <span className="hidden md:inline animate-wiggle">Hello, </span>
            <span className="font-bold bg-yellow-400 text-purple-800 px-2 py-1 rounded-lg animate-pulse">
              {user?.fullName}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleParentDashboard}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full px-4 border-2 border-yellow-300 animate-pulse-slow"
          >
            <Award className="h-5 w-5 mr-1 animate-spin-slow" />
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
        
        {/* Animated stars in header */}
        <div className="absolute -top-2 -right-2 animate-twinkle">
          <Star className="h-8 w-8 text-yellow-300 fill-current" />
        </div>
      </header>
  
      {/* ====================== */}
      {/* PROGRESS BAR WITH BALLOONS */}
      {/* ====================== */}
      <div className="px-4 py-3 bg-white/30 backdrop-blur-sm border-b border-white/20 relative">
        
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-indigo-900 flex items-center">
            <Trophy className="h-4 w-4 mr-1 text-yellow-500 animate-bounce" />
            Your Progress
          </span>
          <span className="text-sm font-bold text-indigo-900 bg-white px-2 py-1 rounded-full">
            {overallProgress}%
          </span>
        </div>
        <Progress
          value={overallProgress}
          className="h-4 bg-white/50 border-2 border-white"
          indicatorClassName="bg-gradient-to-r from-green-400 to-blue-500 animate-pulse-slow"
        />
      </div>
  
      {/* ====================== */}
      {/* MAIN CONTENT - SUPER FUN VERSION */}
      {/* ====================== */}
      <main className="flex-1 container mx-auto p-4 md:p-8 flex flex-col relative">
        {/* Alphabet Learning Area */}
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl shadow-2xl p-6 md:p-8 flex-1 flex flex-col md:flex-row gap-8 border-4 border-yellow-300 relative overflow-hidden">
          {/* Left Side - Alphabet Display */}
          <div className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-orange-300 rounded-2xl p-4 bg-white/50 backdrop-blur-sm space-y-4 relative">
            {/* Sparkle effects */}
            <div className="absolute top-2 left-2 animate-twinkle-delay">
              <Sparkles className="h-6 w-6 text-yellow-400" />
            </div>
            
            <AlphabetDisplay alphabet={currentAlphabet} index={currentIndex} />
            
            <Button
              variant="default"
              size="lg"
              className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold px-6 py-5 h-auto shadow-lg transform hover:scale-110 transition-all duration-300 text-lg border-2 border-white animate-jump"
              onClick={playAudio}
              disabled={!isClient}
            >
              <Volume2 className="h-5 w-5 mr-2 animate-pulse" />
              HEAR IT! 🔊
            </Button>
            
            <div className="mt-20 animate-bounce">
              <img
                src="/bheem.png"
                alt="Cartoon Bird"
                className="w-40 h-40 md:w-40 md:h-40" // Large on desktop, medium on mobile
              />
            </div>
          </div>
  
          {/* Right Side - Drawing Area */}
          <div className="flex-1 flex flex-col relative">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-4 text-indigo-800 bg-yellow-200 py-3 rounded-full shadow-md animate-bounce-slow border-2 border-white">
              ✏️ TRACE THE LETTER ✏️
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
            
            {/* Animated pencil that follows cursor */}
            <div className="absolute bottom-4 right-4 animate-wiggle-more">
              <img
                src="/pencil.png"
                alt="Cartoon Pencil"
                className="w-20 h-20 hover:animate-spin cursor-pointer"
              />
            </div>
          </div>
          
          {/* Floating hearts */}
          <div className="absolute top-4 right-4 animate-float">
            <Heart className="h-8 w-8 text-pink-500 fill-current" />
          </div>
        </div>
  
        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white border-none rounded-full px-8 py-8 h-auto shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 transition-all duration-300 text-lg animate-bounce-slow"
          >
            <ChevronLeft className="h-6 w-6 mr-2" />
            PREVIOUS
          </Button>
          
          <div className="text-center mx-4">
            <span className="text-white bg-indigo-500 px-4 py-2 rounded-full text-lg font-bold shadow-md animate-pulse">
              {currentIndex + 1} / {alphabets.length}
            </span>
          </div>
          
          <Button
            onClick={handleNext}
            disabled={currentIndex === alphabets.length - 1}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-full px-8 py-8 h-auto shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 transition-all duration-300 text-lg animate-bounce-slow-delay"
          >
            NEXT
            <ChevronRight className="h-6 w-6 ml-2" />
          </Button>
        </div>
      </main>
  
      {/* ====================== */}
      {/* FOOTER WITH EXTRA FUN */}
      {/* ====================== */}
      <footer className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-center text-white rounded-t-3xl shadow-inner relative border-t-4 border-yellow-300">
        <p className="text-xl font-bold animate-bounce">
          🎉 Learning is SUPER FUN! 🎉
        </p>
        <p className="text-sm opacity-90 mt-2">
          © 2025 Alphabet Learning System | Made with ❤️ for kids
        </p>
        
        {/* Animated footer elements */}
        <div className="absolute top-2 left-4 animate-spin-slow">
          <Sun className="h-6 w-6 text-yellow-300" />
        </div>
        <div className="absolute top-2 right-4 animate-wiggle">
          <Laugh className="h-6 w-6 text-white" />
        </div>
        
       
      </footer>
    </div>
  );
}
