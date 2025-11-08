import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, Loader2, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TokenData {
  name: string;
  symbol: string;
  creator: string;
  totalSupply: string;
  timestamp: string;
}

interface TokenInfoProps {
  onGetTokenInfo: (tokenId: string) => Promise<TokenData | null>;
  disabled: boolean;
}

export const TokenInfo = ({ onGetTokenInfo, disabled }: TokenInfoProps) => {
  const [tokenId, setTokenId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const { toast } = useToast();

  const handleGetInfo = async () => {
    if (!tokenId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a token ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await onGetTokenInfo(tokenId);
      setTokenData(data);
      if (!data) {
        toast({
          title: "Not Found",
          description: "Token ID not found",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
          <Info className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-lg">Retrieve Token Info</h3>
          <p className="text-sm text-muted-foreground">Query token details by ID</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="tokenId" className="text-foreground">Token ID</Label>
            <Input
              id="tokenId"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Enter token ID"
              disabled={disabled || isLoading}
              className="bg-secondary/50 border-border/50 focus:border-primary transition-colors"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleGetInfo}
              disabled={disabled || isLoading}
              className="bg-primary hover:bg-primary/90 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Get Info"
              )}
            </Button>
          </div>
        </div>

        {tokenData && (
          <div className="mt-6 p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-3">
            <h4 className="font-semibold text-foreground mb-4">Token Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Name</p>
                <p className="text-sm font-medium text-foreground">{tokenData.name}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-1">Symbol</p>
                <p className="text-sm font-medium text-foreground">{tokenData.symbol}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Supply</p>
                <p className="text-sm font-medium text-foreground">
                  {Number(tokenData.totalSupply).toLocaleString()}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-1">Created</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(tokenData.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">Creator Address</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-background/50 p-2 rounded border border-border/50 text-foreground font-mono">
                  {truncateAddress(tokenData.creator)}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(tokenData.creator)}
                  className="border-border/50 hover:bg-secondary"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="border-border/50 hover:bg-secondary"
                >
                  <a
                    href={`https://stellar.expert/explorer/testnet/account/${tokenData.creator}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
