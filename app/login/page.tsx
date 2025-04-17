"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff, Star, BookOpen, Pencil, Rocket, Lock, Mail, Sparkles } from "lucide-react"

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isExploding, setIsExploding] = useState(false)

  // Track mouse movement for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true)
    try {
      const success = await login(data.email, data.password, data.rememberMe || false)

      if (success) {
        setIsExploding(true)
        setTimeout(() => setIsExploding(false), 2000)
        
        toast({
          title: "Welcome back!",
          description: "Let's continue learning!",
          variant: "default",
        })
        
        // Add transition effect before navigation
        document.querySelector('.login-container')?.classList.add('page-transition-success')
        setTimeout(() => router.push("/"), 1000)
      } else {
        // Shake animation for failed login
        const form = document.querySelector('.login-form')
        form?.classList.add('animate-shake')
        setTimeout(() => form?.classList.remove('animate-shake'), 500)
        
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate parallax effects based on mouse position
  const parallaxX = (mousePosition.x - window.innerWidth / 2) / 50
  const parallaxY = (mousePosition.y - window.innerHeight / 2) / 50

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex flex-col items-center justify-center p-4 overflow-hidden relative login-container">
      {/* ====================== */}
      {/* 3D FLOATING BACKGROUND ELEMENTS */}
      {/* ====================== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating alphabet bubbles */}
        {Array.from({ length: 15 }).map((_, idx) => (
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
            {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
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
        <img src="/elephant.png" alt="Elephant" className="w-24 h-24 hover:animate-tada" />
      </div>
      
      <div 
        className="absolute top-40 right-40 animate-float cursor-pointer"
        style={{ 
          animationDelay: "1.5s",
          transform: `translate(${-parallaxX * 0.1}px, ${-parallaxY * 0.1}px)`
        }}
      >
        <img src="/monkey.png" alt="Monkey" className="w-24 h-24 hover:animate-jump" />
      </div>

      {/* ====================== */}
      {/* INTERACTIVE CONFETTI */}
      {/* ====================== */}
      {isExploding && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="absolute">
            <div className="animate-confetti-explosion">
              {Array.from({ length: 150 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-2 h-6 rounded-sm"
                  style={{
                    backgroundColor: ['#FFD700', '#FF1493', '#00BFFF', '#7CFC00', '#FFA500', '#FF00FF'][Math.floor(Math.random() * 6)],
                    left: `${Math.random() * 100}vw`,
                    top: '-10px',
                    transform: `rotate(${Math.random() * 360}deg)`,
                    animation: `confetti-fall ${Math.random() * 3 + 2}s linear forwards`,
                    animationDelay: `${Math.random() * 0.5}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ====================== */}
      {/* MAIN LOGIN FORM */}
      {/* ====================== */}
      <div className="w-full max-w-md z-10 transform-style-preserve-3d perspective-1000">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-orange-300 hover:rotate-y-5 transition-transform duration-500 login-form">
          {/* Header with 3D effect */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-center relative overflow-hidden">
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-300/20 rounded-full filter blur-xl"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-300/20 rounded-full filter blur-xl"></div>
            
            <h1 className="text-3xl font-bold text-white drop-shadow-md animate-bounce-slow">
              Welcome Back!
            </h1>
            <p className="text-amber-100 mt-2">Login to continue learning</p>
            
            {/* Floating sparkles */}
            <div className="absolute top-2 right-2 animate-twinkle">
              <Sparkles className="h-6 w-6 text-yellow-300 fill-current" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-lg font-medium text-indigo-800 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-orange-500" />
                Parent's Email
              </label>
              <div className="relative">
                <Input
                  {...register("email")}
                  type="email"
                  className="rounded-xl border-2 border-amber-200 h-12 text-lg pl-10 hover:border-orange-300 focus:border-orange-400 transition-all"
                  placeholder="Enter parent's email"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm animate-shake">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-medium text-indigo-800 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-orange-500" />
                Password
              </label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="rounded-xl border-2 border-amber-200 h-12 text-lg pr-10 pl-10 hover:border-orange-300 focus:border-orange-400 transition-all"
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
                  onClick={() => {
                    setShowPassword(!showPassword)
                    // Add animation to the eye icon
                    const eyeBtn = document.querySelector('.eye-button')
                    eyeBtn?.classList.add('animate-ping-once')
                    setTimeout(() => eyeBtn?.classList.remove('animate-ping-once'), 500)
                  }}
                >
                  {showPassword ? (
                    <EyeOff size={20} className="eye-button" />
                  ) : (
                    <Eye size={20} className="eye-button" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm animate-shake">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="rememberMe" 
                  {...register("rememberMe")} 
                  className="border-amber-300 data-[state=checked]:bg-orange-500"
                />
                <label htmlFor="rememberMe" className="text-indigo-800 hover:text-orange-600 transition-colors">
                  Remember me
                </label>
              </div>
              <Link 
                href="/forgot-password" 
                className="text-purple-600 font-medium hover:text-orange-500 hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.01] active:scale-95 relative overflow-hidden group"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-pulse">Logging in...</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <span className="absolute right-4 group-hover:animate-bounce">
                    <Rocket className="h-5 w-5" />
                  </span>
                </>
              )}
            </Button>

            <div className="text-center mt-4">
              <p className="text-indigo-800">
                Don't have an account?{" "}
                <Link 
                  href="/signup" 
                  className="text-purple-600 font-bold hover:text-orange-500 hover:underline transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* ====================== */}
      {/* ANIMATED FOOTER */}
      {/* ====================== */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm z-10">
        <p className="flex items-center justify-center">
          <span className="animate-pulse">✨</span>
          <span className="mx-2">Learning is fun!</span>
          <span className="animate-pulse">✨</span>
        </p>
      </div>

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
        
        @keyframes jump {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes confetti-fall {
          to { transform: translateY(100vh) rotate(360deg); }
        }
        
        @keyframes ping-once {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes page-transition-success {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(0.5); opacity: 0; }
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
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 1s ease infinite;
        }
        
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        
        .animate-tada {
          animation: tada 1s ease;
        }
        
        .animate-jump {
          animation: jump 0.5s ease;
        }
        
        .animate-shake {
          animation: shake 0.5s ease;
        }
        
        .animate-ping-once {
          animation: ping-once 0.5s ease;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        
        .rotate-y-5 {
          transform: rotateY(5deg);
        }
        
        .page-transition-success {
          animation: page-transition-success 1s ease forwards;
        }
      `}</style>
    </div>
  )
}