import { useState } from "react";
import { type Vault } from "@shared/schema";
import { fromLovelace, useUpdateVault, toLovelace } from "@/hooks/use-vaults";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Lock, Unlock, TrendingUp, Download, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VaultCardProps {
  vault: Vault;
}

export function VaultCard({ vault }: VaultCardProps) {
  const currentADA = fromLovelace(vault.currentAmount);
  const targetADA = fromLovelace(vault.targetAmount);
  const progress = Math.min((currentADA / targetADA) * 100, 100);
  const isCompleted = currentADA >= targetADA;
  
  const updateVault = useUpdateVault();
  const { toast } = useToast();
  
  const [depositAmount, setDepositAmount] = useState("");
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    try {
      // Calculate new total
      const newTotalLovelace = BigInt(vault.currentAmount) + toLovelace(amount);
      const newTotalADA = fromLovelace(newTotalLovelace);
      
      // Check if this deposit unlocks the vault
      const willUnlock = newTotalADA >= targetADA;

      await updateVault.mutateAsync({
        id: vault.id,
        currentAmount: Number(newTotalLovelace),
        isLocked: !willUnlock, // Unlock if target reached
      });

      toast({
        title: "Deposit Successful",
        description: `Added ${amount} ADA to vault #${vault.id}`,
      });
      
      if (willUnlock && vault.isLocked) {
        toast({
          title: "🎯 Target Reached!",
          description: "Congratulations! Your vault is now unlocked and ready for withdrawal.",
          duration: 5000,
          className: "bg-green-500 text-white border-none",
        });
      }

      setIsDepositOpen(false);
      setDepositAmount("");
    } catch (error) {
      toast({
        title: "Deposit Failed",
        variant: "destructive",
      });
    }
  };

  const handleWithdraw = async () => {
    try {
      await updateVault.mutateAsync({
        id: vault.id,
        currentAmount: 0,
        isLocked: true, // Reset lock state for next round if we were to reuse, or typically archive. For demo, just emptying.
      });

      toast({
        title: "Withdrawal Successful",
        description: `Withdrew ${currentADA} ADA to your wallet.`,
      });
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl dark:bg-card/40 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={vault.isLocked ? "secondary" : "default"} 
                  className={`font-mono text-xs uppercase tracking-wider ${!vault.isLocked ? 'bg-green-500 hover:bg-green-600' : ''}`}
                >
                  {vault.isLocked ? (
                    <><Lock className="w-3 h-3 mr-1" /> Locked</>
                  ) : (
                    <><Unlock className="w-3 h-3 mr-1" /> Unlocked</>
                  )}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">#{vault.id}</span>
              </div>
              <h3 className="text-2xl font-bold font-display tracking-tight text-foreground">
                {targetADA.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">ADA Goal</span>
              </h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" indicatorClassName={isCompleted ? "bg-green-500" : ""} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{currentADA.toLocaleString()} ADA</span>
              <span>{targetADA.toLocaleString()} ADA</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2 gap-3 grid grid-cols-2">
          {/* Deposit Dialog */}
          <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full border-primary/20 hover:bg-primary/5 hover:text-primary"
                disabled={!vault.isLocked}
              >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Deposit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Deposit to Vault #{vault.id}</DialogTitle>
                <DialogDescription>
                  Add funds to reach your goal of {targetADA} ADA.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (ADA)</label>
                  <Input 
                    type="number" 
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="e.g. 50"
                  />
                </div>
                <Button onClick={handleDeposit} className="w-full" disabled={updateVault.isPending}>
                  Confirm Transaction
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            className={`${!vault.isLocked ? 'bg-green-600 hover:bg-green-700' : ''}`}
            variant={vault.isLocked ? "secondary" : "default"}
            disabled={vault.isLocked || updateVault.isPending}
            onClick={handleWithdraw}
          >
            <ArrowDownLeft className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
