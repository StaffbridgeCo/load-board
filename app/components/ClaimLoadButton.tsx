//app/components/ClaimLoadButton.tsx
//con este componente es el boton para que los driver puedan reclamar un load, se le pasa el id del load, el id del usuario y una funcion para refrescar los loads despues de reclamar uno
"use client";

import { supabase } from "../../lib/supabaseClient";

interface Props {
  loadId: string;
  userId: string;
  refreshLoads: () => void;
}

export default function ClaimLoadButton({ loadId, userId, refreshLoads }: Props) {

  async function claimLoad() {

    const { error } = await supabase // actualizamos el load con el id del load que queremos reclamar, cambiamos el status a assigned y le asignamos el id del driver que lo reclamo, solo se pueden reclamar loads que esten abiertos
      .from("loads") 
      .update({
        status: "assigned",
        driver_id: userId
      })
      .eq("id", loadId)
      .eq("status", "open");

    if (error) {
      console.log(error);
      alert("Error claiming load");
      return;
    }

    alert("Load claimed successfully");

    refreshLoads();
  }

  return (
    <button
      onClick={claimLoad}
      className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm mt-3"
    >
      Claim Load
    </button>
  );
}