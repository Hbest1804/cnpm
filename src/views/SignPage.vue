<template>
  <div class="signup">
    <h2>Đăng ký tài khoản</h2>
    <form @submit.prevent="handleSignup">
      <div class="form-group">
        <input type="text" id="username" v-model="username" placeholder="Mã đăng nhập" required />
      </div>
      <div class="form-group">
        <input type="email" id="email" v-model="email" placeholder="Email" required />
      </div>
      <div class="form-group">
        <input type="password" id="password" v-model="password" placeholder="Mật khẩu" required />
      </div>
      <div class="form-group">
        <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="Xác nhận mật khẩu" required />
      </div>
      <button type="submit">Đăng ký</button>
      <p v-if="errorMessage" class="message">{{ errorMessage }}</p>

      <div class="logo-container">
        <img src="@/img/z.png" alt="Logo" class="logo" />
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleSignup() {
      try {
        const response = await axios.post('http://localhost:3000/api/signup', {
          username: this.username,
          password: this.password,
          email: this.email
        });
        alert(response.data.message); 
        this.$router.push('/login');// Show success message
      } catch (error) {
        console.error(error); // Log error to console for debugging
        if (error.response) {
          this.errorMessage = error.response.data.message || 'Lỗi đăng ký không xác định';
        } else {
          this.errorMessage = 'Lỗi kết nối hoặc không thể xử lý yêu cầu đăng ký.';
        }
      }
    }
  }
};
</script>

<style scoped>
/* CSS styles for the signup page */
body {
  background-color: #1a1a1a;
  color: #e0e0e0;
  font-family: Arial, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
}

.signup {
  text-align: center;
  background-image: url('https://cellphones.com.vn/sforum/wp-content/uploads/2024/04/anh-bia-facebook-3.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  justify-content: flex-start;
}

h2 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #4caf50;
}

form {
  background-color: #222;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
}

.form-group {
  width: 100%;
}

.form-group input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #444;
  background-color: #333;
  color: #e0e0e0;
  border-radius: 5px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #4caf50;
  outline: none;
}

.form-group input::placeholder {
  color: #aaa;
}

button {
  width: 100%;
  padding: 15px;
  background-color: #0f5add;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #388e3c;
}

.message {
  color: #e53935;
  font-size: 16px;
  margin-top: 10px;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.logo {
  width: 100px;
  height: auto;
  object-fit: contain;
}
</style>
