import { useState, useEffect } from "react";

// Local types to replace Supabase ones
export type User = {
  id?: string;
  _id?: string;
  email?: string;
  name?: string;
};

export type Session = {
  user: User;
  access_token?: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("auth_token");
      const userString = localStorage.getItem("auth_user");

      if (token && userString) {
        try {
          const parsedUser = JSON.parse(userString);
          setSession({ user: parsedUser, access_token: token });
          setUser(parsedUser);
        } catch (e) {
          console.error("Failed to parse user session");
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Set up a custom event listener so other parts of the app can trigger a re-check
    const handleAuthChange = () => initializeAuth();
    window.addEventListener("auth_changed", handleAuthChange);

    return () => {
      window.removeEventListener("auth_changed", handleAuthChange);
    };
  }, []);

  return { user, session, loading };
};
