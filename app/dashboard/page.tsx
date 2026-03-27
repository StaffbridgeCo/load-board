// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LoadBoard from "./LoadBoard";

export default function Dashboard() {

  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [myLoads, setMyLoads] = useState<any[]>([]);

  useEffect(() => {
    async function loadUser() { // esta funcion se encarga de cargar el usuario logueado y su perfil, si no hay usuario lo redirige al login, si el usuario es un driver tambien carga sus loads asignados

      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, role")
        .eq("id", user.id)
        .single();

      setProfile(profile);

      if (profile?.role === "driver") {
        loadMyLoads(user.id);
      }

    }

    loadUser();

  }, []);


  async function loadMyLoads(userId: string){ // esta funcion carga los loads asignados al driver logueado, se llama desde la funcion loadUser si el perfil del usuario es driver

    const { data, error } = await supabase
      .from("loads")
      .select("*")
      .eq("driver_id", userId);

    if(error){
      console.log(error);
      return;
    }

    setMyLoads(data || []);
  }


  async function handleLogout() { // esta funcion se encarga de cerrar la sesion del usuario y redirigirlo al login
    await supabase.auth.signOut();
    router.push("/login");
  }


  if (!user) { // mientras se carga el usuario mostramos un mensaje de loading, esto es opcional pero mejora la experiencia de usuario
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }


  return (

    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}

      <div className="bg-white shadow-md p-6 flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold text-black">Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Welcome {profile?.name}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </motion.button>

      </div>


      {/* CONTENT */}

      <div className="p-10">

        {/* ACCOUNT CARD */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white shadow-lg rounded-xl p-8 mb-8"
        >

          <h2 className="text-xl font-semibold mb-4 text-black">
            Account Info
          </h2>

          <p className="text-gray-600">
            <strong>Email:</strong> {user.email}
          </p>

          <p className="text-gray-600">
            <strong>Role:</strong> {profile?.role}
          </p>

        </motion.div>


        {/* DRIVER ASSIGNED LOADS */}

        {profile?.role === "driver" && myLoads.length > 0 && (

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-lg rounded-xl p-8 mb-8"
          >

            <h2 className="text-xl font-semibold mb-6 text-black">
              My Assigned Loads
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {myLoads.map((load)=>(
                
                <div
                  key={load.id}
                  className="bg-white border rounded-xl p-6 shadow-sm"
                >

                  <h3 className="text-lg font-semibold text-black mb-2">
                    {load.pickup_location} → {load.delivery_location}
                  </h3>

                  <p className="text-gray-600 text-sm">
                    Pickup: {load.pickup_date}
                  </p>

                  <p className="text-gray-600 text-sm">
                    Delivery: {load.delivery_date}
                  </p>

                  <p className="text-gray-600 text-sm">
                    Miles: {load.miles}
                  </p>

                  <p className="text-gray-600 text-sm">
                    Rate: ${load.rate}
                  </p>

                  <p className="text-gray-600 text-sm">
                    Status: {load.status}
                  </p>

                </div>

              ))}

            </div>

          </motion.div>

        )}


        {/* LOAD BOARD */}

        {profile && (
          <LoadBoard profile={profile} user={user} />
        )}

      </div>

    </div>
  );

}



//test