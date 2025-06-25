import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { type ReactNode } from "react";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [baseSepolia],
    transports: {
      // RPC URL for Base Sepolia
      [baseSepolia.id]: http(
        `https://base-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_ID}`,
      ),
    },

    // Required API Keys
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? "",

    // Required App Info
    appName: "memecoiner",

    // Optional App Info
    appDescription: "Create and mint meme coins",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            "--ck-connectbutton-background": "linear-gradient(135deg, rgba(176, 38, 255, 0.1), rgba(0, 245, 255, 0.1))",
            "--ck-connectbutton-border-color": "#b026ff",
            "--ck-connectbutton-border-radius": "50px",
            "--ck-connectbutton-color": "#ffffff",
            "--ck-font-family": "'Orbitron', monospace",
            "--ck-font-weight": "600",
            "--ck-connectbutton-box-shadow": "0 0 20px rgba(176, 38, 255, 0.3), inset 0 0 20px rgba(176, 38, 255, 0.1)",
            "--ck-connectbutton-hover-border-color": "#00f5ff",
            "--ck-connectbutton-hover-box-shadow": "0 0 30px rgba(176, 38, 255, 0.5), 0 0 50px rgba(0, 245, 255, 0.3), inset 0 0 30px rgba(176, 38, 255, 0.2)",
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};