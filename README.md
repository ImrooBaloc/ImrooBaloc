Qalamkar deployment
Local development
1.	Install Node.js 20.19 or newer.
2.	Run npm install.
3.	Copy .env.example to .env.local and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from Supabase Project Settings > API.
4.	Run npm run dev to preview the site or npm run build to create the production files in dist/.
The Supabase publishable/anon key is intended for browser use. Never add a Supabase service-role key to a VITE_* variable or commit it to the repository. Access to database rows must be controlled with row-level security.
Supabase setup
1.	Create a Supabase project and configure its Auth email provider.
2.	Apply supabase/migrations/20260930000000_create_profiles.sql and supabase/migrations/20260930010000_add_signup_profile_fields.sql in the Supabase SQL Editor. They create profiles, store signup names and unique usernames, and restrict profile reads and updates to that user.
3.	In Authentication > URL Configuration, set the Site URL to your production domain, such as https://qalamkar.example.
4.	Add https://qalamkar.example/login.html and https://qalamkar.example/reset-password.html to the allowed redirect URLs. Add the corresponding Vercel preview URLs if you use preview deployments.
Vercel setup
1.	Import this repository into Vercel. The included vercel.json runs npm run build and serves dist/.
2.	Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY under Project Settings > Environment Variables for Production, Preview, and Development as appropriate. Use the Supabase project URL and its publishable/anon key.
3.	Deploy, then assign your domain in Vercel Project Settings > Domains and follow Vercel's DNS instructions.
4.	Update the Supabase Auth Site URL and allowed redirect URLs to match the assigned domain, then redeploy if you changed environment variables.
The site is a static frontend; Supabase Auth and the profiles table are wired, while story publishing, reader interactions, and monetization data still need application features and database policies before they can use the database.

