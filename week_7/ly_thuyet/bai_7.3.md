## Modifier để làm gì?

    Kiểm tra điều kiện trước khi thực thi một hàm
    Tự động kiểm tra các điều kiện thường xuyên được sử dụng
    Giảm sự lặp lại của mã và tăng tính đọc được
    Thay đổi hành vi của các hàm một cách dễ dàng

## Whitelist lưu bằng cấu trúc dữ liệu gì?

    Whitelist thường được lưu bằng cấu trúc dữ liệu mapping trong Solidity.

## Tại sao nên hạn chế hàm withdraw?

    Bảo mật: Ngăn chặn việc rút tiền trái phép
    Kiểm soát: Đảm bảo chỉ những người được ủy quyền mới có thể rút tiền
    Quản lý rủi ro: Giảm thiểu khả năng mất mát do lỗi hoặc tấn công

## Làm sao kiểm tra một địa chỉ có trong whitelist?

    function isWhitelisted(address _address) public view returns (bool) {
        return whitelist[_address];
    }

## Withdraw ETH và withdraw token khác gì nhau?

    Withdraw ETH: Sử dụng hàm transfer() hoặc call() để gửi ETH
    Withdraw token: Cần gọi hàm transfer() của contract token
    Withdraw ETH: Kiểm tra số dư ETH của contract
    Withdraw token: Kiểm tra số dư token của contract
    Withdraw ETH: Không cần phê duyệt
    Withdraw token: Có thể cần phê duyệt (approve) trước khi chuyển
