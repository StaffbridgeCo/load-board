// app/login/page.tsx
"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function Login() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleLogin() {

    setErrorMsg("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setErrorMsg(error.message)
      return
    }

    router.push("/dashboard")
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-2xl p-10 w-[400px]"
      >

        <h1 className="text-3xl text-black font-bold mb-2 text-center">
          Login
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Access your account
        </p>

        <div className="flex flex-col gap-4">

          <input
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          {errorMsg && (
            <p className="text-red-500 text-sm">
              {errorMsg}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogin}
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold mt-2"
          >
            Login
          </motion.button>

        </div>

        <p className="text-sm text-gray-500 text-center mt-6">
          Don't have an account?{" "}
          <span
            onClick={()=>router.push("/signup")}
            className="text-blue-600 cursor-pointer font-semibold"
          >
            Sign up
          </span>
        </p>

      </motion.div>

    </div>

  )
}