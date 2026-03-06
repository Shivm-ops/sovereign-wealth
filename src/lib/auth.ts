const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const signUp = async (name: string, email: string, password: string) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Registration failed");
  return data;
};

export const signIn = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Login failed");

  localStorage.setItem("auth_token", data.token);
  localStorage.setItem("auth_user", JSON.stringify(data.user));
  window.dispatchEvent(new Event("auth_changed"));

  return { ...data, session: { user: data.user } };
};

export const signOut = async () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
  window.dispatchEvent(new Event("auth_changed"));
};

export const getSession = async () => {
  const token = localStorage.getItem("auth_token");
  const userString = localStorage.getItem("auth_user");

  if (!token || !userString) return null;

  try {
    const user = JSON.parse(userString);
    return { user, access_token: token };
  } catch (e) {
    return null;
  }
};
