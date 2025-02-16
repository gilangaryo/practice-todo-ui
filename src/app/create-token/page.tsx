"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { FACTORY_EXCHANGE_ADDRESS, FACTORY_EXCHANGE_ABI, ERC20_ABI } from "@/constants";
import { waitForTransactionReceipt } from "@wagmi/core";
import { parseUnits } from "viem";
import { config } from "../../config/index";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import Link from "next/link";

export default function CreateTokenPage() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState<number>(1000);

 const handleCreateToken = async () => {
  try {
    const result = await writeContractAsync({
    address: FACTORY_EXCHANGE_ADDRESS,
    abi: FACTORY_EXCHANGE_ABI,
    functionName: "createToken",
    args: [tokenName, tokenSymbol, 1000000000],
    account: address,
  });

  const receipt = await waitForTransactionReceipt(config, {
    hash: result,
  });

  const tokenAddress = receipt.logs[0].address; // INI alamat token yang benar
  console.log("Token berhasil dibuat di: ", tokenAddress);


    // Auto-Approve setelah token berhasil dibuat
    // await writeContractAsync({
    //   address: tokenAddress as `0x${string}`,
    //   abi: ERC20_ABI, // ABI standar ERC20
    //   functionName: "approve",
    //   args: [FACTORY_EXCHANGE_ADDRESS, parseUnits(initialSupply.toString(), 18)],
    //   account: address,
    // });

    // alert(`Token ${tokenName} sudah di-approve untuk diperjualbelikan!`);

    // Reset input
    setTokenName("");
    setTokenSymbol("");
    setInitialSupply(1000);
  } catch (error) {
    console.error("Gagal membuat token:", error);
    alert("Gagal membuat token");
  }
};

  if (!isConnected) {
    return <p className="text-center text-red-500">Harap sambungkan wallet terlebih dahulu.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <div className="w-full flex justify-between items-center bg-gray-800 p-4 rounded-lg mb-6 shadow-lg">
        <h1 className="text-2xl font-bold">Buat Token Baru dari Factory</h1>
        <Link href="/create-token">
          Create Token
        </Link>
        <Link href="/">
          HOMEPAGE
        </Link>
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
          placeholder="Pasokan Awal"
          value={initialSupply}
          onChange={(e) => setInitialSupply(Number(e.target.value))}
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
