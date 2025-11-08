import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateTokenFormProps {
  onCreateToken: (name: string, symbol: string, supply: string) => Promise<void>;
  disabled: boolean;
}

export const CreateTokenForm = ({ onCreateToken, disabled }: CreateTokenFormProps) => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !symbol || !supply) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(Number(supply)) || Number(supply) <= 0) {
      toast({
        title: "Error",
        description: "Supply must be a positive number",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      await onCreateToken(name, symbol, supply);
      setName("");
      setSymbol("");
      setSupply("");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
          <Coins className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-lg">Create Token</h3>
          <p className="text-sm text-muted-foreground">Deploy a new token on Stellar</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground">Token Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., My Token"
            disabled={disabled || isCreating}
            className="bg-secondary/50 border-border/50 focus:border-primary transition-colors"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="symbol" className="text-foreground">Token Symbol</Label>
          <Input
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="e.g., MTK"
            disabled={disabled || isCreating}
            className="bg-secondary/50 border-border/50 focus:border-primary transition-colors"
            maxLength={10}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supply" className="text-foreground">Total Supply</Label>
          <Input
            id="supply"
            type="number"
            value={supply}
            onChange={(e) => setSupply(e.target.value)}
            placeholder="e.g., 1000000"
            disabled={disabled || isCreating}
            className="bg-secondary/50 border-border/50 focus:border-primary transition-colors"
            min="1"
          />
        </div>

        <Button
          type="submit"
          disabled={disabled || isCreating}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Token...
            </>
          ) : (
            "Create Token"
          )}
        </Button>
      </form>
    </Card>
  );
};
