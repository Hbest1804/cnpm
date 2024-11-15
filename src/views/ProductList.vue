<template>
  <div class="product-list">
    <div class="product-container">
      <div class="product-card" v-for="product in products" :key="product.id">
        <div class="product-image">
          <img :src="product.image" :alt="product.name" />
          <span v-if="product.installment" class="installment">Trả góp 0%</span>
          <span v-if="product.discount" class="discount">Giảm {{ product.discount }}%</span>
        </div>
        <div class="product-details">
          <p class="product-name">{{ product.name }}</p>
          <p class="price">{{ product.price }}đ</p>
          <p class="promotion" v-if="product.promotion">{{ product.promotion }}</p>
          <button class="buy-button">Mua ngay</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [
        {
          id: 1,
          image: 'link_image_macbook_pro',
          name: 'MacBook Pro 14 M4 10CPU 10GPU 16GB 512GB',
          price: '39.990.000',
          
          installment: true,
          discount: null,
        },
        {
          id: 2,
          image: 'link_image_mac_mini',
          name: 'Mac mini M4 2024 10CPU 16GB 256GB',
          price: '14.990.000',
      
          installment: true,
          discount: null,
        },
        {
          id: 3,
          image: 'link_image_mac_mini',
          name: 'Laptop ASUS TUF GAMING F15 FX506HF-HN014W',
          price: '16.290.000đ',
      
          installment: true,
          discount: null,
        },
        {
          id: 4,
          image: require('@/img/Screenshot 2024-11-14 160308.png'),
          name: 'Đồng hồ thông minh Huawei Watch GT 5',
          price: '4.990.000',
      
          installment: true,
          discount: null,
        },  
         {
          id: 5,
          image: 'link_image_mac_mini',
          name: 'Samsung Galaxy Z Flip5 512GB',
          price: '18.490.000',
      
          installment: true,
          discount: null,
        },

    
      ],
    };
  },
};
</script>

<style scoped>
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
