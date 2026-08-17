"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { syncAllToCloud } from "@/lib/supabase/sync"
import type { User, Session } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithEmail: (email: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  syncing: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, sess) => {
        setSession(sess)
        setUser(sess?.user ?? null)
        setLoading(false)

        // Auto-sync data to cloud on sign-in
        if (event === "SIGNED_IN" && sess?.user) {
          setSyncing(true)
          try {
            await syncAllToCloud()
          } catch (e) {
            console.warn("Auto-sync failed:", e)
          } finally {
            setSyncing(false)
          }
        }
      },
    )

    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess)
      setUser(sess?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signInWithEmail = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) return { error: error.message }
    return {}
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithEmail, signOut, syncing }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
