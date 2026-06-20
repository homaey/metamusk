import { Session } from "next-auth";

export interface AppUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: "CLIENT" | "LAWYER" | "ADMIN";
  lawyerId?: string | null;
  lawyerStatus?: string | null;
}

export function getUser(session: Session | null): AppUser | null {
  if (!session?.user) return null;
  return session.user as unknown as AppUser;
}
