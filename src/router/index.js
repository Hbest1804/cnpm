import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';  // Ensure the correct path
import LoginPage from '@/views/LoginPage.vue';
import SignUpPage from '@/views/SignPage.vue';  // Using @ to refer to src
import ProductList from  '@/views/ProductList.vue';
import CartPage from  '@/views/CartPage.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,  // Default home page
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,  // Login page
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpPage,  // The new SignUp page route
  },
  {
    path:'/product',
    name:'ProductList',
    component: ProductList,
  },
  {
    path: '/cart',
    name: 'CartPage',
    component: CartPage
  }
  // Add other routes if necessary
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});



export default router;
