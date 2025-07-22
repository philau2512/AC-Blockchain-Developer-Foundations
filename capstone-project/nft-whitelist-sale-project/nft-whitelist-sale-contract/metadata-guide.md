# Hướng dẫn sử dụng metadata cho NFT

## Cấu trúc metadata

Metadata của NFT nên được lưu trữ dưới dạng JSON với cấu trúc sau:

```json
{
  "name": "NFT #1",
  "description": "Mô tả về NFT",
  "image": "https://example.com/images/1.png",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Blue"
    },
    {
      "trait_type": "Eyes",
      "value": "Green"
    },
    {
      "trait_type": "Level",
      "value": 5
    }
  ]
}
```

## Cách triển khai

1. **Hosting metadata**

   Bạn có thể lưu trữ metadata theo các cách:
   - IPFS (Interplanetary File System): Phân tán và bất biến
   - Server thông thường: Dễ cập nhật nhưng tập trung hóa
   - Arweave: Lưu trữ vĩnh viễn

2. **Cấu trúc URI**

   Khi triển khai contract, bạn cần cung cấp baseURI theo định dạng:
   - IPFS: `ipfs://QmYourCID/`
   - Web: `https://example.com/metadata/`

   Contract sẽ tự động nối baseURI với tokenId để tạo URI hoàn chỉnh.

## Ví dụ triển khai

1. **Triển khai trên IPFS**

   ```shell
   # Tạo thư mục lưu metadata
   mkdir -p metadata/images

   # Tạo file metadata
   echo '{
     "name": "NFT #1",
     "description": "Mô tả NFT số 1",
     "image": "ipfs://QmImageCID/1.png",
     "attributes": [
       {
         "trait_type": "Background",
         "value": "Blue"
       }
     ]
   }' > metadata/1.json

   # Tải lên IPFS
   # Sử dụng IPFS CLI hoặc các dịch vụ như Pinata
   ipfs add -r metadata/
   ```

2. **Triển khai contract**

   ```javascript
   // Sử dụng CID từ IPFS
   const baseURI = "ipfs://QmYourMetadataCID/"
   
   // Triển khai contract
   const nftContract = await NFTWhitelistSale.deploy(baseURI)
   ```

3. **Cập nhật baseURI sau khi triển khai**

   ```javascript
   // Nếu cần thay đổi URI
   await nftContract.setBaseURI("https://newuri.com/metadata/")
   ```

4. **Set URI cho token cụ thể**

   ```javascript
   // Đặt URI tùy chỉnh cho token số 1
   await nftContract.setTokenURI(1, "https://example.com/special/1.json")
   ```

## Lưu ý quan trọng

- Metadata nên được lưu trữ ở nơi ổn định và lâu dài
- Sử dụng IPFS hoặc Arweave để đảm bảo tính bất biến
- Đảm bảo đường dẫn hình ảnh trong metadata cũng là vĩnh viễn
- Cung cấp đầy đủ thuộc tính để tăng giá trị cho NFT
- Tối ưu kích thước hình ảnh để giảm chi phí lưu trữ 