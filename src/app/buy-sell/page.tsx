"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useChainId } from "wagmi";
import { BONDING_CURVE_TOKEN_ABI, ERC20_ABI, IDLE_TOKEN_ADDRESS } from "@/constants";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import Link from "next/link";

export default function BuyAIToken() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const chainId = useChainId();

  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [idleAmount, setIdleAmount] = useState<string>(""); // Input jumlah IDLE yang digunakan untuk membeli token AI

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
        args: [tokenAddress, idleAmountInWei],
        account: address,
      });

      // Beli token AI dengan IDLE
      await writeContractAsync({
        address: tokenAddress as `0x${string}`,
        abi: BONDING_CURVE_TOKEN_ABI,
        functionName: "buyTokens",
        args: [idleAmountInWei],
        account: address,
      });

      alert("Berhasil membeli token AI!");
    } catch (error) {
      console.error("Gagal membeli token AI:", error);
      alert(`Gagal membeli token AI: ${error}`);
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
        <h2 className="text-lg font-semibold mb-3">Beli Token AI</h2>
        <input
          type="text"
          placeholder="Alamat Token AI"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded"
        />
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
      </div>
    </div>
  );
}
