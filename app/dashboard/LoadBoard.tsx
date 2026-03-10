// app/dashboard/LoadBoard.tsx
"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { motion } from "framer-motion";
import ClaimLoadButton from "../components/ClaimLoadButton"; // Importamos el componente para reclamar loads, solo se muestra para los drivers en loads abiertos wiii
import Link from "next/link";

interface LoadBoardProps {
  profile: any;
  user: any;
}

export default function LoadBoard({ profile, user }: LoadBoardProps) { // este componente se encarga de mostrar los loads disponibles para los drivers y los loads creados por el dispatcher, se le pasan el perfil y el usuario logueado para hacer las consultas a la base de datos y mostrar la informacion correcta segun el rol del usuario

  const [loads, setLoads] = useState<any[]>([]);
  const [showLoads, setShowLoads] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    pickup_location: "",
    delivery_location: "",
    pickup_date: "",
    delivery_date: "",
    miles: "",
    rate: "",
    notes: ""
  });

  function handleChange(e:any){ // esta funcion se encarga de actualizar el estado del formulario de creacion de loads, se llama cada vez que el usuario escribe en un input del formulario
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function createLoad(e:any){
    e.preventDefault();

    const { error } = await supabase
      .from("loads")
      .insert([
        {
          dispatcher_id: user.id,
          pickup_location: form.pickup_location,
          delivery_location: form.delivery_location,
          pickup_date: form.pickup_date,
          delivery_date: form.delivery_date,
          miles: Number(form.miles),
          rate: Number(form.rate),
          notes: form.notes,
          status: "open"
        }
      ]);

    if(error){
      console.log(error);
      alert("Error creating load");
      return;
    }

    alert("Load created");

    setForm({
      pickup_location:"",
      delivery_location:"",
      pickup_date:"",
      delivery_date:"",
      miles:"",
      rate:"",
      notes:""
    });

    setShowForm(false);
  }

async function toggleLoads() { // esta funcion se encarga de mostrar los loads disponibles para los drivers y los loads creados por el dispatcher, si ya se estan mostrando los oculta, si no se estan mostrando los carga desde la base de datos y los muestra, se llama cuando el usuario hace click en el boton de ver loads

  if(showLoads){
    setShowLoads(false);
    return;
  }

  let query = supabase
    .from("loads")
    .select(`
      *,
      driver:driver_id (
        name
      )
    `);

  if(profile.role === "driver"){
    query = query.eq("status","open");
  }

  if(profile.role === "dispatcher"){
    query = query.eq("dispatcher_id", user.id);
  }

  const {data,error} = await query;

  if(error){
    console.log(error);
    return;
  }

  setLoads(data || []);
  setShowLoads(true);
}

  // funcion para refrescar los loads despues de crear uno nuevo o reclamar uno, se le pasa a los componentes hijos para que la llamen cuando sea necesario
async function refreshLoads(){

  let query = supabase.from("loads").select(`
*,
driver:driver_id (
  name
)
`) // para los drivers solo mostramos los loads abiertos, para los dispatchers mostramos todos los loads que hayan creado, esto se hace con la query de arriba y las condiciones siguientes

  if(profile.role === "driver"){
    query = query.eq("status","open");
  }

  if(profile.role === "dispatcher"){
    query = query.eq("dispatcher_id", user.id);
  }

  const {data,error} = await query;

  if(error){
    console.log(error);
    return;
  }

  setLoads(data || []);
}

async function completeLoad(loadId:string){ // funcion para completar un load, se le pasa el id del load a completar, se actualiza el status a completed y se refrescan los loads

  const {error} = await supabase
  .from("loads")
  .update({status:"completed"})
  .eq("id",loadId);

  if(error){
    console.log(error);
    alert("Error completing load");
    return;
  }

  refreshLoads();
}

  return (

    <div className="bg-white shadow-lg rounded-xl p-8 mb-8">

      <h2 className="text-xl font-semibold mb-4 text-black">
        {profile.role === "driver" ? "Driver Panel" : "Dispatcher Panel"}
      </h2>

      <p className="text-gray-600 mb-4">
        {profile.role === "driver"
          ? "Browse available loads"
          : "Create and manage loads"}
      </p>

      {/* CREATE LOAD BUTTON */}

      {profile.role === "dispatcher" && ( // solo mostramos el boton de crear loads para los dispatchers, no tiene sentido mostrarlo para los drivers porque ellos no crean loads, los dispatchers son los que crean los loads y los asignan a los drivers cuando ellos los reclaman

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-4"
        >
          {showForm ? "Close Form" : "Create Load"}
        </button>

      )}

      {/* VIEW LOADS BUTTON */}

      <button
        onClick={toggleLoads}
        className={`${
          profile.role === "driver" ? "bg-green-600" : "bg-gray-800"
        } text-white px-4 py-2 rounded-lg`}
      >
        {showLoads ? "Hide Loads" : "View Loads"}
      </button>


      {/* CREATE LOAD FORM */}

      {showForm && (

        <motion.form
          onSubmit={createLoad}
          initial={{opacity:0, y:20}}
          animate={{opacity:1, y:0}}
          className="mt-6 grid grid-cols-2 gap-4"
        >

          <input
            name="pickup_location"
            placeholder="Pickup Location"
            value={form.pickup_location}
            onChange={handleChange}
            className="border p-2 rounded text-gray-700"
            required
          />

          <input
            name="delivery_location"
            placeholder="Delivery Location"
            value={form.delivery_location}
            onChange={handleChange}
            className="border p-2 rounded text-gray-700"
            required
          />

          <input
            type="date"
            name="pickup_date"
            value={form.pickup_date}
            onChange={handleChange}
            className="border p-2 rounded text-gray-700"
            required
          />

          <input
            type="date"
            name="delivery_date"
            value={form.delivery_date}
            onChange={handleChange}
            className="border p-2 rounded text-gray-700"
            required
          />

          <input
            name="miles"
            placeholder="Miles"
            type="number"
            value={form.miles}
            onChange={handleChange}
            className="border p-2 rounded text-gray-700"
            required
          />

          <input
            name="rate"
            placeholder="Rate ($)"
            type="number"
            value={form.rate}
            onChange={handleChange}
            className="border p-2 rounded text-gray-700"
            required
          />

          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            className="border p-2 rounded text-gray-700"
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded col-span-2"
          >
            Save Load
          </button>

        </motion.form>

      )}


      {/* LOAD LIST */}

      {showLoads && loads.length > 0 && (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

          {loads.map((load)=>(
            
<motion.div
  key={load.id}
  initial={{opacity:0,y:30}}
  animate={{opacity:1,y:0}}
  className="bg-white rounded-xl shadow-md p-6"
>

<Link href={`/loads/${load.id}`}>
  <h3 className="text-lg font-semibold text-black mb-2 cursor-pointer hover:underline">
    {load.pickup_location} → {load.delivery_location}
  </h3>
</Link>

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

{load.driver && (
  <p className="text-gray-600 text-sm">
    Driver: {load.driver.name}
  </p>
)}

{profile.role === "dispatcher" && load.status === "assigned" && ( // solo mostramos el boton de completar para los dispatchers y solo para loads asignados, no tiene sentido mostrarlo para los drivers porque ellos no completan los loads, los dispatchers son los que marcan los loads como completados cuando el driver les avisa que ya lo completaron

  <button
    onClick={()=>completeLoad(load.id)}
    className="bg-purple-600 text-white px-3 py-1 rounded mt-2"
  >
    Mark Completed
  </button>

)}

{profile.role === "driver" && load.status === "open" && (

  <ClaimLoadButton
    loadId={load.id}
    userId={user.id}
    refreshLoads={refreshLoads}
  />

)}



</motion.div>


          ))}

        </div>

      )}

    </div>
  );
}