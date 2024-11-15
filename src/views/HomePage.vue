<template>
    <div>
        <!-- Thanh thông tin trên cùng -->
        <div class="top-bar">
            <div>🚚 Giao nhanh - Miễn phí cho đơn từ 300K</div>
            <div><a href="#">Sản phẩm Chính hãng - Xuất VAT đầy đủ</a></div>
            <div><a href="#">Thu cũ Giá ngon - Lên đời tiết kiệm</a></div>
        </div>

        <!-- Header chính -->
        <header class="main-header">
            <div class="nav-container">
                <div class="logo">
                   <img src="@/img/Screenshot 2024-10-23 215725.png" alt="Logo">

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
                    <input type="text" placeholder="Tìm kiếm đi nào">
                    <router-link to="/signup">
                        <button>Đăng ký</button>
                    </router-link>
                    <router-link to="Login">
                        <button>Đăng nhập</button>
                    </router-link>
                    <router-link to="cart">
                    <button>Giỏ hàng</button>
                    </router-link>
                </div>
            </div>
        </header>

        <!-- Carousel -->
        <div class="carousel">
            <img src="img/5e3be8a90a516ad4eda2668d0d2feb55.png" alt="iPhone 16 Pro" class="active">
            <img src="img/h.jpg.jpg" alt="iPhone 16 Pro Side View">
            <img src="img/third-image.png" alt="iPhone 16 Pro Back View">
            
            <!-- Carousel Buttons -->
            <div class="carousel-buttons">
                <button @click="prevImage">Previous</button>
                <button @click="nextImage">Next</button>
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
export default {
    data() {
        return {
            currentIndex: 0,
            images: []
        };
    },
    mounted() {
        // Populate images array with the img elements in the carousel
        this.images = this.$el.querySelectorAll('.carousel img');
        this.setAutoSlide();
    },
    methods: {
        setAutoSlide() {
            setInterval(this.nextImage, 5000);
        },
        nextImage() {
            this.images[this.currentIndex].classList.remove('active');
            this.currentIndex = (this.currentIndex + 1) % this.images.length;
            this.images[this.currentIndex].classList.add('active');
        },
        prevImage() {
            this.images[this.currentIndex].classList.remove('active');
            this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
            this.images[this.currentIndex].classList.add('active');
        }
    }
};
</script>

<style scoped>
/* Reset margin, padding, and box-sizing */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Body styles */
body {
    font-family: Arial, sans-serif;
}

/* Top bar */
.top-bar {
    background-color: #0044cc; /* Thay đổi màu nền */
    color: white;
    padding: 10px 0;
    text-align: center;
    font-size: 14px;
    display: flex;
    justify-content: space-around;
}

.top-bar a {
    color: #00aaff;
    text-decoration: none;
    font-weight: bold;
}

.top-bar a:hover {
    text-decoration: underline;
}

/* Main header */
.main-header {
    background-color: #D0021B;
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
    align-items: center;
}

.nav-menu > li {
    position: relative;
    margin: 0 15px;
    font-size: 16px;
    color: white;
    cursor: pointer;
}

.nav-menu > li:hover {
    text-decoration: underline;
}

.nav-menu > li > ul {
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

.nav-menu > li:hover > ul {
    display: block;
}

.nav-menu > li ul li {
    padding: 5px 10px;
    white-space: nowrap;
    color: black;
}

.nav-menu > li ul li:hover {
    background-color: #f0f0f0;
}

/* Search and cart */
.search-cart {
    display: flex;
    align-items: center;
}

.search-cart input {
    padding: 5px;
    font-size: 16px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.search-cart button {
    background-color: #FF6600;
    color: white;
    border: none;
    padding: 7px 15px;
    margin-right: 10px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.search-cart button:hover {
    background-color: #E65C00;
}

/* Footer */
.main-footer {
    background-color: #1e64ba;
    color: white;
    text-align: center;
    padding: 20px 0;
    font-size: 16px;
}

.footer-links {
    margin-top: 10px;
}

.footer-links a {
    color: white;
    text-decoration: none;
    margin: 0 15px;
}

.footer-links a:hover {
    text-decoration: underline;
}

/* Carousel */
.carousel {
    max-width: 1200px;
    margin: 20px auto;
    position: relative;
    text-align: center;
    height: 400px;
    background-color: black;
    display: flex;
    align-items: center;
    justify-content: center;
}

.carousel img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: none;
}

.carousel img.active {
    display: block;
}

/* Carousel Buttons */
.carousel-buttons {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: space-between;
    width: 200px;
}

.carousel-buttons button {
    background-color: transparent;
    color: white;
    border: 2px solid white;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease, border-color 0.3s ease;
}

.carousel-buttons button:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border-color: #E65C00;
}

</style>
