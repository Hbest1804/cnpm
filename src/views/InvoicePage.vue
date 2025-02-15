<template>
  <div class="order-history">
    <!-- Menu điều hướng -->
    <nav class="menu">
      <router-link to="/">
        <button>Trang Chủ</button>
      </router-link>
      
      <router-link to="/cart">
        <button>Giỏ Hàng</button>
      </router-link>
    
    </nav>

    <h1>Lịch Sử Mua Hàng</h1>

    <!-- Link quay về trang chủ -->
    
    <table v-if="invoices.length">
      <thead>
        <tr>
          <th>Mã hóa đơn</th>
          <th>Ngày tạo</th>
          <th>Thời gian</th>
          <th>Tổng cộng</th>
          <th>Trạng thái</th>
          <th>Chi tiết</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="invoice in invoices" :key="invoice.invoiceId">
          <td>{{ invoice.invoiceId }}</td>
          <td>{{ formatDate(invoice.invoiceDate) }}</td>
          <td>{{ formatTime(invoice.created_at) }}</td>
          <td>{{ formatCurrency(invoice.total) }}</td>
          <td>{{ invoice.status }}</td>
          <td><button @click="fetchInvoiceDetails(invoice.invoiceId)">Xem</button></td>
        </tr>
      </tbody>
    </table>
    <p v-else>Không có hóa đơn nào.</p>

    <!-- Hiển thị chi tiết hóa đơn -->
    <div v-if="selectedInvoice" class="invoice-details">
      <h2>Chi Tiết Hóa Đơn</h2>
      <p><strong>Mã hóa đơn:</strong> {{ selectedInvoice.invoiceId }}</p>
      <p><strong>Ngày:</strong> {{ formatDate(selectedInvoice.invoiceDate) }}</p>
      <p><strong>Thời gian:</strong> {{ formatTime(selectedInvoice.invoiceDate) }}</p>
      <p><strong>Trạng thái:</strong> {{ selectedInvoice.status }}</p>
      <table>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in selectedInvoice.items" :key="item.productId">
            <td>{{ item.name }}</td>
            <td>{{ formatCurrency(item.price) }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ formatCurrency(item.price * item.quantity) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      invoices: [],
      selectedInvoice: null
    };
  },
  methods: {
    async loadInvoices() {
      try {
        const response = await fetch('http://localhost:3000/api/invoices');
        if (response.ok) {
          this.invoices = await response.json();
        } else {
          console.error('Không thể tải lịch sử mua hàng');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu hóa đơn:', error);
      }
    },
    async fetchInvoiceDetails(invoiceId) {
  try {
    const response = await fetch(`http://localhost:3000/api/invoice_items/${invoiceId}`);
    if (response.ok) {
      this.selectedInvoice = await response.json();
      console.log('Chi tiết hóa đơn:', this.selectedInvoice); // Kiểm tra dữ liệu trả về
    } else {
      console.error('Không thể tải chi tiết hóa đơn');
    }
  } catch (error) {
    console.error('Lỗi khi tải chi tiết hóa đơn:', error);
  }
},


    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('vi-VN');
    },
    formatTime(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleTimeString('vi-VN');
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }
  },
  mounted() {
    this.loadInvoices();
  }
};
</script>

<style scoped>
.menu {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  background-color: #e92323;
  padding: 10px;
  border-radius: 8px;
}

.menu button {
  background-color: #ff424e;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.menu button:hover {
  background-color: #e33b3f;
}

.order-history {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #10100e;
  border-radius: 8px;
}

h1 {
  text-align: center;
  color: #ff424e;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th,
table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

table th {
  background-color: #e92323;
  color: white;
}

button {
  background-color: #ff424e;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #e33b3f;
}

.invoice-details {
  margin-top: 20px;
}

.invoice-details table {
  width: 100%;
  margin-top: 20px;
}

.invoice-details th,
.invoice-details td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
}
</style>
