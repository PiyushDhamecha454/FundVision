const BASE_URL = "http://localhost:8000";

export const registerUser = async ({ name, email, password }) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Registration failed");
  }

  return res.json();
};

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    credentials: "include", // Fixed: Added key
    body: new URLSearchParams({
      username: email,
      password: password,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Login failed");
  }

  return res.json();
};

export const logoutUser = async () => {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include", // Fixed: Added key
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Logout failed");
  }

  return res.json();
};

export const getInsights = async (fundName) => {
  const res = await fetch(`${BASE_URL}/live_insights/${fundName}`, {
    method: "GET",
    credentials: "include", // Fixed: Added key
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to fetch insights");
  }

  return res.json();
};