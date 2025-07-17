## Mint token là gì?
    - Mint token là quá trình tạo ra token mới trong blockchain
    - Khi mint, số lượng token trong hệ thống tăng lên
    - Thường được thực hiện thông qua một hàm mint() trong smart contract
    - Với ERC-20, mint làm tăng tổng cung token; với NFT (ERC-721), mint tạo ra token với ID duy nhất
## Vì sao cần kiểm soát quyền mint?
    - Ngăn chặn lạm phát token do tạo quá nhiều
    - Bảo vệ giá trị token và uy tín của dự án
    - Tránh các cuộc tấn công bảo mật khi kẻ xấu có thể tự tạo token
    - Đảm bảo tuân thủ mô hình kinh tế và tokenomics đã định trước
    - Cho phép kiểm soát phân phối token theo kế hoạch
## `onlyOwner` là gì?
    - onlyOwner là một modifier trong Solidity giúp giới hạn quyền truy cập vào một hàm chỉ cho chủ sở hữu của hợp đồng. 
    - Nó thường được triển khai từ thư viện OpenZeppelin's Ownable và đảm bảo rằng chỉ địa chỉ được chỉ định là chủ sở hữu mới có thể gọi các hàm có modifier này.
## `onlyOwner` khác gì `public`?
    - onlyOwner là một modifier hạn chế quyền truy cập, chỉ cho phép chủ sở hữu hợp đồng gọi hàm, ngay cả khi hàm đó được khai báo là public.
    - public là một mức độ khả năng hiển thị (visibility) cho phép bất kỳ ai cũng có thể gọi hàm từ bên trong hoặc bên ngoài hợp đồng.
    - Có thể kết hợp cả hai: một hàm public với modifier onlyOwner sẽ có khả năng hiển thị công khai nhưng chỉ chủ sở hữu mới có thể thực thi thành công.
## Event Transfer xảy ra khi nào?
    - Event Transfer được phát ra khi token được chuyển từ một địa chỉ sang địa chỉ khác.
    - Nó xảy ra trong các trường hợp: khi mint token mới (chuyển từ địa chỉ 0x0 tới người nhận), khi chuyển token giữa các ví, và khi burn token (chuyển đến địa chỉ 0x0).
    - Đây là event chuẩn trong các token tuân thủ tiêu chuẩn ERC-20, ERC-721, hoặc ERC-1155.
## Làm sao kiểm tra số dư ví?
    - Đối với token ERC-20: Gọi hàm balanceOf(address account) của hợp đồng token, truyền vào địa chỉ ví cần kiểm tra.
    - Đối với NFT (ERC-721): Gọi hàm balanceOf(address owner) để biết số lượng NFT mà địa chỉ sở hữu hoặc ownerOf(uint256 - tokenId) để xác định chủ sở hữu của một token cụ thể.
    - Có thể sử dụng block explorer như Etherscan, các ví blockchain, hoặc các dApp để kiểm tra số dư token của một địa chỉ.
    - Trong code, thường sử dụng Web3.js hoặc Ethers.js với cú pháp: const balance = await tokenContract.balanceOf(address);