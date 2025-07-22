## ERC20 và ERC721 khác nhau điểm gì?
    - ERC20 la 1 chuẩn token phổ biến, các hàm quan trọng ( mint, burn, transfer, approve)
    - ERC721 là 1 chuẩn token dành cho NFT, các hàm quan trọng ( mint, burn, transfer, approve, safeTransferFrom, safeMint, safeTransferFrom)
## Modifier `onlyOwner` để làm gì?
    - Modifier này được dùng để kiểm tra xem caller có phải là owner hay không, nếu không phải thì revert
## Event `Transfer` xuất hiện khi nào?
    - Event này được emit khi có transfer token (ERC20) hoặc mint NFT (ERC721)
## Quy trình deploy contract gồm những bước nào?
    - Viết contract
    - Compile
    - Deploy
    - Verify contract
    - Tương tác contract
## Làm sao verify contract trên Etherscan?
    - Dùng APIKey của etherscan để verify contract
    - Config: 
        import "@nomicfoundation/hardhat-verify";

        etherscan: {
        apiKey: "YOUR_ETHERSCAN_API_KEY"
        }
    - Run: npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS