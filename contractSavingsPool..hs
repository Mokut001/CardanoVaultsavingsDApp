{-# LANGUAGE DataKinds #-}
{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}
{-# LANGUAGE TypeFamilies #-}

module SavingsPool where

import Plutus.V2.Ledger.Api
import Plutus.V2.Ledger.Contexts
import PlutusTx
import PlutusTx.Prelude hiding (Semigroup(..))
import Prelude (Semigroup(..))

ownerPkh :: PubKeyHash
ownerPkh = "61c2c5d8c94c7d5a8f8f5a1d4e3c2b1a0f9e8d7c6"

data PoolAction = Deposit | Withdraw
PlutusTx.unstableMakeIsData ''PoolAction

{-# INLINABLE mkValidator #-}
mkValidator :: BuiltinData -> BuiltinData -> BuiltinData -> ()
mkValidator _ redeemer ctxRaw =
    let
        ctx = unsafeFromBuiltinData ctxRaw
        txinfo = scriptContextTxInfo ctx
        action = unsafeFromBuiltinData redeemer :: PoolAction
    in
        case action of
            Deposit -> ()
            Withdraw ->
                if txSignedBy txinfo ownerPkh
                    then ()
                    else error ()contract/SavingsPool.hs