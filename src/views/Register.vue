<template>
  <div class="register-background">
    <div class="ui container register-wrapper">
      
      <div class="ui middle aligned center aligned grid">
        <div class="column">
          
          <h2 class="ui teal image header" style="margin-bottom: 30px;">
            <div class="content" style="color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              Join Us Today! 🚀
              <div class="sub header" style="color: #f0f0f0;">Create your account to start tracking</div>
            </div>
          </h2>

          <div class="ui large form">
            <div class="ui stacked segment register-card">
              
              <div class="field">
                <div class="ui left icon input large">
                  <i class="user icon"></i>
                  <input 
                    v-model="username" 
                    type="text" 
                    placeholder="Choose a Username"
                  >
                </div>
              </div>

              <div class="field">
                <div class="ui left icon input large">
                  <i class="lock icon"></i>
                  <input 
                    v-model="password" 
                    type="password" 
                    placeholder="Password"
                  >
                </div>
              </div>

              <div class="field">
                <div class="ui left icon input large">
                  <i class="check circle icon"></i>
                  <input 
                    v-model="confirmPassword" 
                    type="password" 
                    placeholder="Confirm Password"
                    @keyup.enter="registerNow"
                  >
                </div>
              </div>

              <div 
                class="ui fluid large teal submit button" 
                :class="{ loading: isLoading }" 
                @click="registerNow"
              >
                Create Account
              </div>

            </div>

            <div class="ui error message" style="display: block;" v-if="errorMessage">
                {{ errorMessage }}
            </div>

          </div>

          <div class="ui message">
            Already have an account? <router-link to="/login">Log In</router-link>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../helpers/auth";
import { useRouter } from "vue-router"; // Dùng router để chuyển trang mượt hơn
import Swal from "sweetalert2";

const username = ref("");
const password = ref("");
const confirmPassword = ref(""); // Biến mới để check trùng khớp
const isLoading = ref(false);
const errorMessage = ref("");

const auth = useAuthStore();
const router = useRouter(); // Khai báo router

const registerNow = async () => {
  // 1. Reset lỗi
  errorMessage.value = "";

  // 2. Validate phía Client (Quan trọng)
  if (!username.value || !password.value) {
    errorMessage.value = "Please fill in all fields.";
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value = "Password must be at least 6 characters.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match!";
    return;
  }

  // 3. Gọi API
  isLoading.value = true;
  try {
    await auth.register(username.value, password.value);
    
    // Thông báo thành công đẹp mắt
    Swal.fire({
      icon: "success",
      title: "Account Created!",
      text: "You can now log in.",
      confirmButtonColor: '#00b5ad'
    }).then(() => {
        // Chuyển hướng sang trang Login sau khi ấn OK
        router.push('/login'); 
    });

  } catch (err) {
    errorMessage.value = err.response?.data?.error || err.message || "Registration failed.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 1. BACKGROUND GRADIENT (Giống trang Login cho đồng bộ) */
.register-background {
  background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-wrapper {
  max-width: 450px !important;
  width: 100%;
}

/* 2. CARD DESIGN */
.register-card {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
  border-radius: 10px !important;
  border: none !important;
  padding: 40px 30px !important;
}

/* 3. BUTTON STYLING */
.ui.teal.button {
  background-color: #00b894;
  transition: all 0.3s ease;
  color: white;
}

.ui.teal.button:hover {
  background-color: #01a383;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 184, 148, 0.4);
}

/* Mobile Fix */
.ui.grid { margin: 0 !important; }
.column { max-width: 450px; }
</style>