module.exports = {
  devServer: {
    proxy: {
      '/img': {
        target: 'http://localhost:3000',  // Đảm bảo yêu cầu hình ảnh được chuyển đến đúng backend
        changeOrigin: true,
        pathRewrite: {
          '^/img': '/img',  // Giữ nguyên phần /img trong URL
        },
      },
    },
  },
};

