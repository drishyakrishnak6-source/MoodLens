import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

// Register a new user
export async function registerUser(username, email, password) {
  const response = await axios.post(`${API_URL}/register`, {
    username,
    email,
    password,
  });
  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }
  return response.data;
}

// Login — FastAPI's OAuth2PasswordRequestForm needs form-urlencoded data
export async function loginUser(email, password) {
  const formData = new URLSearchParams();
  formData.append("username", email); // backend calls it "username" but we send email
  formData.append("password", password);

  const response = await axios.post(`${API_URL}/login`, formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }
  return response.data;
}

export async function loginWithGoogle(token, email = null, name = null) {
  const response = await axios.post(`${API_URL}/auth/google`, {
    token,
    email,
    name,
  });
  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }
  return response.data;
}

export async function loginWithApple(token, email = null, name = null) {
  const response = await axios.post(`${API_URL}/auth/apple`, {
    token,
    email,
    name,
  });
  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }
  return response.data;
}


export function logoutUser() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return !!getToken();
}