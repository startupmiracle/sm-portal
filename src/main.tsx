import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { routes } from './router'
import { supabase } from './lib/supabase'
import { ensureProfile } from './lib/db'

const router = createBrowserRouter(routes)

function AuthSync() {
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) await ensureProfile(session.user)
    })
    return () => sub.subscription.unsubscribe()
  }, [])
  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthSync />
    <RouterProvider router={router} />
  </StrictMode>
)

