import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jyxddzlpqmxbyqdjjrkn.supabase.co'
const supabaseKey = 'sb_publishable_OajlhrSY_HvGxSxeOXYHCw_q3uFyZz0'

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
)