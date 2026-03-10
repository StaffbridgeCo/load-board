// app/signup/page.tsx
"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function Signup() {

  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("driver")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSignup() {

    setErrorMsg("")

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setErrorMsg(error.message)
      return
    }

    const user = data.user

    if (user) {

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          name: name,
          role: role
        })

      if (profileError) {
        setErrorMsg(profileError.message)
        return
      }

      router.push("/dashboard")
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-2xl p-10 w-[420px]"
      >

        <h1 className="text-3xl font-bold text-center mb-2 text-black">
          Create Account
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Join the Load Board platform
        </p>

        <div className="flex flex-col gap-4">

          <input
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="Full name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

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

          <select
            value={role}
            onChange={(e)=>setRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="driver">Driver</option>
            <option value="dispatcher">Dispatcher</option>
          </select>

          {errorMsg && (
            <p className="text-red-500 text-sm">
              {errorMsg}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSignup}
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold mt-2"
          >
            Create Account
          </motion.button>

        </div>

        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account?{" "}
          <span
            onClick={()=>router.push("/login")}
            className="text-blue-600 cursor-pointer font-semibold"
          >
            Login
          </span>
        </p>

      </motion.div>

    </div>

  )
}