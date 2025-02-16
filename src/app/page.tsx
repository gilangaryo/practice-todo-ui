"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { formatUnits, parseEther, parseUnits } from "viem";
import { config } from "../config";
import {
  IDLE_TOKEN_ADDRESS,
  IDLE_TOKEN_ABI,
  FACTORY_EXCHANGE_ADDRESS,
  FACTORY_EXCHANGE_ABI,
} from "@/constants";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import Link from "next/link";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [buyAmount, setBuyAmount] = useState<number>(1);
  const [transferTo, setTransferTo] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<number>(1);
  const [price, setPrice] = useState<string>("0.0001");

  const { data: balance } = useReadContract({
    address: IDLE_TOKEN_ADDRESS,
    abi: IDLE_TOKEN_ABI,
    functionName: "balanceOf",
    args: [address],
    account: address,
  });

  // Beli token IDLE pakai ETH
  async function buyTokens() {
    try {
      const result = await writeContractAsync({
        address: IDLE_TOKEN_ADDRESS,
        abi: IDLE_TOKEN_ABI,
        functionName: "buyTokens",
        args: [buyAmount],
        value: parseEther((buyAmount * 0.000003).toString()), // Harga 0.0003 per token
        account: address,
      });

      await waitForTransactionReceipt(config, { hash: result });
      alert(`Berhasil beli ${buyAmount} IDLE Token!`);
    } catch (error) {
      console.error(error);
      alert("Gagal beli token.");
    }
  }

  // Transfer token IDLE ke orang lain
  async function transferTokens() {
    try {
      const result = await writeContractAsync({
        address: IDLE_TOKEN_ADDRESS,
        abi: IDLE_TOKEN_ABI,
        functionName: "transfer",
        args: [transferTo, parseUnits(transferAmount.toString(), 18)],
        account: address,
      });

      await waitForTransactionReceipt(config, { hash: result });
      alert(`Berhasil transfer ${transferAmount} IDLE Token ke ${transferTo}`);
    } catch (error) {
      console.error(error);
      alert("Gagal transfer token.");
    }
  }

  // Set harga token di FactoryExchange (contoh jika nanti mau dijual)
  async function setTokenPrice() {
    try {
      const result = await writeContractAsync({
        address: FACTORY_EXCHANGE_ADDRESS,
        abi: FACTORY_EXCHANGE_ABI,
        functionName: "setTokenPrice",
        args: [IDLE_TOKEN_ADDRESS, parseEther(price)],
        account: address,
      });

      await waitForTransactionReceipt(config, { hash: result });
      alert(`Berhasil set harga token jadi ${price} ETH per token`);
    } catch (error) {
      console.error(error);
      alert("Gagal set harga token.");
    }
  }

  // Withdraw ETH dari kontrak ke wallet owner
  async function withdrawFunds() {
    try {
      const result = await writeContractAsync({
        address: IDLE_TOKEN_ADDRESS,
        abi: IDLE_TOKEN_ABI,
        functionName: "withdraw",
        account: address,
      });

      await waitForTransactionReceipt(config, { hash: result });
      alert("Berhasil menarik dana dari kontrak.");
    } catch (error) {
      console.error(error);
      alert("Gagal menarik dana.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <div className="w-full flex justify-between items-center bg-gray-800 p-4 rounded-lg mb-6 shadow-lg">
        <h1 className="text-2xl font-bold">IDLE Platform - Buy & Transfer Tokens</h1>
        <Link href="/create-token">
          CREATE TOKEN
        </Link>
        <Link href="/buy-sell">
          buy & sell
        </Link>
        <ConnectWalletButton />
      </div>

      {isConnected && (
        <div className="bg-gray-800 p-4 rounded-lg w-full max-w-3xl mb-4 shadow-lg">
          <p>Connected Wallet: <span className="text-green-400">{address}</span></p>
          <p>IDLE Token Balance: <span className="font-semibold text-yellow-400">{balance ? formatUnits(balance, 18) : "Loading..."}</span></p>
        </div>
      )}

      {/* Beli Token */}
      {isConnected && (
        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl mb-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Buy IDLE Tokens</h2>
          <input
            type="number"
            placeholder="Amount"
            value={buyAmount}
            onChange={(e) => setBuyAmount(Number(e.target.value))}
            className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded"
          />
          <button
            onClick={buyTokens}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white w-full"
          >
            Buy Tokens
          </button>
        </div>
      )}

      {/* Transfer Token */}
      {isConnected && (
        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl mb-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Transfer IDLE Tokens</h2>
          <input
            type="text"
            placeholder="Recipient Address"
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
            className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={transferAmount}
            onChange={(e) => setTransferAmount(Number(e.target.value))}
            className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          />
          <button
            onClick={transferTokens}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white w-full"
          >
            Transfer Tokens
          </button>
        </div>
      )}

      {/* Withdraw Funds */}
      {isConnected && (
        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl mb-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Withdraw ETH from Contract</h2>
          <button
            onClick={withdrawFunds}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white w-full"
          >
            Withdraw
          </button>
        </div>
      )}
    </div>
  );
}
