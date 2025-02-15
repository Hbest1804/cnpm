<template>
  <div id="app">
    <div class="container mt-5">
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Quản lý Hóa đơn</a>
        <div class="ml-auto">
          <button @click="logout" class="btn btn-danger">Đăng xuất</button>
        </div>
      </nav>

      <!-- View Switch -->
      <div class="mt-3">
        <button @click="currentView = 'products'" class="btn btn-primary">Sản phẩm</button>
        <button @click="currentView = 'invoices'" class="btn btn-primary">Hóa đơn</button>
      </div>

      <!-- Product Management -->
      <div v-if="currentView === 'products'">
        <h2>Quản lý Sản phẩm</h2>
        <table class="table mt-3">
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.name }}</td>
              <td>{{ formatCurrency(product.price) }}</td>
              <td>
                <button @click="editProduct(product)" class="btn btn-warning btn-sm">Sửa</button>
                <button @click="deleteProduct(product.id)" class="btn btn-danger btn-sm">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="openAddProductModal" class="btn btn-success mt-3">Thêm sản phẩm</button>

        <!-- Modal Add Product -->
        <div v-if="showModal" class="modal">
          <div class="modal-content">
            <span @click="closeModal" class="close">&times;</span>
            <h3>Thêm sản phẩm</h3>
            <input type="text" v-model="newProduct.name" placeholder="Tên sản phẩm" class="form-control" />
            <input type="number" v-model="newProduct.price" placeholder="Giá sản phẩm" class="form-control mt-2" />
            <button @click="addProduct" class="btn btn-primary mt-2">Thêm sản phẩm</button>
          </div>
        </div>
      </div>

      <!-- Invoice Management -->
      <div v-if="currentView === 'invoices'">
        <h2>Quản lý Hóa đơn</h2>
        <table class="table mt-3">
          <thead>
            <tr>
              <th>Mã Hóa đơn</th>
              <th>Tên người mua</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="invoice in invoices" :key="invoice.id">
              <td>{{ invoice.invoiceId }}</td>
              <td>{{ invoice.customerName }}</td>
              <td>{{ formatCurrency(invoice.total) }}</td>
              <td>{{ invoice.status }}</td>
              <td>
                <button @click="deleteInvoice(invoice.id)" class="btn btn-danger btn-sm">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      currentView: 'products', // Mặc định là sản phẩm
      products: [],  // Danh sách sản phẩm
      invoices: [],  // Danh sách hóa đơn
      showModal: false,
      newProduct: {
        name: '',
        price: ''
      }
    };
  },
  methods: {
    openAddProductModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async addProduct() {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.post('http://localhost:3000/api/products', this.newProduct, {
          headers: {
            'Authorization': token
          }
        });
        alert(response.data.message);
        this.fetchProducts();
        this.newProduct.name = '';
        this.newProduct.price = '';
        this.showModal = false;
      } catch (error) {
        console.error('Error adding product:', error);
        alert('Error adding product');
      }
    },
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    editProduct(product) {
      console.log('Sửa sản phẩm:', product);
    },
    async deleteProduct(productId) {
      const token = localStorage.getItem('authToken');
      try {
        await axios.delete(`http://localhost:3000/api/products/${productId}`, {
          headers: {
            'Authorization': token
          }
        });
        this.fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    },
    async fetchInvoices() {
      try {
        const response = await axios.get('http://localhost:3000/api/invoices');
        console.log(response.data); // Kiểm tra dữ liệu trả về từ API
        this.invoices = response.data;
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    },

    async deleteInvoice(invoiceId) {
      const token = localStorage.getItem('authToken');
      try {
        await axios.delete(`http://localhost:3000/api/invoices/${invoiceId}`, {
          headers: {
            'Authorization': token
          }
        });
        this.fetchInvoices();
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Error deleting invoice');
      }
    },
    formatCurrency(price) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },
    logout() {
      localStorage.removeItem('authToken');
      this.$router.push('/');  // Quay lại trang chủ
    }
  },
  created() {
    this.fetchProducts(); // Lấy danh sách sản phẩm khi load trang
    this.fetchInvoices(); // Lấy danh sách hóa đơn khi load trang
  }
};
</script>

<style scoped>
/* Thêm một số kiểu CSS cho modal */
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  margin: 10% auto;
  padding: 20px;
  width: 300px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
