"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { BombIcon as Balloon, Music, BookOpen, Star, ChevronDown, VolumeIcon as VolumeUp, Rocket, Sparkles } from "lucide-react"

export default function HomePage() {
  const [showGames, setShowGames] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Track mouse movement for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Calculate parallax effects based on mouse position
  const parallaxX = (mousePosition.x - window.innerWidth / 2) / 50
  const parallaxY = (mousePosition.y - window.innerHeight / 2) / 50

  // Animation variants for game cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }
  const HomeGame = () => {
    window.location.href = "http://localhost:3000";
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 overflow-hidden relative">
      {/* ====================== */}
      {/* 3D FLOATING BACKGROUND ELEMENTS */}
      {/* ====================== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating Hindi letters */}
        {['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ'].map((letter, idx) => (
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
            {letter}
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
      <div 
        className="absolute top-20 left-20 animate-bounce hover:animate-spin cursor-pointer"
        style={{ transform: `translate(${parallaxX * 0.2}px, ${parallaxY * 0.2}px)` }}
      >
        <Rocket className="h-16 w-16 text-yellow-300 fill-yellow-300" />
      </div>
      
      <div 
        className="absolute bottom-20 right-20 animate-float cursor-pointer"
        style={{ 
          animationDelay: "1s",
          transform: `translate(${parallaxX * 0.1}px, ${parallaxY * 0.1}px)`
        }}
      >
        <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl">
          अ
        </div>
      </div>
      
      <div 
        className="absolute top-40 right-40 animate-float cursor-pointer"
        style={{ 
          animationDelay: "1.5s",
          transform: `translate(${-parallaxX * 0.1}px, ${-parallaxY * 0.1}px)`
        }}
      >
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl">
          आ
        </div>
      </div>

      <header className="container mx-auto py-6 px-4 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Balloon className="h-8 w-8 text-pink-500 animate-float" />
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500">
              हिंदी अक्षरमाला
            </h1>
          </div>
          <nav>
            <ul className="flex gap-4">
              <li>
                <Link
                  href="#"
                  className="text-purple-600 hover:text-purple-800 font-medium rounded-full bg-purple-100 px-4 py-2 flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Learn</span>
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-pink-600 hover:text-pink-800 font-medium rounded-full bg-pink-100 px-4 py-2 flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <Star className="h-5 w-5" />
                  <span>Rewards</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <section className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-yellow-300"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Learn Hindi Alphabet Through Fun!
            </h2>
            <p className="text-lg md:text-xl text-purple-700 mb-8">
              Join our colorful adventure to master the Hindi alphabet with exciting games and activities!
            </p>

            <div className="relative mb-8">
              <motion.div
                className="absolute -bottom-6 -right-6 md:right-20"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                }}
              >
                <Sparkles className="h-10 w-10 text-yellow-400 animate-twinkle" />
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGames(!showGames)}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-2xl font-bold py-6 px-12 rounded-full shadow-lg flex items-center gap-3 mx-auto hover:shadow-xl transition-all"
            >
              🎮 Playing Games
              <ChevronDown className={`h-6 w-6 transition-transform duration-300 ${showGames ? "rotate-180" : ""}`} />
            </motion.button>
          </motion.div>
        </section>

        {showGames && (
          <motion.section 
            initial="hidden" 
            animate="visible" 
            variants={containerVariants} 
            className="mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={cardVariants}>
                <Link href="/games/matching-game">
                  <GameCard
                    title="अ से अनार Matching Game"
                    description="Match Hindi letters with the right pictures!"
                    icon="🍎"
                    color="from-pink-400 to-red-400"
                    shadowColor="shadow-pink-200"
                  />
                </Link>
              </motion.div>

              <motion.div variants={cardVariants}>
                <Link href="/games/letter-puzzle">
                  <GameCard
                    title="Hindi Letter Puzzle"
                    description="Arrange scrambled Hindi letters in the correct order!"
                    icon="🧩"
                    color="from-blue-400 to-purple-400"
                    shadowColor="shadow-blue-200"
                  />
                </Link>
              </motion.div>

              <motion.div variants={cardVariants}>
                <Link href="/games/sound-match">
                  <GameCard
                    title="Sound & Match"
                    description="Listen to the sound and click the matching Hindi letter!"
                    icon="🔊"
                    color="from-green-400 to-teal-400"
                    shadowColor="shadow-green-200"
                  />
                </Link>
              </motion.div>
            </div>
          </motion.section>
        )}

        <section className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-purple-300 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Why Learn Hindi With Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Interactive Games"
              description="Fun games make learning Hindi letters exciting and memorable!"
              icon={<Music className="h-10 w-10 text-pink-500" />}
            />
            <FeatureCard
              title="Colorful Visuals"
              description="Bright, engaging visuals help children remember letters easily."
              icon={<Star className="h-10 w-10 text-yellow-500" />}
            />
            <FeatureCard
              title="Audio Pronunciation"
              description="Listen to correct pronunciation of each Hindi letter."
              icon={<VolumeUp className="h-10 w-10 text-purple-500" />}
            />
          </div>
        </section>

        <section className="text-center mb-16 bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-blue-300">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Start Learning Today!
          </h2>
          <p className="text-lg text-purple-700 mb-8 max-w-2xl mx-auto">
            Our fun, interactive approach makes learning the Hindi alphabet an adventure your child will love!
          </p>
         
        </section>
      </main>

      <footer className="bg-purple-100/80 backdrop-blur-sm py-8 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-purple-800 mb-4">
            © 2025 Hindi Alphabet Learning Adventure. Made with ❤️ for little learners.
          </p>
         
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
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
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
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

interface GameCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  shadowColor: string;
}

function GameCard({ title, description, icon, color, shadowColor }: GameCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`bg-gradient-to-br ${color} text-white rounded-3xl p-6 ${shadowColor} shadow-lg h-full transition-all duration-300 hover:shadow-xl`}
    >
      <div className="bg-white/30 rounded-2xl p-4 backdrop-blur-sm mb-4 inline-block">
        <span className="text-4xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="mb-4">{description}</p>
      <div className="bg-white text-purple-700 font-bold py-2 px-6 rounded-full shadow-md inline-block hover:bg-purple-100 transition-colors">
        Play Now
      </div>
    </motion.div>
  )
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-2xl p-6 text-center border-2 border-purple-200 hover:border-purple-300 transition-all"
    >
      <div className="bg-purple-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-purple-800">{title}</h3>
      <p className="text-purple-700">{description}</p>
    </motion.div>
  )
}