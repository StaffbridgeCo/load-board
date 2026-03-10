// app/page.tsx
"use client"

import Link from "next/link"
import { motion } from "framer-motion" //La libreria que todos amamos para animar nuestras interfaces de usuario. Nos permite agregar animaciones suaves y atractivas a nuestros componentes de React con facilidad.

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-2xl p-10 text-center w-[400px]"
      >
        <h1 className="text-3xl text-black font-bold mb-6">
          Load Board
        </h1>

        <p className="text-gray-500 mb-8">
          Logistics platform for Dispatchers and Drivers
        </p>

        <div className="flex flex-col gap-4">

          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
            >
              Sign Up
            </motion.button>
          </Link>

          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-blue-600 border border-gray-300 py-3 rounded-lg font-semibold"
            >
              Login
            </motion.button>
          </Link>

        </div>
      </motion.div>

    </div>
  )
}