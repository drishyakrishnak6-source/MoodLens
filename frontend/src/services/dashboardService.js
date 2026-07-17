const API_URL = "http://localhost:8000/dashboard";

export const getDashboard = async () => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return await response.json();
};