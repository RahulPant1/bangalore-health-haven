
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const searchTerm = url.searchParams.get('search') || ''
    const lat = url.searchParams.get('lat')
    const lng = url.searchParams.get('lng')
    const radius = url.searchParams.get('radius') || '10'
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = 20

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    let query = supabaseClient
      .from('bangalore_hospitals')
      .select('*')

    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`)
    }

    if (lat && lng) {
      const radiusInMeters = parseFloat(radius) * 1000
      query = query.select(`
        *,
        earth_distance(
          ll_to_earth(${lat}, ${lng}),
          ll_to_earth(cast(lat as float8), cast(lng as float8))
        ) as distance
      `)
      .order('distance')
      .lt('distance', radiusInMeters)
    }

    query = query.range((page - 1) * limit, page * limit - 1)

    const { data, error } = await query

    if (error) {
      console.error('Supabase query error:', error)
      throw error
    }

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
    console.error('Error:', error)
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
