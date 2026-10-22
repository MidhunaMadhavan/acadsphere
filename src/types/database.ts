export type AppRole = "student" | "teacher" | "hod" | "admin";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type UserRole = {
  user_id: string;
  role: AppRole;
  created_at: string;
};

export type Subject = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  created_by: string | null;
  created_at: string;
};

export type InternalExam = {
  id: string;
  subject_id: string;
  created_by: string;
  name: string;
  exam_date: string;
  release_start: string;
  release_end: string;
  total_marks: number;
  configuration: Record<string, unknown>;
  status:
    | "draft"
    | "generating"
    | "validating"
    | "locked"
    | "encrypted"
    | "released"
    | "archived";
  created_at: string;
};
