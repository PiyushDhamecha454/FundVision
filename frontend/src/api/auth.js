const BASE_URL = "http://127.0.0.1:8000";

export const registerUser = async ({ name, email, password }) => {
  return fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  }).then(res => res.json());
};

export const loginUser = async ({ email, password }) => {
  const form = new FormData();
  form.append("username", email);
  form.append("password", password);

  return fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    body: form,
  }).then(res => res.json());
};

export const getInsights = async (fundName, token) => {
  return fetch(`${BASE_URL}/live_insights/${fundName}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json());
};
