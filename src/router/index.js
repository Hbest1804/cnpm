import { createRouter, createWebHistory } from 'vue-router';

// Import your components
import HomePage from '@/views/HomePage.vue';
import ProductList from '@/views/ProductList.vue';
import SignPage from '@/views/SignPage.vue';
import InvoicePage from '@/views/InvoicePage.vue';
import LoginPage from '@/views/LoginPage.vue';
import CartPage from '@/views/CartPage.vue';
import AdminPage from '@/views/AdminPage.vue'; // Add the AdminPage

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,  // The home page
  },
  {
    path: '/product',
    name: 'product',
    component: ProductList,  // The product page
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignPage,  // The signup page
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,  // The login page
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartPage,  // The cart page
  },
  {
    path: '/invoice',
    name: 'invoice',
    component: InvoicePage,  // Invoice page
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPage,  // Admin page for managing products, users, etc.
    // You can add a meta field to check for authentication if needed
    meta: { requiresAuth: true, isAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
