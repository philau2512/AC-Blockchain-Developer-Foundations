'use client';

import { useState, useEffect, useCallback } from 'react';
import { MetaMaskProvider, useSDK } from '@metamask/sdk-react';
import { ethers } from 'ethers';
import NFTWhitelistSale from '../abi/NFTWhitelistSale.json';

// Định nghĩa kiểu dữ liệu cho window với thuộc tính ethereum
declare global {
  interface Window {
    ethereum: {
      request: (args: { method: string, params?: unknown[] }) => Promise<unknown>;
    };
  }
}

interface ErrorWithMessage {
  message: string;
}

function MintingApp() {
  const { sdk } = useSDK();
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [nftBalance, setNftBalance] = useState(0);
  const [mintAmount, setMintAmount] = useState(1);
  const [maxMint, setMaxMint] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [totalMinted, setTotalMinted] = useState(0);
  const [mintedPerWallet, setMintedPerWallet] = useState(0);
  const [price, setPrice] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');

  // Địa chỉ contract từ file ABI
  const contractAddress = NFTWhitelistSale.address;

  const loadContractData = useCallback(async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          NFTWhitelistSale.abi,
          signer
        );

        // Lấy thông tin từ contract
        const maxMintPerWallet = await contract.maxPerWallet();
        const nftMaxSupply = await contract.maxSupply();
        const nftTotalMinted = await contract.totalSupply();
        const nftPrice = await contract.getPrice();
        const mintedByUser = await contract.mintedPerWallet(account);
        const isUserWhitelisted = await contract.isWhitelisted(account);
        const balance = await contract.balanceOf(account);

        setMaxMint(Number(maxMintPerWallet));
        setMaxSupply(Number(nftMaxSupply));
        setTotalMinted(Number(nftTotalMinted));
        setPrice(ethers.formatEther(nftPrice));
        setMintedPerWallet(Number(mintedByUser));
        setIsWhitelisted(isUserWhitelisted);
        setNftBalance(Number(balance));

      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu contract:", error);
    }
  }, [account, contractAddress]);

  useEffect(() => {
    // Thiết lập URL khi component mount ở client
    setCurrentUrl(window.location.href);
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    if (isConnected) {
      loadContractData();
    }
  }, [isConnected, account, loadContractData]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Metamask không được cài đặt");
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' }) as string[];
      
      if (accounts.length !== 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      } else {
        console.log("Không tìm thấy tài khoản được kết nối");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!sdk) {
        alert("SDK MetaMask chưa được khởi tạo!");
        return;
      }

      setLoading(true);
      // Sử dụng SDK để kết nối
      const accounts = await sdk.connect();
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    try {
      if (sdk) {
        // Sử dụng SDK để ngắt kết nối
        sdk.terminate();
      }
      // Đặt lại trạng thái
      setIsConnected(false);
      setAccount('');
      setIsWhitelisted(false);
      setNftBalance(0);
      setMintedPerWallet(0);
      setError('');
    } catch (error) {
      console.error("Lỗi khi ngắt kết nối:", error);
    }
  };

  const handleMint = async () => {
    try {
      setLoading(true);
      setError('');

      if (!isWhitelisted) {
        setError("Địa chỉ của bạn không nằm trong whitelist!");
        setLoading(false);
        return;
      }

      if (mintedPerWallet + mintAmount > maxMint) {
        setError(`Bạn chỉ có thể mint tối đa ${maxMint} NFT mỗi ví!`);
        setLoading(false);
        return;
      }

      const { ethereum } = window;
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        NFTWhitelistSale.abi,
        signer
      );

      const mintCost = (Number(price) * mintAmount).toString();
      // Chỉ định rõ signature của hàm mint để tránh nhầm lẫn
      const mintFunction = contract.getFunction("mint(uint256)");
      const mintTransaction = await mintFunction(mintAmount, {
        value: ethers.parseEther(mintCost)
      });

      await mintTransaction.wait();
      
      // Reload contract data
      await loadContractData();
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi mint NFT:", error);
      const errorMessage = error as ErrorWithMessage;
      setError(errorMessage.message || "Đã có lỗi xảy ra khi mint NFT");
      setLoading(false);
    }
  };

  const decreaseAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1);
    }
  };

  const increaseAmount = () => {
    const remainingMints = maxMint - mintedPerWallet;
    if (mintAmount < remainingMints) {
      setMintAmount(mintAmount + 1);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white">
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center py-6">
          <h1 className="text-3xl font-bold">NFT Whitelist Sale</h1>
          {!isConnected ? (
            <button 
              onClick={connectWallet}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? 'Đang kết nối...' : 'Kết nối ví'}
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-purple-900/50 px-4 py-2 rounded-lg">
                <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                <p className="text-sm">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </p>
              </div>
              <button 
                onClick={disconnectWallet}
                className="bg-red-600 hover:bg-red-700 px-3 py-2 text-sm rounded-lg"
              >
                Ngắt kết nối
              </button>
            </div>
          )}
        </header>

        <div className="mt-12 max-w-2xl mx-auto bg-purple-800/30 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">NFT Mint</h2>
          
          {isConnected ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-purple-900/50 p-4 rounded-lg">
                  <p className="text-sm text-purple-300">Số lượng đã mint</p>
                  <p className="text-xl font-bold">{totalMinted} / {maxSupply}</p>
                </div>
                <div className="bg-purple-900/50 p-4 rounded-lg">
                  <p className="text-sm text-purple-300">Số NFT bạn sở hữu</p>
                  <p className="text-xl font-bold">{nftBalance}</p>
                </div>
                <div className="bg-purple-900/50 p-4 rounded-lg">
                  <p className="text-sm text-purple-300">Giá mint</p>
                  <p className="text-xl font-bold">{price} ETH</p>
                </div>
                <div className="bg-purple-900/50 p-4 rounded-lg">
                  <p className="text-sm text-purple-300">Trạng thái Whitelist</p>
                  <p className="text-xl font-bold">{isWhitelisted ? 'Có' : 'Không'}</p>
                </div>
              </div>

              <div className="bg-purple-900/30 p-6 rounded-lg mb-8">
                <p className="mb-4 text-center">Bạn đã mint: {mintedPerWallet}/{maxMint}</p>
                
                <div className="flex items-center justify-center space-x-4">
                  <button 
                    onClick={decreaseAmount}
                    className="bg-purple-700 hover:bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold">{mintAmount}</span>
                  <button 
                    onClick={increaseAmount}
                    className="bg-purple-700 hover:bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                
                <div className="mt-6">
                  <button 
                    onClick={handleMint}
                    disabled={loading || !isWhitelisted || mintedPerWallet >= maxMint}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Đang xử lý...' : `Mint ${mintAmount} NFT (${(Number(price) * mintAmount).toFixed(4)} ETH)`}
                  </button>
                </div>
                
                {error && (
                  <p className="mt-4 text-red-400 text-center">{error}</p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="mb-4">Vui lòng kết nối ví MetaMask để tiếp tục</p>
              <button 
                onClick={connectWallet}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? 'Đang kết nối...' : 'Kết nối ví'}
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center text-sm opacity-50">
          <p>Dự án này chỉ dành cho mục đích học tập</p>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <MetaMaskProvider debug={false} sdkOptions={{
      dappMetadata: {
        name: "NFT Whitelist Sale",
        url: typeof window !== 'undefined' ? window.location.href : 'https://nft-whitelist-sale.example.com'
      }
    }}>
      <MintingApp />
    </MetaMaskProvider>
  );
}
