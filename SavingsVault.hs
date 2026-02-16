{-# INLINABLE mkVaultValidator #-}
mkVaultValidator :: Integer -> () -> ScriptContext -> Bool
mkVaultValidator targetAmount _ ctx =
    traceIfFalse "Target amount not reached" checkTarget
  where
    info :: TxInfo
    info = scriptContextTxInfo ctx

    -- Logic: Allow spending (withdrawal) ONLY if the output going to the user (or anywhere really, but standard is user) 
    -- implies the savings goal was met or we are just validating the accumulation.
    -- Actually, for a savings vault, we want to LOCK until target is reached.
    -- So, input value must be >= targetAmount to allow spending.
    
    -- Calculate total value being spent from this script address in this transaction
    totalValueSpent :: Value
    totalValueSpent = valueSpent info
    
    -- In a real scenario, we'd check specifically the input belonging to this script instance.
    -- For simplicity here: Check if the value contained in the UTxO being consumed is >= targetAmount.
    
    ownInput :: TxInInfo
    ownInput = case findOwnInput ctx of
        Nothing -> traceError "Input missing"
        Just i  -> i

    inputAmount :: Integer
    inputAmount = valueOf (txOutValue $ txInInfoResolved ownInput) adaSymbol adaToken

    checkTarget :: Bool
    checkTarget = inputAmount >= targetAmount

-- Boilerplate for compilation (Plutus V2)
data Vault
instance Scripts.ValidatorTypes Vault where
    type instance DatumType Vault = Integer -- Target Amount
    type instance RedeemerType Vault = ()

typedValidator :: Scripts.TypedValidator Vault
typedValidator = Scripts.mkTypedValidator @Vault
    ($$(PlutusTx.compile [|| mkVaultValidator ||]))
    $$(PlutusTx.compile [|| wrap ||])
  where
    wrap = Scripts.mkUntypedValidator @Integer @()

validator :: Scripts.Validator
validator = Scripts.validatorScript typedValidator

valHash :: Scripts.ValidatorHash
valHash = Scripts.validatorHash typedValidator

scrAddress :: Ledger.Address
scrAddress = scriptAddress validator
