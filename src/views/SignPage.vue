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
        alert(response.data.message); // Show success message
      } catch (error) {
        alert('Lỗi đăng ký: ' + error.response.data.message);
      }
    }
  }
};
</script>

<style scoped>
body {
  background-color: #1a1a1a; /* Dark background */
  color: #e0e0e0; /* Light text color for readability */
  font-family: Arial, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
}

.signup {
  text-align: center;
}

h2 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #4caf50; /* Green color for the header */
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
  border-color: #4caf50; /* Green border on focus */
  outline: none;
}

.form-group input::placeholder {
  color: #aaa;
}

button {
  width: 100%;
  padding: 15px;
  background-color: #0f5add; /* Primary button color */
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #388e3c; /* Darker green on hover */
}

.message {
  color: #e53935; /* Red color for error messages */
  font-size: 16px;
  margin-top: 10px;
}


</style>
