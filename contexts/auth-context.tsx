"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  fullName: string
  age: number
  email: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, remember: boolean) => Promise<boolean>
  signup: (user: User, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("alphabet_learning_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Failed to parse saved user", error)
      }
    }
  }, [])

  // Mock user database - in a real app, this would be on a server
  const [users, setUsers] = useState<Record<string, { user: User; password: string }>>({})

  const signup = async (newUser: User, password: string): Promise<boolean> => {
    // In a real app, this would be an API call to create a user
    if (users[newUser.email]) {
      return false // User already exists
    }

    // Store the new user
    setUsers((prev) => ({
      ...prev,
      [newUser.email]: { user: newUser, password },
    }))

    return true
  }

  const login = async (email: string, password: string, remember: boolean): Promise<boolean> => {
    // In a real app, this would be an API call to authenticate
    const userAccount = users[email]

    if (!userAccount || userAccount.password !== password) {
      return false
    }

    setUser(userAccount.user)
    setIsAuthenticated(true)

    if (remember) {
      localStorage.setItem("alphabet_learning_user", JSON.stringify(userAccount.user))
    }

    return true
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("alphabet_learning_user")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

