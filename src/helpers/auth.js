import { defineStore } from "pinia";
import axios from "axios";

// Backend API base URL
const backendUrl = "https://comp1842-5lka.onrender.com/";

export const useAuthStore = defineStore("auth", {
  id: "auth",
  state: () => ({
    token: localStorage.getItem("token") || null,
    isLoggedIn: !!localStorage.getItem("token"),
  }),

  actions: {
    init() {
      if (this.token) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + this.token;
      }
    },

    // Login
    async login(username, password) {
      try {
        const res = await axios.post(backendUrl + "auth/login", { username, password });
        this.token = res.data.token;
        this.isLoggedIn = true;

        localStorage.setItem("token", this.token);
        axios.defaults.headers.common["Authorization"] = "Bearer " + this.token;
      } catch (err) {
        console.error(err);
        throw err; 
      }
    },

    // Logout
    logout() {
      this.token = null;
      this.isLoggedIn = false;
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    },

    // Register
    async register(username, password) {
      try {
        await axios.post(backendUrl + "auth/register", { username, password });
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },
});
