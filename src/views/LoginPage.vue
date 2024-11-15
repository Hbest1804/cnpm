<template>
    <div class="giua">
      <h1>Đăng nhập</h1>
      <form @submit.prevent="handleLogin" id="loginForm">
        <input type="text" v-model="username" placeholder="Mã đăng nhập" required />
        <input type="password" v-model="password" placeholder="Mật khẩu" required />
        <button type="submit">Nhấn để đăng nhập</button>
        <img src="img/Logo_dhktdn.png" alt="Logo" class="logo" />
      </form>
      <p v-if="message" class="message">{{ message }}</p> <!-- Hiển thị thông báo -->
      <div class="register-link">
        Nếu bạn chưa có tài khoản, hãy <router-link to="/signup">nhấn vào đây để đăng ký</router-link>.
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        message: '', // Biến để lưu thông báo
        
      };
    },
    methods: {
      handleLogin() {
        // Giả sử kiểm tra đăng nhập thành công với username và password cố định
        if (this.username === 'admin' && this.password === '123456') {
          this.message = 'Đăng nhập thành công!';
        } else {
          this.message = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
        }
      },
    },
  };
  </script>
  
  <style scoped>
  body {
 
    background-size: cover;
    background-position: right;
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 100vh;
    margin: 0;
    padding-left: 20px;
  }
  
  .giua {
    text-align: center;
  }
  
  h1 {
    font-size: 24px;
    color: #2db62b;
    margin-bottom: 20px;
  }
  
  form {
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 500px;
  }
  
  input {
    width: 100%;
    padding: 10px;
    margin: 10px 50px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
  
  button {
    width: 100%;
    padding: 15px;
    background-color: #4c4faf;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 20px;
  }
  
  button:hover {
    background-color: #a04546;
  }
  
  .message {
    color: green;
    font-size: 16px;
    margin-top: 10px;
  }
  
  .register-link {
    margin-top: 15px;
    font-size: 14px;
  }
  
  .register-link a {
    color: #4c4faf;
    text-decoration: none;
    font-weight: bold;
  }
  
  .register-link a:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 600px) {
    form {
      width: 100%;
      padding: 15px;
    }
  }
  
  .logo {
    width: 150px;
    margin-top: 20px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  </style>
  