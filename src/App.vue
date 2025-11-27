<template>
  <div>
    <div class="ui inverted segment navbar">
      <div class="ui container">
        <div class="ui large secondary inverted pointing menu">

          <router-link to="/moods" class="item">
            <i class="list icon"></i>Moods
          </router-link>
          <router-link to="/moods/add" class="item">
            <i class="plus icon"></i>New
          </router-link>
          <router-link to="/moods/statistics" class="item">
            <i class="chart bar icon"></i>Statistics
          </router-link>
          <router-link to="/moods/pomodoro" class="item">
            <i class="clock icon"></i>Pomodoro
          </router-link>

          <div class="right menu">
            <template v-if="!auth.isLoggedIn">
              <router-link to="/login" class="item">Login</router-link>
              <router-link to="/register" class="item">Register</router-link>
            </template>
            <template v-else>
              <a class="item" @click="onLogout">
                <i class="sign out alternate icon"></i> Logout
              </a>
            </template>
          </div>

        </div>
      </div>
    </div>

    <div class="ui grid">
      <div class="row">
        <div class="sixteen wide column">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from './helpers/auth';
import { useRouter } from 'vue-router'; // 1. Import Router
import Swal from 'sweetalert2';         // 2. Import SweetAlert2

const auth = useAuthStore();
const router = useRouter(); // 3. Khởi tạo router

auth.init();

// 4. Viết hàm xử lý Logout
const onLogout = async () => {
  // Bước 1: Xóa token/state trong store
  auth.logout();

  // Bước 2: Hiện thông báo đẹp
  await Swal.fire({
    icon: 'success',
    title: 'Logged Out',
    text: 'See you again soon! 👋',
    timer: 1500,
    showConfirmButton: false,
    toast: true,           // Dạng thông báo nhỏ (toast)
    position: 'top-end'    // Hiện ở góc trên bên phải cho tinh tế
  });

  // Bước 3: Chuyển hướng về trang Login
  router.push('/login');
};

</script>

<style scoped>
/* Thêm chút CSS để menu không bị dính sát lề trên cùng */
.navbar {
  border-radius: 0 !important;
  margin-bottom: 0 !important;
}
</style>