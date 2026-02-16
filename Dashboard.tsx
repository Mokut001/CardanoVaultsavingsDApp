import { useState } from "react";
import { WalletConnect } from "@/components/WalletConnect";
import { CreateVaultDialog } from "@/components/CreateVaultDialog";
import { VaultCard } from "@/components/VaultCard";
import { useVaults } from "@/hooks/use-vaults";
import { Button } from "@/components/ui/button";
import { Download, ShieldCheck, Box, Github } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  // Use session storage or simple state for demo wallet persistence simulation
  const [address, setAddress] = useState<string | null>(null);
  
  // Fetch vaults for connected address
  const { data: vaults, isLoading, isError } = useVaults(address);

  // Download Haskell contracts handler
  const handleDownloadContracts = () => {
    // In a real app, this would trigger a download of the .hs files or a zip
    const element = document.createElement("a");
    const file = new Blob([
      `-- Haskell Smart Contract Placeholder
module VaultValidator where

import PlutusTx
import PlutusTx.Prelude
import Ledger
import Ledger.Ada

-- This is a simplified representation of the validator logic
-- Real implementation would be in the provided zip file

data VaultDatum = VaultDatum
    { owner       :: PubKeyHash
    , targetAmount :: Integer
    }
    deriving Show

PlutusTx.unstableMakeIsData ''VaultDatum

data VaultRedeemer = Withdraw | Cancel
    deriving Show

PlutusTx.unstableMakeIsData ''VaultRedeemer

{-# INLINABLE mkValidator #-}
mkValidator :: VaultDatum -> VaultRedeemer -> ScriptContext -> Bool
mkValidator datum redeemer ctx = case redeemer of
    Withdraw -> traceIfFalse "Target not reached" checkTarget &&
                traceIfFalse "Not signed by owner" checkOwner
    Cancel   -> traceIfFalse "Not signed by owner" checkOwner
  where
    info :: TxInfo
    info = scriptContextTxInfo ctx

    checkOwner :: Bool
    checkOwner = txSignedBy info (owner datum)

    checkTarget :: Bool
    checkTarget = 
        let currentVal = valueLockedBy info (ownHash ctx)
        in valueOf currentVal adaSymbol adaToken >= targetAmount datum
`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "VaultValidator.hs";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-white shadow-lg shadow-primary/25">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display leading-none">CardanoVault</h1>
              <p className="text-xs text-muted-foreground font-mono mt-1">SECURE SAVINGS DAPP</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden md:flex text-muted-foreground hover:text-foreground" onClick={handleDownloadContracts}>
              <Download className="w-4 h-4 mr-2" />
              Smart Contracts
            </Button>
            <WalletConnect 
              address={address} 
              onConnect={setAddress} 
              onDisconnect={() => setAddress(null)} 
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {!address ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <Box className="w-32 h-32 text-primary relative z-10" strokeWidth={1} />
            </motion.div>
            
            <div className="max-w-2xl space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-gradient">
                Lock Funds. Hit Targets. <br /> Save Securely on Chain.
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                A decentralized savings vault powered by Plutus smart contracts. 
                Connect your wallet to create a goal-based vault that only unlocks when you reach your target.
              </p>
            </div>

            <div className="flex gap-4">
              <WalletConnect 
                address={address} 
                onConnect={setAddress} 
                onDisconnect={() => setAddress(null)} 
              />
              <Button variant="outline" size="lg" className="rounded-xl border-2" onClick={handleDownloadContracts}>
                <Github className="mr-2 h-5 w-5" />
                View Source
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold font-display">Your Vaults</h2>
                <p className="text-muted-foreground mt-1">Manage your active savings contracts</p>
              </div>
              <CreateVaultDialog address={address} />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 rounded-2xl bg-muted/50 animate-pulse" />
                ))}
              </div>
            ) : isError ? (
              <div className="p-12 text-center rounded-3xl bg-destructive/5 border border-destructive/20">
                <h3 className="text-xl font-bold text-destructive mb-2">Failed to load vaults</h3>
                <p className="text-muted-foreground">Please check your connection and try again.</p>
              </div>
            ) : vaults && vaults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vaults.map((vault) => (
                  <VaultCard key={vault.id} vault={vault} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-muted bg-muted/5">
                <Box className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No active vaults</h3>
                <p className="text-muted-foreground mb-6 max-w-sm text-center">
                  You haven't created any savings vaults yet. Start saving by creating your first goal.
                </p>
                <CreateVaultDialog address={address} />
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-border/40 py-8 mt-12 bg-muted/10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Cardano Savings Vault. Built on Cardano.</p>
        </div>
      </footer>
    </div>
  );
}
