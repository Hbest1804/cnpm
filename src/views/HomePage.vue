<template>
  <div>
  
    <div class="top-bar">
      <div>🚚 Giao nhanh - Miễn phí cho đơn từ 300K</div>
      <div><a href="#">Sản phẩm Chính hãng - Xuất VAT đầy đủ</a></div>
      <div><a href="#">Thu cũ Giá ngon - Lên đời tiết kiệm</a></div>
    </div>

   
    <header class="main-header">
      <div class="nav-container">
        <div class="logo">
          <img src="@/img/z.png" alt="Logo">
        </div>
        <nav>
          <ul class="nav-menu">
            <li>
              <router-link to="/product">Sản Phẩm</router-link>
              <ul>
                <li>Điện thoại</li>
                <li>Laptop</li>
                <li>Máy tính bảng</li>
              </ul>
            </li>
          </ul>
        </nav>
        <div class="search-cart">
          <input type="text" v-model="searchQuery" placeholder="Tìm kiếm sản phẩm..." @input="searchProducts">
          <!-- Kiểm tra người dùng đã đăng nhập chưa -->
          <router-link v-if="!isLoggedIn" to="/signup">
            <button>Đăng ký</button>
          </router-link>
          <router-link v-if="!isLoggedIn" to="/login">
            <button>Đăng nhập</button>
          </router-link>
          <!-- Hiển thị Giỏ hàng và Admin nếu đã đăng nhập -->
          <router-link  to="/cart">
            <button>Giỏ hàng ({{ cart.length }})</button>
          </router-link>
          <!-- Hiển thị "Admin" nếu người dùng là admin -->
          <div v-if="isAdmin" class="admin-badge">Xin chào Admin</div>
          <router-link v-if="!isLoggedIn" to="/invoice">
            <button>Lịch sử mua hàng</button>
          </router-link>
     
        </div>
      </div>
    </header>

    <!-- Carousel -->
    <div class="carousel">
      <img
        v-for="(image, index) in images"
        :key="index"
        :src="image"
        alt="Carousel Image"
        :class="{'active': index === currentIndex}"/>
      <!-- Carousel Buttons -->
      <div class="carousel-buttons">
        <button @click="prevImage">Previous</button>
        <button @click="nextImage">Next</button>
      </div>
    </div>

    <!-- Sản phẩm yêu thích -->
    <div class="favorite-products-section">
      <h2>Tất cả sản phẩm yêu thích</h2>
      <div class="products-container">
        <div class="product-card" v-for="(product, index) in favoriteProducts" :key="index">
          <img src="@/img/Screenshot 2024-11-17 202637.png" alt="Product Image" />
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <p class="price">{{ product.price }} VND</p>
            <button @click="removeFromFavorites(product)">Xóa khỏi yêu thích</button>
            <button @click="addToCart(product)">Thêm vào giỏ hàng</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="main-footer">
      <p>&copy; 2024 Vạn Cổ. All rights reserved.</p>
      <div class="footer-links">
        <a href="#">Chính sách bảo mật</a>
        <a href="#">Điều khoản sử dụng</a>
        <a href="#">Liên hệ</a>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      currentIndex: 0,
      images: [
        require('@/assets/logo.png'),
        require('@/assets/ah.png'),
      ],
      favoriteProducts: [],
      cart: [],
      searchQuery: '',
      isLoggedIn: false, // Trạng thái đăng nhập
    };
  },
  computed: {
    isAdmin() {
      return localStorage.getItem('userRole') === 'admin'; // Kiểm tra vai trò admin
    }
  },
  mounted() {
    this.setAutoSlide();
    this.fetchProducts();
    this.checkLoginStatus(); // Kiểm tra trạng thái đăng nhập khi tải trang
  },
  methods: {
    setAutoSlide() {
      setInterval(() => {
        this.nextImage();
      }, 5000);
    },
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    prevImage() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    },
    fetchProducts() {
      axios.get('http://localhost:3000/api/home')
        .then(response => {
          this.favoriteProducts = response.data;
        })
        .catch(error => {
          console.error('Có lỗi khi lấy sản phẩm:', error);
        });
    },
    removeFromFavorites(product) {
      const index = this.favoriteProducts.indexOf(product);
      if (index !== -1) {
        this.favoriteProducts.splice(index, 1);
        console.log('Sản phẩm đã được xóa khỏi yêu thích:', product);
      }
    },
    addToCart(product) {
      const existingProduct = this.cart.find(item => item.id === product.id);
      if (!existingProduct) {
        this.cart.push(product);
        console.log('Sản phẩm đã được thêm vào giỏ hàng:', product);
      } else {
        alert('Sản phẩm đã có trong giỏ hàng!');
      }
    },
    async searchProducts() {
      try {
        const response = await axios.get(`http://localhost:3000/api/products/search?query=${this.searchQuery}`);
        this.favoriteProducts = response.data;
      } catch (error) {
        console.error('Lỗi khi tìm kiếm sản phẩm:', error);
      }
    },
    // Kiểm tra trạng thái đăng nhập
    checkLoginStatus() {
      const token = localStorage.getItem('authToken');
      if (token) {
        this.isLoggedIn = true;
      }
    }
  }
};
</script>

<style scoped>
/* Reset cơ bản */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Body */
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  color: #333;
}

/* Top Bar */
.top-bar {
  background-color: #0044cc;
  color: white;
  padding: 10px 0;
  display: flex;
  justify-content: space-around;
  font-size: 14px;
  text-align: center;
}

.top-bar a {
  color: #00aaff;
  text-decoration: none;
  font-weight: bold;
}

.top-bar a:hover {
  text-decoration: underline;
}

/* Header chính */
.main-header {
  background-color: #d0021b;
  padding: 15px 0;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo img {
  width: 150px;
}

.nav-menu {
  list-style: none;
  display: flex;
}

.nav-menu > li {
  position: relative;
  margin: 0 15px;
  color: white;
  cursor: pointer;
}

.nav-menu > li:hover {
  text-decoration: underline;
}

.nav-menu > li ul {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  list-style: none;
  z-index: 1000;
  min-width: 200px;
}

.nav-menu > li:hover ul {
  display: block;
}

.nav-menu li ul li {
  padding: 5px 10px;
  color: black;
}

.nav-menu li ul li:hover {
  background-color: #f0f0f0;
}

/* Search và cart */
.search-cart {
  display: flex;
  align-items: center;
}

.search-cart input {
  padding: 7px;
  font-size: 16px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.search-cart button {
  background-color: #ff6600;
  color: white;
  border: none;
  padding: 7px 15px;
  margin-right: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-cart button:hover {
  background-color: #e65c00;
}

/* Carousel */
.carousel {
  max-width: 1200px;
  margin: 20px auto;
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  border-radius: 10px;
}

.carousel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: none;
  border-radius: 10px;
}

.carousel img.active {
  display: block;
}

.carousel-buttons {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

.carousel-buttons button {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: 2px solid white;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
}

.carousel-buttons button:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

/* Sản phẩm yêu thích */
.favorite-products-section {
  padding: 20px;
  background-color: #fff;
}

.favorite-products-section h2 {
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
}

.products-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}
.product-card img {
  width: 100%;            /* Đảm bảo hình ảnh chiếm toàn bộ chiều rộng của thẻ card */
  height: 200px;          /* Thiết lập chiều cao cố định để tất cả hình ảnh đồng nhất */
  object-fit: cover;      /* Đảm bảo hình ảnh không bị méo, cắt phần dư thừa */
  border-radius: 10px;    /* Làm mềm góc ảnh */
  margin-bottom: 10px;    /* Thêm khoảng cách giữa ảnh và thông tin sản phẩm */
}


.product-card:hover {
  transform: translateY(-10px);
}

.product-info {
  text-align: center;
}

.product-info h3 {
  font-size: 18px;
}

.product-info .price {
  font-weight: bold;
  color: #ff6600;
}

/* Footer */
.main-footer {
  background-color: #222;
  color: white;
  padding: 20px;
  text-align: center;
}

.footer-links a {
  color: #ff6600;
  margin: 0 10px;
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}
</style>
