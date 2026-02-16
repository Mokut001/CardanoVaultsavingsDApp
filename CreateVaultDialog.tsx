import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateVault, toLovelace } from "@/hooks/use-vaults";
import { Plus, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  targetAmount: z.coerce.number().min(5, "Minimum target is 5 ADA").max(1000000, "Maximum target is 1M ADA"),
});

interface CreateVaultDialogProps {
  address: string;
}

export function CreateVaultDialog({ address }: CreateVaultDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createVault = useCreateVault();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetAmount: 100,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createVault.mutateAsync({
        userAddress: address,
        targetAmount: Number(toLovelace(values.targetAmount)), // Convert to Lovelace (API expects number representation of BigInt)
      });
      
      toast({
        title: "Vault Created",
        description: `Successfully created a new vault with ${values.targetAmount} ADA target.`,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create vault",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl px-6 bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all duration-200">
          <Plus className="w-5 h-5 mr-2" />
          Create New Vault
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Create Savings Vault</DialogTitle>
          <DialogDescription>
            Set a target amount in ADA. Your funds will be locked in the smart contract until this goal is met.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount (ADA)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Coins className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input 
                        placeholder="100" 
                        type="number" 
                        className="pl-10 h-12 text-lg rounded-xl border-2 focus-visible:ring-primary/20" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-lg font-medium"
              disabled={createVault.isPending}
            >
              {createVault.isPending ? "Creating Vault..." : "Initialize Smart Contract"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
