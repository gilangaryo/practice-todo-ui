"use client";

import { useAccount } from 'wagmi';

export default function ConnectButton() {
  const { isConnected } = useAccount();
  
  return (
    <w3m-button 
      balance="show"
      label={isConnected ? undefined : "Connect Your Wallet"}
    />
  );
}