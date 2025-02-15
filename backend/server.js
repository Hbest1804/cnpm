const express = require('express');
const cors = require('cors');
// const bcrypt = require('bcrypt');
const mysql = require('mysql2'); // Import mysql2
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');


// Cấu hình CORS cho phép tất cả các domain
app.use(cors());

// Middleware để xử lý dữ liệu JSON
app.use(express.json());

// Cấu hình kết nối MySQL
const db = mysql.createConnection({
  host: 'localhost', // Địa chỉ MySQL server
  user: 'root', // Tên người dùng MySQL
  password: '', // Mật khẩu MySQL (có thể để trống nếu không có mật khẩu cho tài khoản root)
  database: 'cnpm' // Tên cơ sở dữ liệu của bạn
});

// Kết nối với cơ sở dữ liệu MySQL
db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối MySQL:', err);
    process.exit(1); // Dừng ứng dụng nếu kết nối không thành công
  }
  console.log('Kết nối đến MySQL thành công!');
});

// Route đăng ký người dùng
app.post('/api/signup', async (req, res) => {
  const { username, password, email, role } = req.body;
  const userRole = role || 'user'; // Mặc định là 'user'

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
  }

  // Kiểm tra xem email đã được đăng ký chưa
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Lỗi kiểm tra email:', err);
      return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email đã được đăng ký.' });
    }

    // Thêm người dùng vào cơ sở dữ liệu với vai trò
    db.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, password, userRole],
      (err, results) => {
        if (err) {
          console.error('Lỗi thêm người dùng:', err);
          return res.status(500).json({ message: 'Lỗi máy chủ.' });
        }
        res.status(201).json({ message: 'Đăng ký thành công.' });
      }
    );
  });
});

// Middleware kiểm tra vai trò admin
function checkAdmin(req, res, next) {
  const { username } = req.body;
  db.query('SELECT role FROM users WHERE username = ?', [username], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ message: 'Không xác thực được vai trò.' });
    }
    if (results[0].role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập.' });
    }
    next();
  });
}
// Route để admin thêm sản phẩm
app.post('/api/admin/add-product', checkAdmin, (req, res) => {
  const { name, price, description } = req.body;
  db.query(
    'INSERT INTO products (name, price, description) VALUES (?, ?, ?)',
    [name, price, description],
    (err, result) => {
      if (err) {
        console.error('Lỗi thêm sản phẩm:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ.' });
      }
      res.status(201).json({ message: 'Sản phẩm đã được thêm.' });
    }
  );
});

// Route cập nhật trạng thái đơn hàng
app.put('/api/orders/:orderId/status', checkAdmin, (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  db.query(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, orderId],
    (err) => {
      if (err) {
        console.error('Lỗi cập nhật trạng thái đơn hàng:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ.' });
      }
      res.json({ message: 'Cập nhật trạng thái đơn hàng thành công.' });
    }
  );
});

// Route mẫu
app.get('/api/home', (req, res) => {
  const sql = 'SELECT * FROM home';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy sản phẩm:', err);
      res.status(500).json({ error: 'Có lỗi xảy ra khi lấy sản phẩm.' });
      return;
    }
    res.json(results);
  });
});

// Route đăng nhập người dùng
// Route đăng nhập người dùng
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn người dùng:', err);
      return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Tên đăng nhập không đúng.' });
    }

    // So sánh mật khẩu (nên sử dụng bcrypt nếu mật khẩu đã mã hóa)
    if (results[0].password === password) {
      const role = results[0].role;  // Lấy thông tin vai trò
      return res.status(200).json({ 
        message: 'Đăng nhập thành công!', 
        role: role  // Gửi vai trò về phía client
      });
    } else {
      return res.status(400).json({ message: 'Mật khẩu không đúng.' });
    }
  });
});
  // Lấy danh sách sản phẩm và gán URL hình ảnh đầy đủ
  app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
      } else {
        res.json(results);
      }
    });
  });

  // Route lấy giỏ hàng của người dùng
app.get('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId;
  
  // Truy vấn giỏ hàng của người dùng từ cơ sở dữ liệu
  db.query('SELECT * FROM cart WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn giỏ hàng:', err);
      return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
    res.json(results);
  });
});

// Route thêm sản phẩm vào giỏ hàng
app.post('/api/cart', (req, res) => {
  const { userId, productId, quantity } = req.body;
  
  // Kiểm tra nếu thiếu thông tin
  if (!userId || !productId || !quantity) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
  }

  // Kiểm tra nếu sản phẩm đã có trong giỏ
  db.query('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, productId], (err, results) => {
    if (err) {
      console.error('Lỗi kiểm tra sản phẩm trong giỏ:', err);
      return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }

    if (results.length > 0) {
      // Cập nhật số lượng sản phẩm trong giỏ
      db.query('UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?', [quantity, userId, productId], (err, updateResult) => {
        if (err) {
          console.error('Lỗi cập nhật sản phẩm:', err);
          return res.status(500).json({ message: 'Lỗi máy chủ.' });
        }
        res.status(200).json({ message: 'Sản phẩm đã được cập nhật trong giỏ hàng.' });
      });
    } else {
      // Thêm sản phẩm mới vào giỏ
      db.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, productId, quantity], (err, insertResult) => {
        if (err) {
          console.error('Lỗi thêm sản phẩm vào giỏ:', err);
          return res.status(500).json({ message: 'Lỗi máy chủ.' });
        }
        res.status(201).json({ message: 'Sản phẩm đã được thêm vào giỏ hàng.' });
      });
    }
  });
});

// Route xóa sản phẩm khỏi giỏ hàng
app.delete('/api/cart/:userId/:productId', (req, res) => {
  const { userId, productId } = req.params;
  
  db.query('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId], (err, result) => {
    if (err) {
      console.error('Lỗi xóa sản phẩm khỏi giỏ:', err);
      return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
    res.status(200).json({ message: 'Sản phẩm đã được xóa khỏi giỏ hàng.' });
  });
});

// Route xử lý thanh toán
app.post('/api/checkout', (req, res) => {
  const { userId, checkoutInfo } = req.body;
  const { name, address, paymentMethod } = checkoutInfo;
  
  // Kiểm tra nếu thiếu thông tin
  if (!name || !address || !paymentMethod) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin thanh toán.' });
  }

  // Lấy giỏ hàng của người dùng để tính tổng giá trị
  db.query('SELECT * FROM cart WHERE user_id = ?', [userId], (err, cartItems) => {
    if (err) {
      console.error('Lỗi lấy giỏ hàng:', err);
      return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }

    let totalAmount = 0;
    cartItems.forEach(item => {
      totalAmount += item.price * item.quantity;
    });

    // Lưu thông tin thanh toán vào cơ sở dữ liệu hoặc thực hiện các thao tác cần thiết
    const query = "INSERT INTO orders (user_id, name, address, payment_method) VALUES (?, ?, ?, ?)";
    db.query(query, [userId, name, address, paymentMethod], (err, results) => {
      if (err) {
        console.error('Error inserting order:', err);
        return res.status(500).json({ message: 'Error placing order.' });
      }
      res.status(201).json({ message: 'Order placed successfully.' });
    });
    

        // Xóa giỏ hàng sau khi thanh toán
        db.query('DELETE FROM cart WHERE user_id = ?', [userId], (err, deleteResult) => {
          if (err) {
            console.error('Lỗi xóa giỏ hàng:', err);
            return res.status(500).json({ message: 'Lỗi máy chủ.' });
          }
          res.status(200).json({ message: 'Thanh toán thành công. Cảm ơn bạn đã mua hàng!' });
        });
    });
  });
 

app.get('/api/user/:userId/invoices', (req, res) => {
  const { userId } = req.params;
  const query = 'SELECT * FROM invoices WHERE userId = ?';
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      res.status(500).send('Lỗi server');
    } else {
      res.json(results);
    }
  });
});

// API lấy chi tiết hóa đơn


app.post('/api/checkout', (req, res) => {
  const { checkoutInfo, cartItems, totalPrice } = req.body;

  // Lưu thông tin vào bảng `invoices`
  const invoiceQuery = `INSERT INTO invoices (name, address, payment_method, total_price) VALUES (?, ?, ?, ?)`;
  db.query(invoiceQuery, [checkoutInfo.name, checkoutInfo.address, checkoutInfo.paymentMethod, totalPrice], (err, result) => {
    if (err) {
      console.error('Lỗi tạo hóa đơn:', err);
      return res.status(500).json({ message: 'Lỗi khi tạo hóa đơn' });
    }

    const invoiceId = result.insertId;  // Lấy ID của hóa đơn vừa tạo

    // Lưu từng sản phẩm vào bảng `invoice_items`
    const itemQueries = cartItems.map(item => {
      return new Promise((resolve, reject) => {
        const itemQuery = `INSERT INTO invoice_items (invoice_id, product_name, price, quantity) VALUES (?, ?, ?, ?)`;
        db.query(itemQuery, [invoiceId, item.name, item.price, item.quantity], (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });

    // Chạy tất cả các truy vấn thêm sản phẩm
    Promise.all(itemQueries)
      .then(() => res.json({ message: 'Thanh toán thành công!' }))
      .catch(err => {
        console.error('Lỗi thêm sản phẩm:', err);
        res.status(500).json({ message: 'Lỗi khi lưu sản phẩm' });
      });
  });
});
app.post('/api/orders', (req, res) => {
  const { cart, checkoutInfo, totalPrice } = req.body;

  if (!checkoutInfo.name || !checkoutInfo.address || !checkoutInfo.paymentMethod) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // Chỉ truyền các giá trị không có user_id
  db.query('INSERT INTO orders (total_amount, name, address, payment_method) VALUES (?, ?, ?, ?)', [
    totalPrice,
    checkoutInfo.name,
    checkoutInfo.address,
    checkoutInfo.paymentMethod
  ], (err, result) => {
    if (err) {
      console.error('Database error:', err); 
      return res.status(500).json({ success: false, message: 'Error processing order', error: err.message });
    }
    res.status(200).json({ success: true, message: 'Order placed successfully' });
  });
});

app.get('/api/invoices', (req, res) => {
  const sql = 'SELECT * FROM invoices'; // Thay 'invoices' bằng bảng bạn sử dụng
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send('Lỗi khi lấy hóa đơn');
    } else {
      res.json(results);
    }
  });
});

// Route lấy chi tiết hóa đơn theo ID
app.get('/api/invoices/:id', (req, res) => {
  const invoiceId = req.params.id;
  const sql = 'SELECT * FROM invoice_details WHERE invoiceId = ?'; // Chỉnh bảng phù hợp
  db.query(sql, [invoiceId], (err, results) => {
    if (err) {
      res.status(500).send('Lỗi khi lấy chi tiết hóa đơn');
    } else {
      res.json(results);
    }
  });
});

app.use(express.json()); // Để xử lý dữ liệu JSON gửi từ frontend

// Route thêm hóa đơn mới
app.post('/api/invoices', (req, res) => {
  const { invoiceDate, total, status, items } = req.body;

  // Thêm thông tin hóa đơn vào bảng invoices
  const insertInvoiceSql = 'INSERT INTO invoices (invoiceDate, total, status) VALUES (?, ?, ?)';
  db.query(insertInvoiceSql, [invoiceDate, total, status], (err, result) => {
    if (err) {
      console.error('Lỗi khi thêm hóa đơn:', err);
      res.status(500).send('Lỗi khi thêm hóa đơn');
      return;
    }

    const invoiceId = result.insertId;

    // Thêm chi tiết hóa đơn vào bảng invoice_details
    const insertDetailSql = 'INSERT INTO invoice_items (invoiceId, name, price, quantity, created_at) VALUES ?';
    const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' '); // Định dạng ngày giờ 'YYYY-MM-DD HH:MM:SS'
    
    const detailsValues = items.map(item => [invoiceId, item.name, item.price, item.quantity, currentDateTime]);
    

    db.query(insertDetailSql, [detailsValues], (err) => {
      if (err) {
        console.error('Lỗi khi thêm chi tiết hóa đơn:', err);
        res.status(500).send('Lỗi khi thêm chi tiết hóa đơn');
        return;
      }
      res.status(200).send({ message: 'Hóa đơn đã được lưu thành công' });
    });
  });
});
app.post('/api/products', (req, res) => {
  const { name, price } = req.body;

  // Kiểm tra thông tin sản phẩm
  if (!name || !price) {
    return res.status(400).json({ message: 'Tên sản phẩm và giá không được để trống' });
  }

  // Thêm sản phẩm vào cơ sở dữ liệu
  const query = 'INSERT INTO products (name, price) VALUES (?, ?)';
  db.query(query, [name, price], (err, result) => {
    if (err) {
      console.error('Lỗi thêm sản phẩm:', err);
      return res.status(500).json({ message: 'Lỗi thêm sản phẩm' });
    }
    res.status(201).json({ message: 'Sản phẩm đã được thêm thành công', productId: result.insertId });
  });
});


app.get('/api/invoice_items/:invoiceId', (req, res) => {
  const { invoiceId } = req.params;
  const sql = 'SELECT * FROM invoice_items WHERE invoiceId = ?';

  db.query(sql, [invoiceId], (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy chi tiết hóa đơn:', err);
      res.status(500).send('Lỗi khi lấy chi tiết hóa đơn');
      return;
    }
    console.log('Dữ liệu trả về:', results);
    res.status(200).json({ invoiceId, items: results });
  });
});

// Route xóa sản phẩm
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const query = 'DELETE FROM products WHERE id = ?';

  db.query(query, [productId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Xóa sản phẩm thất bại!' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm!' });
    }

    res.json({ message: 'Xóa sản phẩm thành công!' });
  });
});

app.delete('/api/invoices/:invoiceId', (req, res) => {
  const invoiceId = req.params;

  // SQL query to delete the invoice
  const query = 'DELETE FROM invoices WHERE invoiceId = ?';

  db.query(query, [invoiceId], (err, result) => {
    if (err) {
      console.error('Error deleting invoice:', err);
      return res.status(500).json({ message: 'Error deleting invoice' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json({ message: 'Invoice deleted successfully' });
  });
});


// Khởi động server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
