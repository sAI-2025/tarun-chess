import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { email, password } = await req.json();

  // Create user via admin API
  const { data: userData, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) {
    // If user already exists, try to find them
    if (createError.message?.includes("already been registered")) {
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) return new Response(JSON.stringify({ error: listError.message }), { status: 500 });
      const existing = users?.find(u => u.email === email);
      if (!existing) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
      
      // Ensure admin role exists
      await supabase.from("admin_roles").upsert({ user_id: existing.id, role: "admin" }, { onConflict: "user_id,role" });
      return new Response(JSON.stringify({ message: "Admin role ensured for existing user", user_id: existing.id }));
    }
    return new Response(JSON.stringify({ error: createError.message }), { status: 500 });
  }

  // Insert admin role
  const { error: roleError } = await supabase.from("admin_roles").insert({ user_id: userData.user.id, role: "admin" });
  if (roleError) {
    return new Response(JSON.stringify({ error: roleError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Admin created", user_id: userData.user.id }));
});
