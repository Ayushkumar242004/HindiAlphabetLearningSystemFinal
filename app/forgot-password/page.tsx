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
import { Star, BookOpen, Pencil, ArrowLeft } from "lucide-react"

// Form validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true)
    try {
      // In a real app, this would send a password reset email
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      setEmailSent(true)
      toast({
        title: "Reset email sent!",
        description: "Check your inbox for instructions to reset your password.",
        variant: "default",
      })
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
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-blue-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-center">
            <h1 className="text-3xl font-bold text-white drop-shadow-md">Forgot Password</h1>
            <p className="text-blue-100 mt-2">We'll help you reset your password</p>
          </div>

          {/* Form */}
          {!emailSent ? (
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-lg font-medium text-indigo-800">Parent's Email</label>
                <Input
                  {...register("email")}
                  type="email"
                  className="rounded-xl border-2 border-blue-200 h-12 text-lg"
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
              >
                {isSubmitting ? "Sending..." : "Send Reset Instructions"}
              </Button>

              <div className="text-center mt-4">
                <Link
                  href="/login"
                  className="text-purple-600 font-bold hover:underline flex items-center justify-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="p-6 space-y-4">
              <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4 text-center">
                <p className="text-green-800 font-medium">
                  We've sent password reset instructions to your email address. Please check your inbox!
                </p>
              </div>

              <Button
                onClick={() => router.push("/login")}
                className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
              >
                Return to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

