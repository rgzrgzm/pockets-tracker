// 🔌 SUPABASE CONNECTION — uncomment and configure when ready
//
// import { createClient } from '@supabase/supabase-js'
//
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
//
// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Migration plan:
// 1. Create tables: pockets (id, user_id, name, emoji, color, type, target_amount, created_at, updated_at)
//                   transactions (id, user_id, pocket_id, type, amount, date, note, created_at)
// 2. Add row-level security policies
// 3. Replace localStorage calls with supabase queries:
//    - appReducer actions → async thunks or useEffect + API calls
//    - Login: supabase.auth.signInWithPassword
//    - CRUD: supabase.from('pockets').insert/update/delete
// 4. Use realtime subscriptions for live updates

export {}
