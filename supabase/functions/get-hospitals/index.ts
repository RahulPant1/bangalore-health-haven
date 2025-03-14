
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const searchTerm = url.searchParams.get('search') || ''
    const lat = url.searchParams.get('lat')
    const lng = url.searchParams.get('lng')
    const radius = url.searchParams.get('radius') || '10'

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    let query = supabaseClient
      .from('bangalore_hospitals')
      .select('*')

    // Apply search filter if search term provided
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`)
    }

    // Apply location filter if coordinates provided
    if (lat && lng) {
      // Using PostGIS to calculate distance and filter within radius
      query = query.select('*, ST_Distance(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)) as distance', {
        prepare: true,
        parameters: [lng, lat]
      })
      .filter('ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)', {
        prepare: true,
        parameters: [lng, lat, radius]
      })
      .order('distance')
    }

    const { data, error } = await query

    if (error) throw error

    return new Response(
      JSON.stringify(data),
      { 
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
})
