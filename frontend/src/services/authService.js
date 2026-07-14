import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token to every outgoing request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = async (username, email, password) => {
  const response = await api.post("/auth/register", {
    username,
    email,
    password,
  });

  if (response.data?.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }

  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  if (response.data?.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }

  return response.data;
};

export const loginWithGoogle = async (mockToken, email, name) => {
  const response = await api.post("/auth/google", {
    token: mockToken,
    email,
    name,
  });

  if (response.data?.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }

  return response.data;
};

export const loginWithApple = async (mockToken, email, name) => {
  const response = await api.post("/auth/apple", {
    token: mockToken,
    email,
    name,
  });

  if (response.data?.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const getCurrentToken = () => {
  return localStorage.getItem("token");
};

export default api;