### 1. Một block chứa những thành phần nào?
      - Transaction: danh sách các giao dịch
      - Block: khối dữ liệu
      - Hash: mã băm
      - Dấu thời gian (Timestamp)

### 2. Vì sao dữ liệu trên blockchain không thể bị sửa đổi?
      - Tính bất biến: dữ liệu đã ghi vào không thể thay đổi.
      - Mã băm liên kết các khối: thay đổi dữ liệu làm mã băm thay đổi, khiến các khối sau không hợp lệ.
      - Cơ chế đồng thuận: chỉ chấp nhận thay đổi khi có sự đồng thuận từ phần lớn các nút.

### 3. So sánh cách lưu lịch sử trong Git và Blockchain?
      - Giống nhau:
          * Sử dụng mã băm để đảm bảo tính toàn vẹn dữ liệu.
          * Dùng cấu trúc chuỗi liên kết để tạo quan hệ giữa các phiên bản.
      - Khác nhau:
          * Git: lịch sử có thể sửa đổi, lưu trữ tập trung, dùng cơ chế merge.
          * Blockchain: lịch sử bất biến, lưu trữ phi tập trung, dùng cơ chế đồng thuận.

### 4. Blockchain khác gì so với database truyền thống?
      - Blockchain:
         * Lưu trữ trong các khối, liên kết bằng mã băm.
         * Tính bất biến: dữ liệu không thể thay đổi.
         * Phi tập trung: không có thực thể duy nhất kiểm soát.
         * Bảo mật cao nhờ cơ chế đồng thuận và mã hóa.
     - Database truyền thống:
         * Lưu trữ trong các bảng, có thể thay đổi.
         * Tính khả biến: dữ liệu có thể cập nhật, sửa đổi hoặc xóa.
         * Tập trung: do một thực thể duy nhất kiểm soát.
         * Bảo mật phụ thuộc vào hệ thống quản lý cơ sở dữ liệu.

### 5. Tại sao nói blockchain là một hệ thống không cần trung gian?
      - Phi tập trung: giao dịch được xác thực bởi mạng lưới các nút.
      - Cơ chế đồng thuận: loại bỏ sự cần thiết của bên thứ ba.
      - Giảm chi phí, tăng tốc độ giao dịch, loại bỏ rủi ro từ các bên trung gian.