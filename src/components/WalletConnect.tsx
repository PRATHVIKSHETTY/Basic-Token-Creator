import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import * as freighter from "@stellar/freighter-api";

interface WalletConnectProps {
  onConnect: (address: string) => void;
  connectedAddress: string | null;
  expectedNetwork?: "TESTNET" | "PUBLIC"; // optional
}

export const WalletConnect = ({
  onConnect,
  connectedAddress,
  expectedNetwork = "TESTNET",
}: WalletConnectProps) => {
  const [isChecking, setIsChecking] = useState(false);

  const handleConnect = async () => {
    setIsChecking(true);

    try {
      // 1️⃣ Check if Freighter is installed
      const conn = await freighter.isConnected();
      if (!conn.isConnected) {
        alert("Freighter not installed. Install: https://freighter.app/");
        window.open("https://freighter.app/", "_blank");
        return;
      }

      // 2️⃣ Request access and get public key
      const access = await freighter.requestAccess();
      if (access.error) {
        throw new Error(access.error);
      }
      const publicKey = access.address;
      if (!publicKey) {
        alert(
          "Could not get wallet address. Make sure wallet is unlocked and approve the request."
        );
        return;
      }

      // 3️⃣ Optional: check network
      if (expectedNetwork) {
        const netObj = await freighter.getNetwork();
        if (netObj.error) {
          console.warn("Could not get network:", netObj.error);
        } else if (netObj.network !== expectedNetwork) {
          alert(
            `Wrong network selected in Freighter. Expected: ${expectedNetwork}, but got: ${netObj.network}.`
          );
          return;
        }
      }

      // 4️⃣ Success
      console.log("Connected account:", publicKey);
      onConnect(publicKey);

    } catch (err: any) {
      console.error("Wallet connection error:", err);

      if (err.message?.includes("User rejected")) {
        alert("Access denied by user in Freighter.");
      } else {
        alert(
          `Wallet connection failed: ${err.message || JSON.stringify(
            err
          )}. Make sure Freighter is installed, unlocked, and approve the connect request.`
        );
      }
    } finally {
      setIsChecking(false);
    }
  };

  const shorten = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Freighter Wallet</h3>
            <p className="text-sm text-muted-foreground">
              {connectedAddress ? shorten(connectedAddress) : "Not connected"}
            </p>
          </div>
        </div>

        {!connectedAddress ? (
          <Button onClick={handleConnect} disabled={isChecking}>
            {isChecking ? "Connecting..." : "Connect Wallet"}
          </Button>
        ) : (
          <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            Connected
          </div>
        )}
      </div>
    </Card>
  );
};
