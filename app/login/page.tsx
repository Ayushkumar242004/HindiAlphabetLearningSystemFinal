"use client"

import { useState } from "react"
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
import { Eye, EyeOff, Star, BookOpen, Pencil } from "lucide-react"

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
        toast({
          title: "Welcome back!",
          description: "Let's continue learning!",
          variant: "default",
        })
        router.push("/")
      } else {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex flex-col items-center justify-center p-4">
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
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-orange-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-center">
            <h1 className="text-3xl font-bold text-white drop-shadow-md">Welcome Back!</h1>
            <p className="text-amber-100 mt-2">Login to continue learning</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-lg font-medium text-indigo-800">Parent's Email</label>
              <Input
                {...register("email")}
                type="email"
                className="rounded-xl border-2 border-amber-200 h-12 text-lg"
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
                  className="rounded-xl border-2 border-amber-200 h-12 text-lg pr-10"
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="rememberMe" {...register("rememberMe")} />
                <label htmlFor="rememberMe" className="text-indigo-800">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-purple-600 font-medium hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center mt-4">
              <p className="text-indigo-800">
                Don't have an account?{" "}
                <Link href="/signup" className="text-purple-600 font-bold hover:underline">
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

