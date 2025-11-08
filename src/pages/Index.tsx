import { useState, useEffect } from "react";
import { WalletConnect } from "@/components/WalletConnect";
import { CreateTokenForm } from "@/components/CreateTokenForm";
import { TokenInfo } from "@/components/TokenInfo";
import { GlobalStats } from "@/components/GlobalStats";
import { TransactionModal } from "@/components/TransactionModal";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";
import {
  createToken,
  getTokenInfo,
  getTotalTokens,
  TokenData,
  CreateTokenResult,
} from "@/lib/stellar";

const Index = () => {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [totalTokens, setTotalTokens] = useState(0);
  const [transactionResult, setTransactionResult] = useState<CreateTokenResult | null>(null);
  const [lastCreatedToken, setLastCreatedToken] = useState<{
    name: string;
    symbol: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTotalTokens();
  }, []);

  const loadTotalTokens = async () => {
    try {
      const total = await getTotalTokens();
      setTotalTokens(total);
    } catch (error) {
      console.error("Failed to load total tokens:", error);
    }
  };

  const handleConnect = async (address: string) => {
    setConnectedAddress(address);
    toast({
      title: "Wallet Connected",
      description: `Connected to ${address.slice(0, 8)}...${address.slice(-4)}`,
    });
  };

  const handleCreateToken = async (name: string, symbol: string, supply: string) => {
    if (!connectedAddress) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createToken(name, symbol, supply, connectedAddress);
      setTransactionResult(result);
      setLastCreatedToken({ name, symbol });
      setShowModal(true);
      
      // Refresh total tokens
      await loadTotalTokens();
      
      toast({
        title: "Success",
        description: "Token created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create token",
        variant: "destructive",
      });
    }
  };

  const handleGetTokenInfo = async (tokenId: string): Promise<TokenData | null> => {
    try {
      return await getTokenInfo(tokenId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to get token info",
        variant: "destructive",
      });
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Basic Token Creator</h1>
              <p className="text-sm text-muted-foreground">Powered by Stellar Soroban</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Wallet Connection */}
          <WalletConnect onConnect={handleConnect} connectedAddress={connectedAddress} />

          {/* Global Stats */}
          <GlobalStats totalTokens={totalTokens} />

          {/* Create Token Form */}
          <CreateTokenForm
            onCreateToken={handleCreateToken}
            disabled={!connectedAddress}
          />

          {/* Token Info */}
          <TokenInfo onGetTokenInfo={handleGetTokenInfo} disabled={!connectedAddress} />
        </div>
      </main>

      {/* Transaction Success Modal */}
      {transactionResult && lastCreatedToken && (
        <TransactionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          txHash={transactionResult.txHash}
          tokenId={transactionResult.tokenId}
          tokenName={lastCreatedToken.name}
          tokenSymbol={lastCreatedToken.symbol}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Built on Stellar Testnet • Powered by Soroban Smart Contracts
            </p>
            <div className="flex gap-4">
              <a
                href="https://stellar.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Stellar.org
              </a>
              <a
                href="https://stellar.expert/explorer/testnet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Explorer
              </a>
              <a
                href="https://freighter.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Get Freighter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
