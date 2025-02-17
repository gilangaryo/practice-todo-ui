"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { FACTORY_EXCHANGE_ADDRESS, FACTORY_EXCHANGE_ABI, ERC20_ABI, IDLE_TOKEN_ADDRESS } from "@/constants";
import { waitForTransactionReceipt, getPublicClient, getBalance } from "@wagmi/core";
import { parseUnits, formatUnits } from "viem";
import { config } from "../../config";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import Link from "next/link";

export default function CreateTokenPage() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [reserveIdleAmount, setReserveIdleAmount] = useState<number>(10); // Reserve awal IDLE

  const handleCreateToken = async () => {
    try {
      if (!tokenName || !tokenSymbol || reserveIdleAmount <= 0) {
        alert("Nama token, simbol, dan reserve IDLE harus diisi!");
        return;
      }

      const publicClient = getPublicClient(config);
      const idleAmount = parseUnits(reserveIdleAmount.toString(), 18);

      // 1. Cek Saldo
      const balance = await getBalance(config, { address });
      console.log(`Saldo ETH: ${balance.formatted} ${balance.symbol}`);

      // 2. Approve IDLE dulu
      const approveHash = await writeContractAsync({
        address: IDLE_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [FACTORY_EXCHANGE_ADDRESS, idleAmount / BigInt(10**18)],
        account: address,
      });

      await waitForTransactionReceipt(config, { hash: approveHash });
      console.log("Approve berhasil");

      //3. allowance
      // const allowance = await publicClient.readContract({
      //   address: IDLE_TOKEN_ADDRESS,
      //   abi: FACTORY_EXCHANGE_ABI,
      //   functionName: "allowance",
      //   args: [address, FACTORY_EXCHANGE_ADDRESS],
      // });
      // console.log(`Allowance: ${allowance}`);

      // 3. Estimasi Gas
      // const estimatedGas = await publicClient.estimateContractGas({
      //   address: FACTORY_EXCHANGE_ADDRESS,
      //   abi: FACTORY_EXCHANGE_ABI,
      //   functionName: "createToken",
      //   args: [tokenName, tokenSymbol, idleAmount],
      //   account: address,
      // });

      // console.log(`Estimated gas: ${estimatedGas}`);

      // 4. Create token
      const createHash = await writeContractAsync({
        address: FACTORY_EXCHANGE_ADDRESS,
        abi: FACTORY_EXCHANGE_ABI,
        functionName: "createToken",
        args: [tokenName, tokenSymbol, idleAmount / BigInt(10**18)],
        account: address,
        gas: parseUnits("1000000", 0),
        // gas: estimatedGas * BigInt(2), // Buffer
      });

      const receipt = await waitForTransactionReceipt(config, { hash: createHash });

      const tokenAddress = receipt.logs[0].address;
      alert(`Token berhasil dibuat di: ${tokenAddress}`);

      setTokenName("");
      setTokenSymbol("");
      setReserveIdleAmount(10);
    } catch (error) {
      console.error("Gagal membuat token:", error);
      alert(`Gagal membuat token: ${error}`);
    }
  };

  if (!isConnected) {
    return <p className="text-center text-red-500">Harap sambungkan wallet terlebih dahulu.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <div className="w-full flex justify-between items-center bg-gray-800 p-4 rounded-lg mb-6 shadow-lg">
        <h1 className="text-2xl font-bold">Buat Token Baru dari Factory</h1>
        <Link href="/">HOMEPAGE</Link>
        <ConnectWalletButton />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl mb-4 shadow-lg">
        <input
          type="text"
          placeholder="Nama Token"
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
          className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded"
        />
        <input
          type="text"
          placeholder="Simbol Token"
          value={tokenSymbol}
          onChange={(e) => setTokenSymbol(e.target.value)}
          className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded"
        />
        <input
          type="number"
          placeholder="Reserve Awal IDLE (contoh: 10)"
          value={reserveIdleAmount}
          onChange={(e) => setReserveIdleAmount(Number(e.target.value))}
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <button
          onClick={handleCreateToken}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white w-full"
        >
          Buat Token
        </button>
      </div>
    </div>
  );
}
