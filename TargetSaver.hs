
{-# LANGUAGE DataKinds #-}
{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE TemplateHaskell #-}

module TargetSaver where

import Plutus.V2.Ledger.Api
import PlutusTx.Prelude
import PlutusTx

-- The Target of the user
data SavingsParams = SavingsParams
    { ownerPkh    :: PubKeyHash
    , goalAmount  :: Integer -- Lovelace
    }
PlutusTx.unstableMakeIsData ''SavingsParams

{-# INLINABLE mkValidator #-}
mkValidator :: SavingsParams -> () -> ScriptContext -> Bool
mkValidator params _ ctx =
    let info = scriptContextTxInfo ctx
        -- Withdrawal logic:
        -- 1. Check if the value in the script UTXO is >= goalAmount
        -- (Simplified for example: usually checks Value in continuing output or previous balance)
        signedByOwner = ownerPkh params `elem` txInfoSignatories info
        balanceMet = True -- In production, you'd calculate current script balance
    in traceIfFalse "Not Owner" signedByOwner && traceIfFalse "Goal not reached" balanceMet

validator :: Validator
validator = mkValidatorScript $$(PlutusTx.compile [|| mkValidator ||])
