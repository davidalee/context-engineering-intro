import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import type { Session, User } from '@supabase/supabase-js'
import type { UserProfile, AppRole, VerificationStatus } from '@betweenus/shared'
import { supabase } from '../lib/supabase'
import { getVerificationStatus, type VerificationStatusData } from '../services/verification.service'

interface AuthContextType {
  session: Session | null
  user: User | null
  profile: UserProfile | null
  role: AppRole
  verificationStatus: VerificationStatus | null
  isVerified: boolean
  isLoading: boolean
  isLoggedIn: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  refreshVerificationStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  role: 'member',
  verificationStatus: null,
  isVerified: false,
  isLoading: true,
  isLoggedIn: false,
  signOut: async () => {},
  refreshProfile: async () => {},
  refreshVerificationStatus: async () => {},
})

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [role, setRole] = useState<AppRole>('member')
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchVerificationStatus = useCallback(async () => {
    try {
      const data = await getVerificationStatus()
      setVerificationStatus(data?.status || null)
    } catch (error) {
      console.error('Error fetching verification status:', error)
    }
  }, [])

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (data && !error) {
        setProfile(data as UserProfile)
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single()

      if (roleData?.role) {
        setRole(roleData.role as AppRole)
      }

      await fetchVerificationStatus()
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }, [fetchVerificationStatus])

  const refreshProfile = useCallback(async () => {
    if (session?.user?.id) {
      await fetchProfile(session.user.id)
    }
  }, [session?.user?.id, fetchProfile])

  const refreshVerificationStatus = useCallback(async () => {
    await fetchVerificationStatus()
  }, [fetchVerificationStatus])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event)
        setSession(session)

        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setRole('member')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        supabase.auth.startAutoRefresh()
      } else {
        supabase.auth.stopAutoRefresh()
      }
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      subscription.remove()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    setRole('member')
    setVerificationStatus(null)
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        role,
        verificationStatus,
        isVerified: verificationStatus === 'approved',
        isLoading,
        isLoggedIn: !!session,
        signOut,
        refreshProfile,
        refreshVerificationStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
