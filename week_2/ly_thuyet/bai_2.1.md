### 1. Smart contract chạy ở đâu? Khác gì với Express backend?
    - Smart contract chạy trên Blockchain Network (ví dụ: Ethereum Virtual Machine).
    - Khác Express backend ở chỗ:
        - Backend truyền thống chạy trên máy chủ tập trung, smart contract chạy phân tán -  trên mạng ngang hàng
        - Thay vì xử lý HTTP request, smart contract xử lý transaction trên blockchain
### 2. Smart contract có sửa được không sau khi deploy?
    - Không thể sửa trực tiếp sau khi deploy.
### 3. Hãy kể 2 ứng dụng mà smart contract phù hợp hơn backend truyền thống?
    - 1. Giao dịch tài chính phi tập trung (DeFi) 
        - Ví dụ: Uniswap, Aave, Compound.
        - Yêu cầu minh bạch, không cần trung gian, và bất biến trong xử lý logic tài chính.

    - 2. Quản lý tài sản NFT hoặc sở hữu kỹ thuật số
        - Ví dụ: OpenSea, các dự án game blockchain.
        - Việc chứng minh quyền sở hữu, chuyển nhượng tài sản minh bạch được đảm bảo bởi smart contract.
### 4. Solidity là gì? Bạn thấy nó gần giống với ngôn ngữ nào?
    - Solidity là ngôn ngữ lập trình chính để viết smart contract trên nền tảng Ethereum.
    - Có cú pháp và phong cách gần giống với JavaScript (một phần cũng giống C++).
### 5. Gọi hàm contract khác gì với gọi REST API?
    - Qua transaction blockchain.
    - Trả phí gas
    - Bất đồng bộ
    - Không thể undo
