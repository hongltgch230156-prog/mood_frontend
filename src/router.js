import { useAuthStore } from "./helpers/auth";
import { createRouter, createWebHistory } from 'vue-router'

import AddMood from './views/AddMood.vue'
import EditMood from './views/EditMood.vue'
import MoodList from './views/MoodList.vue'
import ViewMood from './views/ViewMood.vue'
import Statistics from './views/Statistics.vue'
import Pomodoro from './views/Pomodoro.vue'

import Login from './views/Login.vue'
import Register from './views/Register.vue'



const routes = [
    {
        path: '/',
        redirect: '/moods'
    },
    {
        path: '/moods/add',
        name: 'AddMood',
        component: AddMood,
        meta: { requiresAuth: true }
    },
    {
        path: '/moods/edit/:id',
        name: 'EditMood',
        component: EditMood,
        meta: { requiresAuth: true }
    },
    {
        path: '/moods',
        name: 'MoodList',
        component: MoodList,
        meta: { requiresAuth: true }
    },
    {
        path: '/moods/view/:id',
        name: 'ViewMood',
        component: ViewMood,
        meta: { requiresAuth: true }
    },
    {
        path: '/moods/statistics',
        name: 'Statistics',
        component: Statistics,
        meta: { requiresAuth: true }
    },
    {
        path: '/moods/pomodoro',
        name: 'Pomodoro',
        component: Pomodoro,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// ktra login
router.beforeEach((to, from, next) => {
    const auth = useAuthStore();
    if(to.meta.requiresAuth && !auth.isLoggedIn) {
        next('/login');  // chuyển hướng đến trang login
    } else {
        next(); // tiếp tục
    }
})

export default router