// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js"// Este archivo es el cliente de Supabase que se utiliza en toda la aplicación para interactuar con la base de datos y la autenticación. Aquí se crea una instancia del cliente de Supabase utilizando la URL y la clave pública que se encuentran en las variables de entorno. Luego, esta instancia se exporta para que pueda ser utilizada en otros archivos de la aplicación.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)