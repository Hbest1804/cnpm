<template>
  <div class="giua">
    <div class="form-container">
      <h1>Đăng nhập</h1>
      <form @submit.prevent="handleLogin" id="loginForm">
        <input type="text" v-model="username" placeholder="Mã đăng nhập" required />
        <input type="password" v-model="password" placeholder="Mật khẩu" required />
        <button type="submit">Nhấn để đăng nhập</button>
        <!-- Thêm ảnh dưới nút đăng nhập -->
        <div class="bottom-image-container">
          <img src="@/img/z.png" alt="Bottom Image" class="bottom-image" />
        </div>
        <p v-if="message" class="message">{{ message }}</p> <!-- Hiển thị thông báo -->
        <div class="register-link">
          Nếu bạn chưa có tài khoản, hãy <router-link to="/signup">nhấn vào đây để đăng ký</router-link>.
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      message: '',
    };
  },
  methods: {
    // Hàm xử lý đăng nhập
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:3000/api/login', {
          username: this.username,
          password: this.password,
        });

        // Kiểm tra kết quả từ API
        if (response.data.message === 'Đăng nhập thành công!') {
          this.message = 'Đăng nhập thành công!';

          // Lưu vai trò người dùng vào localStorage
          localStorage.setItem('userRole', response.data.role);  // Lưu vai trò (role) người dùng vào localStorage

          // Chuyển hướng dựa trên vai trò
          if (response.data.role === 'admin') {
            this.$router.push('/admin'); // Chuyển đến trang admin nếu là admin
          } else {
            this.$router.push('/'); // Chuyển đến trang chủ nếu không phải admin
          }
        } else {
          this.message = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
        }
      } catch (error) {
        console.error('Login error:', error);
        this.message = 'Đã có lỗi xảy ra, vui lòng thử lại.';
      }
    }
  }
};
</script>

<style scoped>
/* Định nghĩa kiểu dáng CSS cho form đăng nhập và các thành phần khác */

body {
  background-position: center;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center; /* Căn giữa toàn bộ nội dung */
  align-items: center;
  height: 100vh;
  margin: 0;
  padding-left: 20px;
}

.giua {
  display: flex;
  justify-content: flex-start; /* Căn form về bên trái */
  align-items: flex-start;
  width: 100%;
  height: 100vh;
  padding-left: 50px; /* Tạo khoảng cách bên trái */
  background-image: url('https://cellphones.com.vn/sforum/wp-content/uploads/2024/04/anh-bia-facebook-2.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.form-container {
  text-align: center;
  flex: 1;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
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

.bottom-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 20px;
}

.bottom-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease-in-out;
}

.bottom-image:hover {
  transform: scale(1.05);
}
</style>
