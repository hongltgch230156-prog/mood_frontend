<template>
  <div class="login-background">
    <div class="ui container login-wrapper">
      
      <div class="ui middle aligned center aligned grid">
        <div class="column">
          
          <h2 class="ui teal image header" style="margin-bottom: 30px;">
            <div class="content" style="color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              Mood & Productivity Journal 
              <div class="sub header" style="color: #f0f0f0;">Log in to your account</div>
            </div>
          </h2>

          <div class="ui large form">
            <div class="ui stacked segment login-card">
              
              <div class="field">
                <div class="ui left icon input large">
                  <i class="user icon"></i>
                  <input 
                    v-model="username" 
                    type="text" 
                    placeholder="Username"
                    @keyup.enter="loginNow"
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
                    @keyup.enter="loginNow"
                  >
                </div>
              </div>

              <div 
                class="ui fluid large teal submit button" 
                :class="{ loading: isLoading }" 
                @click="loginNow"
              >
                Login
              </div>

            </div>

            <div class="ui error message" style="display: block;" v-if="errorMessage">
                {{ errorMessage }}
            </div>

          </div>

          <div class="ui message">
            New to us? <a href="/register">Sign Up</a>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../helpers/auth";
import Swal from "sweetalert2";

const username = ref("");
const password = ref("");
const isLoading = ref(false); // Thêm trạng thái loading quay quay
const errorMessage = ref(""); // Biến chứa lỗi để hiện lên form
const auth = useAuthStore();

const loginNow = async () => {
  // Reset lỗi cũ
  errorMessage.value = "";
  
  if(!username.value || !password.value) {
      errorMessage.value = "Please enter both username and password.";
      return;
  }

  isLoading.value = true; // Bật loading

  try {
    await auth.login(username.value, password.value);

    Swal.fire({
      icon: "success",
      title: "Welcome back!",
      text: `Login Successful!`,
      timer: 1500,
      showConfirmButton: false,
      background: '#fff',
      iconColor: '#00b5ad'
    });

    setTimeout(() => {
      window.location.href = "/";
    }, 1500);

  } catch (err) {
    // Hiện lỗi
    errorMessage.value = err.response?.data?.error || err.message || "Login failed.";
    
    // Rung lắc form (nếu muốn làm kỹ hơn) hoặc chỉ báo lỗi
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: errorMessage.value,
    });
  } finally {
    isLoading.value = false; // Tắt loading dù thành công hay thất bại
  }
};
</script>

<style scoped>
/* 1. BACKGROUND GRADIENT ĐẸP MẮT */
.login-background {
  background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
  min-height: 100vh; /* Full màn hình */
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-wrapper {
  max-width: 450px !important; /* Giới hạn chiều rộng form */
  width: 100%;
}

/* 2. CARD LOGIN */
.login-card {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important; /* Đổ bóng sâu tạo chiều sâu */
  border-radius: 10px !important; /* Bo tròn góc */
  border: none !important;
  padding: 40px 30px !important; /* Khoảng cách bên trong rộng rãi */
}

/* 3. TÙY CHỈNH NÚT BẤM */
.ui.teal.button {
  background-color: #00b894;
  transition: all 0.3s ease;
}

.ui.teal.button:hover {
  background-color: #01a383;
  transform: translateY(-2px); /* Hiệu ứng nhấc nút lên khi hover */
  box-shadow: 0 5px 15px rgba(0, 184, 148, 0.4);
}

/* Fix lỗi hiển thị trên mobile */
.ui.grid {
    margin: 0 !important;
}
.column {
    max-width: 450px;
}
</style>