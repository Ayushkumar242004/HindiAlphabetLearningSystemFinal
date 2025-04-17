"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff, Star, BookOpen, Pencil } from "lucide-react"

// Form validation schema
const signupSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    age: z.coerce.number().min(3, "Age must be at least 3").max(12, "Age must be at most 12"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { signup } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const parallaxX = (mousePosition.x - window.innerWidth / 2) / 50
  const parallaxY = (mousePosition.y - window.innerHeight / 2) / 50

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      age: 5,
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true)
    try {
      const success = await signup({ fullName: data.fullName, age: data.age, email: data.email }, data.password)

      if (success) {
        toast({
          title: "Account created!",
          description: "Let's login to start learning!",
          variant: "default",
        })
        router.push("/login")
      } else {
        toast({
          title: "Signup failed",
          description: "An account with this email already exists.",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex flex-col items-center justify-center p-4">
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

      
      {/* Floating elements for child-friendly design */}
      <div className="absolute top-20 left-20 animate-float">
        <Star className="h-12 w-12 text-yellow-300 fill-yellow-300" />
      </div>
      <div className="absolute bottom-20 right-20 animate-float" style={{ animationDelay: "1s" }}>
        <BookOpen className="h-12 w-12 text-blue-300 fill-blue-300" />
      </div>
      <div className="absolute top-40 right-40 animate-float" style={{ animationDelay: "1.5s" }}>
        <Pencil className="h-12 w-12 text-green-300 fill-green-300" />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-yellow-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
            <h1 className="text-3xl font-bold text-white drop-shadow-md">Join the Fun!</h1>
            <p className="text-blue-100 mt-2">Create an account to start learning</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-lg font-medium text-indigo-800">Child's Full Name</label>
              <Input
                {...register("fullName")}
                className="rounded-xl border-2 border-purple-200 h-12 text-lg"
                placeholder="Enter child's name"
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-medium text-indigo-800">Child's Age</label>
              <Input
                {...register("age")}
                type="number"
                min={3}
                max={12}
                className="rounded-xl border-2 border-purple-200 h-12 text-lg"
                placeholder="Enter child's age"
              />
              {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-medium text-indigo-800">Parent's Email</label>
              <Input
                {...register("email")}
                type="email"
                className="rounded-xl border-2 border-purple-200 h-12 text-lg"
                placeholder="Enter parent's email"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-medium text-indigo-800">Password</label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="rounded-xl border-2 border-purple-200 h-12 text-lg pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-medium text-indigo-800">Confirm Password</label>
              <div className="relative">
                <Input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  className="rounded-xl border-2 border-purple-200 h-12 text-lg pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-center mt-4">
              <p className="text-indigo-800">
                Already have an account?{" "}
                <Link href="/login" className="text-purple-600 font-bold hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

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

