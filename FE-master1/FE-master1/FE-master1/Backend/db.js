// backend/db.js
const sql = require('mssql');

// Cấu hình kết nối đến SQL Server
const config = {
  user: 'sa',           // Tên người dùng SQL Server (thường là 'sa')
  password: 'tinduong0211', // Mật khẩu của người dùng
  server: 'localhost',  // Địa chỉ máy chủ SQL Server (thường là 'localhost' nếu đang chạy trên máy local)
  database: 'THUCTAP_STC_1', // Tên cơ sở dữ liệu
  options: {
    encrypt: true,  // Chế độ mã hóa kết nối (nên để true nếu sử dụng SSL)
    trustServerCertificate: true  // Tin cậy chứng chỉ máy chủ (nếu cần thiết)
  }
};

// Kết nối tới SQL Server
async function connect() {
  try {
    let pool = await sql.connect(config);
    console.log('Kết nối SQL Server thành công');
    return pool;
  } catch (err) {
    console.error('Lỗi kết nối SQL Server:', err);
    process.exit(1);  // Dừng ứng dụng nếu không kết nối được
  }
}

module.exports = connect;
