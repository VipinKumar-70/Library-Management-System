const BASE_URL = import.meta.env.VITE_BASE_URL;

export const userProfile = async () => {
  const res = await fetch(`${BASE_URL}/api/profile`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Not authenticated");
  }

  return res.json();
};

export const getAllStudents = async () => {
  const res = await fetch(`${BASE_URL}/admin/students`, {
    method: "GET",
    credentials: "include", // VERY IMPORTANT (cookie)
  });

  return res.json();
};

// DELETE
export const deleteStudent = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/students/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return res.json();
};

// UPDATE
export const updateStudent = async (id, data) => {
  const res = await fetch(`${BASE_URL}/admin/students/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
};
