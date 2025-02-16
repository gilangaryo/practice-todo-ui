import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage } from 'wagmi';
import { mantaSepoliaTestnet } from 'wagmi/chains';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
  name: 'SC Connect TodoList UI',
  description: 'UI for connecting to SC Connect',
  url: 'https://sc-connect-todolist-ui.netlify.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [mantaSepoliaTestnet] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
});