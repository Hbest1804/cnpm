<template>
  <div>
    <!-- Navigation Menu -->
    <nav class="navbar">
      <div class="navbar-container">
        <a href="/" class="navbar-logo">Trang Chủ</a>
        <ul class="navbar-menu">
          
          <li><a href="/cart">Giỏ Hàng</a></li>
        </ul>
      </div>
    </nav>

    <!-- Product List -->
    <div class="product-list">
      <div class="product-container">
        <div class="product-card" v-for="product in products" :key="product.id">
          <div class="product-image">
            <img src="@/img/Screenshot 2024-11-17 201946.png" alt="product-image" />
            <span v-if="product.installment" class="installment">Trả góp 0%</span>
            <span v-if="product.discount" class="discount">Giảm {{ product.discount }}%</span>
          </div>
          <div class="product-details">
            <p class="product-name">{{ product.name }}</p>
            <p class="price">{{ product.price }}đ</p>
            <p class="promotion" v-if="product.promotion">{{ product.promotion }}</p>
            <button class="buy-button" @click="addToCart(product)">Mua ngay</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      products: [], // Danh sách sản phẩm sẽ được tải từ API
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        const data = await response.json();
        console.log(data);  // Kiểm tra dữ liệu trả về từ API
        this.products = data;
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu sản phẩm:', error);
      }
    },
    addToCart(product) {
      // Kiểm tra giỏ hàng trong localStorage
      let cart = JSON.parse(localStorage.getItem('cart')) || [];

      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingProduct = cart.find(item => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1; // Tăng số lượng nếu sản phẩm đã có trong giỏ hàng
      } else {
        cart.push({ ...product, quantity: 1 }); // Thêm sản phẩm mới vào giỏ hàng
      }

      // Lưu giỏ hàng vào localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Sản phẩm đã được thêm vào giỏ hàng');
      this.$router.push('/cart');
    }
    
  }
};
</script>



<style scoped>
/* Navigation Bar Styles */
.navbar {
  background-color: #333;
  padding: 10px 20px;
  color: white;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-logo {
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  list-style: none;
  margin: 0;
}

.navbar-menu li {
  margin: 0 15px;
}

.navbar-menu li a {
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
}

.navbar-menu li a:hover {
  color: #d32f2f;
}

/* Product List Styles */
.product-list {
  text-align: left;
  color: white;
}

.product-container {
  display: flex;
  flex-wrap: wrap;
}

.product-card {
  background-color: #1d1d1d;
  border-radius: 8px;
  padding: 16px;
  width: 220px;
  margin: 10px;
  position: relative;
}

.product-image img {
  width: 100%;
  border-radius: 8px;
}

.installment {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #1e88e5;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
}

.discount {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #d32f2f;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
}

.product-details {
  text-align: left;
}

.product-name {
  font-size: 14px;
  font-weight: bold;
}

.price {
  color: #d32f2f;
  font-size: 18px;
  font-weight: bold;
}

.promotion {
  font-size: 12px;
  color: #7c7c7c;
}

.buy-button {
  background-color: #d32f2f;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
</style>

