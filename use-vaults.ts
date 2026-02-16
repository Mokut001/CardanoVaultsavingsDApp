import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateVaultRequest, type UpdateVaultRequest } from "@shared/routes";
import { vaults } from "@shared/schema";

// Helper to convert ADA to Lovelace (1 ADA = 1,000,000 Lovelace)
export const toLovelace = (ada: number) => BigInt(Math.floor(ada * 1_000_000));
export const fromLovelace = (lovelace: bigint | number) => Number(lovelace) / 1_000_000;

export function useVaults(address: string | null) {
  return useQuery({
    queryKey: [api.vaults.getByAddress.path, address],
    queryFn: async () => {
      if (!address) return [];
      const url = buildUrl(api.vaults.getByAddress.path, { address });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch vaults");
      return api.vaults.getByAddress.responses[200].parse(await res.json());
    },
    enabled: !!address,
  });
}

export function useCreateVault() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateVaultRequest) => {
      // Ensure bigints are serialized properly for the API (if JSON fails with bigint, we handle number conversion)
      // The schema expects numbers for BigInt fields due to JSON limitations, but let's be safe.
      const res = await fetch(api.vaults.create.path, {
        method: api.vaults.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
           const error = api.vaults.create.responses[400].parse(await res.json());
           throw new Error(error.message);
        }
        throw new Error("Failed to create vault");
      }
      return api.vaults.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.vaults.getByAddress.path, variables.userAddress] });
    },
  });
}

export function useUpdateVault() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<{ currentAmount: number, isLocked: boolean }>) => {
      const url = buildUrl(api.vaults.update.path, { id });
      const res = await fetch(url, {
        method: api.vaults.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      if (!res.ok) {
         if (res.status === 404) throw new Error("Vault not found");
         throw new Error("Failed to update vault");
      }
      return api.vaults.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      // Invalidate the list query using the userAddress from the returned vault data
      queryClient.invalidateQueries({ queryKey: [api.vaults.getByAddress.path, data.userAddress] });
    },
  });
}
