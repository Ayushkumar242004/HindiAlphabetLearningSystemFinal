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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse movement for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Check authentication
  useEffect(() => {
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
    return 0;
  }, [progress, alphabets.length]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const playAudio = () => {
    if (!isClient || !currentAlphabet) return;

    const audioPath = `/hindi_${currentAlphabet.character}.mp3`;
    const audio = new Audio(audioPath);

    // Add visual feedback when audio plays
    const audioButton = document.querySelector('.audio-button');
    if (audioButton) {
      audioButton.classList.add('animate-ping');
      setTimeout(() => audioButton.classList.remove('animate-ping'), 500);
    }

    audio.play().catch((err) => console.error("Audio playback error:", err));
  };

  const handleNext = () => {
    if (currentIndex < alphabets.length - 1) {
      // Add page transition effect
      document.querySelector('.main-content')?.classList.add('page-transition-next');
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        document.querySelector('.main-content')?.classList.remove('page-transition-next');
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      // Add page transition effect
      document.querySelector('.main-content')?.classList.add('page-transition-prev');
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        document.querySelector('.main-content')?.classList.remove('page-transition-prev');
      }, 300);
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  const handleDrawingComplete = (accuracy: number) => {
    setProgress({
      ...progress,
      [currentIndex]: accuracy,
    });

    const starCount = accuracy > 90 ? 3 : accuracy > 60 ? 2 : 1;
    setStars({
      ...stars,
      [currentIndex]: starCount,
    });

    if (accuracy > 85) {
      setIsExploding(true);
      setTimeout(() => setIsExploding(false), 3000);
      
      // Add celebration animation to the character
      const charElement = document.querySelector('.character-display');
      if (charElement) {
        charElement.classList.add('celebrate');
        setTimeout(() => charElement.classList.remove('celebrate'), 2000);
      }
    }
  };

  const toggleParentDashboard = () => {
    setShowParentDashboard(!showParentDashboard);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mr-4"></div>
            Loading...
          </div>
        </div>
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

  // Calculate parallax effects based on mouse position
  const parallaxX = (mousePosition.x - window.innerWidth / 2) / 50;
  const parallaxY = (mousePosition.y - window.innerHeight / 2) / 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex flex-col relative overflow-hidden">
      {/* ====================== */}
      {/* 3D FLOATING BACKGROUND ELEMENTS */}
      {/* ====================== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating alphabet bubbles */}
        {alphabets.map((alphabet, idx) => (
          <div 
            key={idx}
            className="absolute text-4xl font-bold text-white/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `translate(${Math.sin(Date.now()/1000 + idx) * 20}px, ${Math.cos(Date.now()/1200 + idx) * 20}px)`,
              animation: `float ${10 + idx}s infinite ease-in-out`,
              zIndex: 0
            }}
          >
            {alphabet.character}
          </div>
        ))}

        {/* Animated clouds */}
        <div 
          className="absolute top-20 left-0 w-40 h-20 bg-white/10 rounded-full filter blur-xl animate-cloud-float-slow"
          style={{ transform: `translateX(${parallaxX * 0.5}px) translateY(${parallaxY * 0.5}px)` }}
        ></div>
        <div 
          className="absolute top-40 right-10 w-60 h-30 bg-white/15 rounded-full filter blur-xl animate-cloud-float"
          style={{ transform: `translateX(${-parallaxX * 0.3}px) translateY(${parallaxY * 0.3}px)` }}
        ></div>
      </div>

      {/* ====================== */}
      {/* INTERACTIVE CHARACTERS */}
      {/* ====================== */}
      <div className="absolute bottom-20 left-10 animate-bounce hover:animate-spin cursor-pointer">
        <img src="/monkey.png" alt="Monkey" className="w-28 h-28 transform hover:scale-110 transition-transform" />
      </div>
      
      <div 
        className="absolute top-1/4 right-19 animate-float cursor-pointer"
        style={{ transform: `translate(${parallaxX * 0.2}px, ${parallaxY * 0.2}px)` }}
      >
        <img src="/elephant.png" alt="Elephant" className="w-32 h-32 hover:animate-tada" />
      </div>
      <div 
        className="absolute top-1/4 right-20 animate-float cursor-pointer"
        style={{ transform: `translate(${parallaxX * 0.2}px, ${parallaxY * 0.2}px)` }}
      >
        <img src="/parrot.png" alt="Elephant" className="w-32 h-32 hover:animate-tada" />
      </div>

      {/* ====================== */}
      {/* INTERACTIVE CONFETTI */}
      {/* ====================== */}
      {isExploding && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <ConfettiExplosion
            force={0.8}
            duration={3000}
            particleCount={250}
            width={2000}
            colors={['#FFD700', '#FF1493', '#00BFFF', '#7CFC00', '#FFA500', '#FF00FF']}
          />
        </div>
      )}

      {/* ====================== */}
      {/* ENHANCED HEADER */}
      {/* ====================== */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg p-4 flex justify-between items-center rounded-b-3xl relative border-b-4 border-yellow-300 z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md animate-bounce-slow">
          Learn Indian Alphabets <span className="text-yellow-300">!</span>
        </h1>
        
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img
            src="/balloon.png"
            alt="Red Balloon"
            className="w-24 h-24 animate-float-delay hover:animate-spin cursor-pointer"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="mr-4 text-white flex items-center">
            <span className="hidden md:inline animate-wiggle">Hello, </span>
            <span className="font-bold bg-yellow-400 text-purple-800 px-2 py-1 rounded-lg animate-pulse hover:animate-jump">
              {user?.fullName}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleParentDashboard}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full px-4 border-2 border-yellow-300 animate-pulse-slow hover:animate-spin"
          >
            <Award className="h-5 w-5 mr-1 animate-spin-slow" />
            <span className="hidden sm:inline">Parent Dashboard</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full px-4 hover:animate-wiggle"
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
      <div className="px-4 py-3 bg-white/30 backdrop-blur-sm border-b border-white/20 relative z-10">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-indigo-900 flex items-center">
            <Trophy className="h-4 w-4 mr-1 text-yellow-500 animate-bounce" />
            Your Progress
          </span>
          <span className="text-sm font-bold text-indigo-900 bg-white px-2 py-1 rounded-full transform hover:scale-110 transition-transform">
            {overallProgress}%
          </span>
        </div>
        <Progress
          value={overallProgress}
          className="h-4 bg-white/50 border-2 border-white"
          indicatorClassName="bg-gradient-to-r from-green-400 to-blue-500 animate-pulse-slow"
        />
        
        {/* Progress celebration */}
        {overallProgress > 0 && (
          <div 
            className="absolute -top-8 right-4 animate-float"
            style={{ animationDelay: '0.5s' }}
          >
           
          </div>
        )}
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

  <div className="text-center mx-4 flex items-center gap-4">
    <span className="text-white bg-indigo-500 px-4 py-2 rounded-full text-lg font-bold shadow-md animate-pulse">
      {currentIndex + 1} / {alphabets.length}
    </span>

    <Button
      onClick={() => router.push("/play")}
      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-full px-8 py-8 h-auto shadow-lg transform hover:scale-110 transition-all duration-300 text-lg animate-bounce-slow"
    >
      PLAY GAMES
    </Button>
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
      <footer className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-center text-white rounded-t-3xl shadow-inner relative border-t-4 border-yellow-300 z-10">
        <p className="text-xl font-bold animate-bounce hover:animate-spin cursor-pointer">
          🎉 Learning is SUPER FUN! 🎉
        </p>
        <p className="text-sm opacity-90 mt-2">
          © 2025 Alphabet Learning System | Made with ❤️ for kids
        </p>
        
        {/* Animated footer elements */}
        <div className="absolute top-2 left-4 animate-spin-slow hover:animate-spin cursor-pointer">
          <Sun className="h-6 w-6 text-yellow-300" />
        </div>
        <div className="absolute top-2 right-4 animate-wiggle hover:animate-tada cursor-pointer">
          <Laugh className="h-6 w-6 text-white" />
        </div>
        
        {/* Dancing letters */}
        <div className="flex justify-center mt-2 space-x-2">
          {['L', 'E', 'A', 'R', 'N'].map((letter, idx) => (
            <span 
              key={idx}
              className="inline-block text-yellow-300 font-bold animate-bounce"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {letter}
            </span>
          ))}
        </div>
      </footer>

      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes cloud-float {
          0% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(50px) translateY(10px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        
        @keyframes cloud-float-slow {
          0% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(-30px) translateY(5px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.2; transform: scale(0.8); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes tada {
          0% { transform: scale(1); }
          10%, 20% { transform: scale(0.9) rotate(-3deg); }
          30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
          40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
          100% { transform: scale(1) rotate(0); }
        }
        
        @keyframes celebrate {
          0% { transform: scale(1); }
          50% { transform: scale(1.5) rotate(10deg); }
          100% { transform: scale(1); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float 4s ease-in-out infinite 1s;
        }
        
        .animate-cloud-float {
          animation: cloud-float 20s ease-in-out infinite;
        }
        
        .animate-cloud-float-slow {
          animation: cloud-float-slow 25s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease infinite;
        }
        
        .animate-bounce-slow-delay {
          animation: bounce-slow 3s ease infinite 0.5s;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-twinkle-delay {
          animation: twinkle 2.5s ease-in-out infinite 0.5s;
        }
        
        .animate-wiggle {
          animation: wiggle 1s ease infinite;
        }
        
        .animate-wiggle-more {
          animation: wiggle 0.5s ease infinite;
        }
        
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        
        .animate-tada {
          animation: tada 1s ease;
        }
        
        .celebrate {
          animation: celebrate 0.5s ease;
        }
        
        .page-transition-next {
          animation: slide-out-left 0.3s forwards;
        }
        
        .page-transition-prev {
          animation: slide-out-right 0.3s forwards;
        }
        
        @keyframes slide-out-left {
          to { transform: translateX(-100%); opacity: 0; }
        }
        
        @keyframes slide-out-right {
          to { transform: translateX(100%); opacity: 0; }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        
        .rotate-y-10 {
          transform: rotateY(10deg);
        }
      `}</style>
    </div>
  );
}