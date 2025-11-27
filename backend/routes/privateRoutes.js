const token = localStorage.getItem("token");
fetch("http://localhost:3001/api/protegida", {
  headers: { Authorization: `Bearer ${token}` }
})
