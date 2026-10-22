import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "student" | "teacher" | "hod" | "admin";

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: roles, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  console.log("AUTH USER ID:", user.id);
  console.log("AUTH USER EMAIL:", user.email);
  console.log("AUTH USER ROLES:", roles);

  return {
    id: user.id,
    email: user.email,
    fullName: user.user_metadata?.full_name ?? null,
    roles: (roles ?? []).map((item) => item.role as AppRole),
  };
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(allowedRoles: AppRole[]) {
  const user = await requireUser();

  const hasPermission = user.roles.some((role) =>
    allowedRoles.includes(role),
  );

  if (!hasPermission) {
    redirect("/forbidden");
  }

  return user;
}
