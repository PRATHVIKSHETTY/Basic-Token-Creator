import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
  tokenId: string;
  tokenName: string;
  tokenSymbol: string;
}

export const TransactionModal = ({
  isOpen,
  onClose,
  txHash,
  tokenId,
  tokenName,
  tokenSymbol,
}: TransactionModalProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const truncate = (str: string, len: number = 20) => {
    if (str.length <= len) return str;
    return `${str.slice(0, len / 2)}...${str.slice(-len / 2)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border/50">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10 border-2 border-primary/20">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Token Created Successfully!</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Your token has been deployed to the Stellar Testnet
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Name</p>
                <p className="text-sm font-semibold text-foreground">{tokenName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Symbol</p>
                <p className="text-sm font-semibold text-foreground">{tokenSymbol}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground">Token ID</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(tokenId, "Token ID")}
                className="h-7"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <code className="block text-xs bg-background/50 p-3 rounded border border-border/50 text-foreground font-mono break-all">
              {tokenId}
            </code>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground">Transaction Hash</p>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(txHash, "Transaction hash")}
                  className="h-7"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  asChild
                  className="h-7"
                >
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
            <code className="block text-xs bg-background/50 p-3 rounded border border-border/50 text-foreground font-mono break-all">
              {txHash}
            </code>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
