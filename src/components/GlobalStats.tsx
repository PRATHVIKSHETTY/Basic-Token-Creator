import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface GlobalStatsProps {
  totalTokens: number;
}

export const GlobalStats = ({ totalTokens }: GlobalStatsProps) => {
  return (
    <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
            <TrendingUp className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Tokens Created</p>
            <p className="text-3xl font-bold text-foreground mt-1">{totalTokens}</p>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs text-muted-foreground">Network</p>
          <p className="text-sm font-medium text-primary mt-1">Stellar Testnet</p>
        </div>
      </div>
    </Card>
  );
};
