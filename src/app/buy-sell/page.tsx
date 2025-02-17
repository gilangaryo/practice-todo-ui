"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useChainId } from "wagmi";
import {
  FACTORY_EXCHANGE_ABI,
  IDLE_TOKEN_ADDRESS,
  FACTORY_EXCHANGE_ADDRESS,
  ERC20_ABI,
} from "@/constants";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import Link from "next/link";

export default function BuySellAIToken() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const chainId = useChainId();

  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [idleAmount, setIdleAmount] = useState<string>("");
  const [tokenAmount, setTokenAmount] = useState<string>("");

  // Fungsi untuk membeli token AI dengan IDLE
  async function buyToken() {
    try {
      if (!tokenAddress || !idleAmount) {
        alert("Alamat token AI dan jumlah IDLE harus diisi!");
        return;
      }

      const idleAmountInWei = BigInt(parseFloat(idleAmount) * 1e18);

      // Approve IDLEToken untuk digunakan dalam pembelian token AI
      await writeContractAsync({
        address: IDLE_TOKEN_ADDRESS as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [FACTORY_EXCHANGE_ADDRESS, idleAmountInWei],
        account: address,
      });

      // Beli token AI dengan IDLE
      await writeContractAsync({
        address: FACTORY_EXCHANGE_ADDRESS as `0x${string}`,
        abi: FACTORY_EXCHANGE_ABI,
        functionName: "buyToken",
        args: [tokenAddress, idleAmountInWei],
        account: address,
      });

      alert("Berhasil membeli token AI!");
    } catch (error) {
      console.error("Gagal membeli token AI:", error);
      alert(`Gagal membeli token AI: ${error}`);
    }
  }

  // Fungsi untuk menjual token AI dan mendapatkan IDLE
  async function sellToken() {
    try {
      if (!tokenAddress || !tokenAmount) {
        alert("Alamat token AI dan jumlah Token AI harus diisi!");
        return;
      }

      const tokenAmountInWei = BigInt(parseFloat(tokenAmount) * 1e18);

      // Approve Token AI untuk ditransfer ke FactoryExchange
      await writeContractAsync({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [FACTORY_EXCHANGE_ADDRESS, tokenAmountInWei],
        account: address,
      });

      // Panggil fungsi sellToken di FactoryExchange
      await writeContractAsync({
        address: FACTORY_EXCHANGE_ADDRESS as `0x${string}`,
        abi: FACTORY_EXCHANGE_ABI,
        functionName: "sellToken",
        args: [tokenAddress, tokenAmountInWei],
        account: address,
      });

      alert("Berhasil menjual token AI!");
    } catch (error) {
      console.error("Gagal menjual token AI:", error);
      alert(`Gagal menjual token AI: ${error}`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <div className="w-full flex justify-between items-center bg-gray-800 p-4 rounded-lg mb-6 shadow-lg">
        <h1 className="text-2xl font-bold">Marketplace Token AI</h1>
        <Link href="/create-token">Create Token</Link>
        <Link href="/">HOMEPAGE</Link>
        <ConnectWalletButton />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl shadow-lg">
        <h2 className="text-lg font-semibold mb-3">Beli / Jual Token AI</h2>

        <input
          type="text"
          placeholder="Alamat Token AI"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded"
        />

        <h3 className="text-md font-semibold mt-4 mb-2">Beli Token AI</h3>
        <input
          type="text"
          placeholder="Jumlah IDLE untuk Membeli Token AI"
          value={idleAmount}
          onChange={(e) => setIdleAmount(e.target.value)}
          className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded"
        />
        {isConnected && (
          <button onClick={buyToken} className="bg-green-500 w-full p-2 rounded">
            Beli Token AI
          </button>
        )}

        <h3 className="text-md font-semibold mt-4 mb-2">Jual Token AI</h3>
        <input
          type="text"
          placeholder="Jumlah Token AI untuk Dijual"
          value={tokenAmount}
          onChange={(e) => setTokenAmount(e.target.value)}
          className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded"
        />
        {isConnected && (
          <button onClick={sellToken} className="bg-red-500 w-full p-2 rounded">
            Jual Token AI
          </button>
        )}
      </div>
    </div>
  );
}
