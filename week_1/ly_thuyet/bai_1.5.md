### 1. UTXO là viết tắt của cụm từ gì?
    - Unspent Transaction Output: danh sách các giao dịch chưa được sử dụng.
### 2. Sự khác biệt chính giữa mô hình UTXO và Account là gì?
    Account model:
      - Trực quan, đơn giản.
      - Tốt cho lập trình logic (contract).
      - Dễ bị lỗi race condition khi nhiều người tương tác cùng lúc.

    UTXO model:
      - Bảo mật cao (khó bị replay hoặc lỗi race condition).
      - Dễ xử lý song song.
      - Phức tạp hơn trong phát triển.
### 3. Ưu điểm của UTXO model so với Account là gì?
    - Bảo mật cao.
    - Dễ xử lý song song.
    - Phù hợp với các ứng dụng cần bảo mật cao.
### 4. Vì sao Ethereum chọn account model thay vì UTXO?
    - Ethereum dùng account vì cần dễ viết smart contract.