import { useState, useEffect } from 'react';
import { createPublicClient, http, decodeEventLog, type Address } from 'viem';
import { baseSepolia } from 'viem/chains';
import { getOnchainCoinDetails } from '@zoralabs/coins-sdk';

// Infer the type for the pricing result from the SDK
type OnchainCoinDetails = ReturnType<typeof getOnchainCoinDetails> extends Promise<infer R> ? R : never;
type PricingResult = OnchainCoinDetails['marketCap'];

// Zora Factory Contract Details for Base Sepolia
const ZORA_FACTORY_ADDRESS = '0x777777751622c0d3258f214F9DF38E35BF45baF3';
const ZORA_FACTORY_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "caller", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "payoutRecipient", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "platformReferrer", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "currency", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "uri", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "symbol", "type": "string" },
      { "indexed": false, "internalType": "address", "name": "coin", "type": "address" },
      { "indexed": false, "internalType": "tuple", "name": "poolKey", "type": "tuple", "components": [
        { "internalType": "address", "name": "currency0", "type": "address" },
        { "internalType": "address", "name": "currency1", "type": "address" },
        { "internalType": "uint24", "name": "fee", "type": "uint24" },
        { "internalType": "int24", "name": "tickSpacing", "type": "int24" },
        { "internalType": "contract IHooks", "name": "hooks", "type": "address" }
      ]},
      { "indexed": false, "internalType": "bytes32", "name": "poolKeyHash", "type": "bytes32" },
      { "indexed": false, "internalType": "string", "name": "version", "type": "string" }
    ],
    "name": "CoinCreatedV4",
    "type": "event"
  }
] as const;

const erc20Abi = [
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Manually define the type for a single meme coin
export interface MemeCoin {
  address: Address;
  decimals: number;
  name: string;
  symbol: string;
  totalSupply: bigint;
  pool: Address;
  liquidity: PricingResult;
  marketCap: PricingResult;
  owners: readonly Address[];
  payoutRecipient: Address;
  creatorAddress?: Address;
  balance?: bigint;
  image?: string;
  description?: string;
}

// Function to resolve IPFS URIs to a gateway URL
const resolveIpfsUrl = (ipfsUri: string) => {
  if (!ipfsUri) return '';
  // Convert ipfs:// URI to a Pinata gateway URL
  return ipfsUri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
};

export const useMemeCoins = ({ minterAddress }: { minterAddress?: Address }) => {
  console.log("useMemeCoins hook is running");
  console.log("minterAddress in useMemeCoins:", minterAddress);
  const [memeCoins, setMemeCoins] = useState<MemeCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemeCoins = async () => {
      setLoading(true);
      setError(null);
      console.log("useMemeCoins Hook: Starting ON-CHAIN fetch...");

      try {
        const publicClient = createPublicClient({
          chain: baseSepolia,
          transport: http(`https://base-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_ID}`),
        });

        // Fetch logs in batches of 500 blocks
        const latestBlock = await publicClient.getBlockNumber();
        console.log("Latest block number:", latestBlock.toString());
        
        // Increase the block range to look back further
        const startBlock = latestBlock > 100000n ? latestBlock - 100000n : 0n;
        console.log("Start block:", startBlock.toString());
        console.log("Looking for events from factory address:", ZORA_FACTORY_ADDRESS);
        
        let allLogs: unknown[] = [];
        const batchSize = 500n;
        
        for (let from = startBlock; from <= latestBlock; from += batchSize) {
          const to = (from + batchSize - 1n > latestBlock) ? latestBlock : from + batchSize - 1n;
          console.log(`Fetching logs from block ${from} to ${to}`);
          try {
            const batchLogs = await publicClient.getLogs({
              address: ZORA_FACTORY_ADDRESS,
              event: ZORA_FACTORY_ABI[0],
              fromBlock: from,
              toBlock: to,
            });
            console.log(`Found ${batchLogs.length} logs in this batch`);
            if (batchLogs.length > 0) {
              console.log("Sample log:", batchLogs[0]);
            }
            allLogs = allLogs.concat(batchLogs);
          } catch (error) {
            console.error(`Error fetching logs for block range ${from}-${to}:`, error);
          }
        }
        console.log(`useMemeCoins Hook: Found ${allLogs.length} CoinCreatedV4 event logs.`);

        // Decode all logs
        const decoded = allLogs.map(log => {
          const typedLog = log as { data: string; topics: string[] };
          const decodedLog = decodeEventLog({
            abi: ZORA_FACTORY_ABI,
            data: typedLog.data as `0x${string}`,
            topics: typedLog.topics as [] | [signature: `0x${string}`, ...args: `0x${string}`[]],
          });
          return { ...decodedLog.args } as { coin: `0x${string}`; payoutRecipient: Address; uri: string; name: string; symbol: string };
        });
        console.log("Decoded logs:", decoded);
        console.log("Looking for minterAddress:", minterAddress);
        if (minterAddress) {
          console.log("Checking for coins with payoutRecipient matching:", minterAddress.toLowerCase());
        }

        // Prioritize user's coins
        let userCoins: typeof decoded = [];
        let otherCoins: typeof decoded = [];
        if (minterAddress) {
          userCoins = decoded.filter(c => c.payoutRecipient.toLowerCase() === minterAddress.toLowerCase());
          otherCoins = decoded.filter(c => c.payoutRecipient.toLowerCase() !== minterAddress.toLowerCase());
        } else {
          otherCoins = decoded;
        }
        console.log("User coins:", userCoins);
        console.log("Other coins:", otherCoins);

        // Combine and limit to 12 (newest first)
        const prioritized = [...userCoins, ...otherCoins].slice(-12).reverse();
        console.log("Prioritized coins (to be shown):", prioritized);

        const allCoins: MemeCoin[] = [];
        for (const args of prioritized) {
          console.log("Processing coin:", args);
          try {
            let onchainData: Pick<MemeCoin, 'marketCap' | 'liquidity' | 'pool' | 'owners' | 'payoutRecipient' | 'creatorAddress'>;
            try {
              // Fetch on-chain details
              const fetchedOnchainData = await getOnchainCoinDetails({
                coin: args.coin,
                publicClient,
              });
              onchainData = fetchedOnchainData;
            } catch (pricingError) {
              console.warn(`Could not fetch on-chain details for coin ${args.coin}, using default values. Error:`, pricingError);
              onchainData = {
                marketCap: { usdc: 0n, eth: 0n, usdcDecimal: 0, ethDecimal: 0 },
                liquidity: { usdc: 0n, eth: 0n, usdcDecimal: 0, ethDecimal: 0 },
                pool: '0x0000000000000000000000000000000000000000',
                owners: [],
                payoutRecipient: args.payoutRecipient,
                creatorAddress: args.payoutRecipient,
              };
            }

            const [decimals, totalSupply] = await Promise.all([
              publicClient.readContract({ address: args.coin, abi: erc20Abi, functionName: 'decimals' }),
              publicClient.readContract({ address: args.coin, abi: erc20Abi, functionName: 'totalSupply' }),
            ]);

            // Fetch metadata from IPFS
            const metadataUrl = resolveIpfsUrl(args.uri);
            let name = args.name,
              image = '',
              description = '';
            if (metadataUrl) {
              try {
                const metaRes = await fetch(metadataUrl);
                if (metaRes.ok) {
                  const fetchedMeta = await metaRes.json();
                  name = fetchedMeta.name || args.name;
                  image = resolveIpfsUrl(fetchedMeta.image);
                  description = fetchedMeta.description;
                }
              } catch (metaError) {
                console.error("Failed to fetch metadata for coin:", args.coin, metaError);
              }
            }

            allCoins.push({
              ...onchainData,
              address: args.coin,
              name,
              symbol: args.symbol,
              image,
              description,
              decimals,
              totalSupply,
            });
          } catch (coinError) {
            console.error("Failed to process coin:", args.coin, coinError);
            // Continue processing other coins even if this one fails
            continue;
          }
        }
        
        console.log('Final meme coins array:', allCoins);
        setMemeCoins(allCoins); // Already newest first

      } catch (err) {
        console.error('useMemeCoins Hook: CATCH BLOCK - An error occurred:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
        console.log("useMemeCoins Hook: Fetch finished.");
      }
    };

    fetchMemeCoins();
  }, [minterAddress]);

  return { memeCoins, loading, error };
}; 