<template>
  <div>
    <!-- Navigation Menu -->
    <nav class="navbar">
      <div class="navbar-container">
        <a href="/" class="navbar-brand">Trang chủ</a>
        <ul class="navbar-links">
          <li><a href="/cart" class="nav-item">Giỏ hàng</a></li>
          <li><a href="/products" class="nav-item">Sản phẩm</a></li>
         
        </ul>
      </div>
    </nav>

    <!-- Cart Page -->
    <div class="cart-page">
      <h1>Giỏ hàng của bạn</h1>
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <img :src="`/img/${item.image}`" alt="product-image" />
        <div>
          <h2>{{ item.name }}</h2>
          <p>Giá: {{ item.price }}đ</p>
          <p>Thời gian: {{ getCurrentTime() }}</p>
          <input type="number" v-model="item.quantity" @change="updateQuantity(item)" min="1" />
          <button @click="removeItem(item.id)">Xóa</button>
        </div>
      </div>
      <div class="total">
        <p>Tổng cộng: {{ totalPrice }}đ</p>
      </div>
      <div class="checkout-section">
        <h2>Thông tin thanh toán</h2>
        <form @submit.prevent="processCheckout">
          <label>
            Họ và tên:
            <input type="text" v-model="checkoutInfo.name" required />
          </label>
          <label>
            Địa chỉ:
            <input type="text" v-model="checkoutInfo.address" required />
          </label>
          <label>
            Phương thức thanh toán:
            <select v-model="checkoutInfo.paymentMethod" required>
              <option value="credit">Thẻ tín dụng</option>
              <option value="cash">Tiền mặt khi nhận hàng</option>
            </select>
          </label>
          <button type="submit">Xác nhận thanh toán</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [],
      checkoutInfo: {
        name: '',
        address: '',
        paymentMethod: '',
      },
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    },
  },
  methods: {
    async loadCart() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      this.cartItems = cart;
    },
    async updateQuantity(item) {
      const index = this.cartItems.findIndex((cartItem) => cartItem.id === item.id);
      if (index !== -1) {
        this.cartItems[index].quantity = item.quantity;
      }
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
      await this.updateCartServer(this.cartItems);
    },
    async removeItem(id) {
      this.cartItems = this.cartItems.filter((item) => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
      await this.updateCartServer(this.cartItems);
    },
    async updateCartServer(cart) {
      try {
        await fetch('http://localhost:3000/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cart),
        });
      } catch (error) {
        console.error('Lỗi cập nhật giỏ hàng:', error);
      }
    },
    getCurrentTime() {
      const now = new Date();
      return now.toLocaleString('vi-VN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    },
    async processCheckout() {
      const checkoutData = {
        invoiceDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        total: this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
        status: 'Đã thanh toán',
        items: this.cartItems,
      };

      try {
        const response = await fetch('http://localhost:3000/api/invoices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(checkoutData),
        });

        if (response.ok) {
          localStorage.setItem('checkoutInfo', JSON.stringify(checkoutData));
          alert('Thanh toán thành công! Cảm ơn bạn đã mua hàng.');
          localStorage.removeItem('cart');
          this.cartItems = [];
          this.$router.push({ name: 'invoice' });
        } else {
          alert('Lỗi');
        }
      } catch (error) {
        console.error('Lỗi kết nối server:', error);
        alert('Lỗi khi thanh toán. Vui lòng thử lại.');
      }
    },
  },
  mounted() {
    this.loadCart();
  },
};
</script>

<style>
/* Menu Styles */
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

.navbar-brand {
  font-size: 20px;
  color: white;
  text-decoration: none;
}

.navbar-links {
  display: flex;
  gap: 20px;
}

.nav-item {
  color: white;
  text-decoration: none;
  font-size: 16px;
}

.nav-item:hover {
  text-decoration: underline;
}

.cart-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #10100e;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(18, 209, 56, 0.868);
}

/* Existing styles for the cart page */
h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #31ee0b;
  padding: 15px 0;
}

.cart-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 20px;
}

.cart-item div {
  flex: 1;
}

.cart-item h2 {
  font-size: 18px;
  color: #cc1818;
  margin: 0 0 5px;
}

.cart-item p {
  font-size: 16px;
  color: #ff424e;
  margin: 0 0 10px;
}

.cart-item input[type="number"] {
  width: 60px;
  padding: 5px;
  font-size: 16px;
  margin-right: 10px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.cart-item button {
  background-color: #ff424e;
  color: #fff;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cart-item button:hover {
  background-color: #e33b3f;
}

.total {
  text-align: right;
  font-size: 18px;
  font-weight: bold;
  color: #e92323;
  margin-top: 20px;
}

.checkout-section {
  margin-top: 30px;
  padding: 20px;
  background-color: #151414;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(18, 209, 56, 0.868);
}

.checkout-section h2 {
  font-size: 20px;
  color: #e11010;
  margin-bottom: 20px;
}

.checkout-section label {
  display: block;
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.checkout-section input[type="text"],
.checkout-section select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
}

.checkout-section button[type="submit"] {
  width: 100%;
  background-color: #ff424e;
  color: #fff;
  padding: 12px;
  font-size: 18px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.checkout-section button[type="submit"]:hover {
  background-color: #e33b3f;
}
</style>
