let lucid;

const BLOCKFROST_KEY = "preprodYjRkHfcazNkL0xxG9C2RdUbUoTrG7wip";
const OWNER_PKH = "61c2c5d8c94c7d5a8f8f5a1d4e3c2b1a0f9e8d7c6";

const SCRIPT_CBOR = `59011c590119010000323232323232323232332225333300332253330066e1cd55cea400a2000480808c0048c94ccc02a99804d5d901000081`;

const SCRIPT_ADDR = "addr_test1wpz8zd2kfjjyfj29l2fw0wljrp0l9haxk0dzlukynagkr4sw0lvs9";

document.getElementById("connect").onclick = async function () {
    lucid = await Lucid.new(
        new Lucid.Blockfrost(
            "https://cardano-preprod.blockfrost.io/api/v0",
            BLOCKFROST_KEY
        ),
        "Preprod"
    );

    const api = await window.cardano.eternl.enable();
    lucid.selectWallet(api);

    alert("Wallet connected!");
};

async function deposit() {
    const ada = document.getElementById("amount").value;
    if (!ada) return alert("Enter an amount");

    const lovelace = BigInt(ada) * 1_000_000n;

    const tx = await lucid
        .newTx()
        .payToAddress(SCRIPT_ADDR, { lovelace })
        .complete();

    const signed = await tx.sign().complete();
    const txHash = await signed.submit();

    alert("Deposit successful: " + txHash);
}

async function withdraw() {
    const utxos = await lucid.utxosAt(SCRIPT_ADDR);

    const redeemer = Data.to(1); // Withdraw

    const tx = await lucid
        .newTx()
        .collectFrom(utxos, redeemer)
        .attachScript(SCRIPT_CBOR)
        .complete();

    const signed = await tx.sign().complete();
    const txHash = await signed.submit();

    alert("Withdraw submitted: " + txHash);
}let lucid;

const BLOCKFROST_KEY = "preprodYjRkHfcazNkL0xxG9C2RdUbUoTrG7wip";
const OWNER_PKH = "61c2c5d8c94c7d5a8f8f5a1d4e3c2b1a0f9e8d7c6";

const SCRIPT_CBOR = `59011c590119010000323232323232323232332225333300332253330066e1cd55cea400a2000480808c0048c94ccc02a99804d5d901000081`;

const SCRIPT_ADDR = "addr_test1wpz8zd2kfjjyfj29l2fw0wljrp0l9haxk0dzlukynagkr4sw0lvs9";

document.getElementById("connect").onclick = async function () {
    lucid = await Lucid.new(
        new Lucid.Blockfrost(
            "https://cardano-preprod.blockfrost.io/api/v0",
            BLOCKFROST_KEY
        ),
        "Preprod"
    );

    const api = await window.cardano.eternl.enable();
    lucid.selectWallet(api);

    alert("Wallet connected!");
};

async function deposit() {
    const ada = document.getElementById("amount").value;
    if (!ada) return alert("Enter an amount");

    const lovelace = BigInt(ada) * 1_000_000n;

    const tx = await lucid
        .newTx()
        .payToAddress(SCRIPT_ADDR, { lovelace })
        .complete();

    const signed = await tx.sign().complete();
    const txHash = await signed.submit();

    alert("Deposit successful: " + txHash);
}

async function withdraw() {
    const utxos = await lucid.utxosAt(SCRIPT_ADDR);

    const redeemer = Data.to(1); // Withdraw

    const tx = await lucid
        .newTx()
        .collectFrom(utxos, redeemer)
        .attachScript(SCRIPT_CBOR)
        .complete();

    const signed = await tx.sign().complete();
    const txHash = await signed.submit();

    alert("Withdraw submitted: " + txHash);
}let lucid;

const BLOCKFROST_KEY = "preprodYjRkHfcazNkL0xxG9C2RdUbUoTrG7wip";
const OWNER_PKH = "61c2c5d8c94c7d5a8f8f5a1d4e3c2b1a0f9e8d7c6";

const SCRIPT_CBOR = `59011c590119010000323232323232323232332225333300332253330066e1cd55cea400a2000480808c0048c94ccc02a99804d5d901000081`;

const SCRIPT_ADDR = "addr_test1wpz8zd2kfjjyfj29l2fw0wljrp0l9haxk0dzlukynagkr4sw0lvs9";

document.getElementById("connect").onclick = async function () {
    lucid = await Lucid.new(
        new Lucid.Blockfrost(
            "https://cardano-preprod.blockfrost.io/api/v0",
            BLOCKFROST_KEY
        ),
        "Preprod"
    );

    const api = await window.cardano.eternl.enable();
    lucid.selectWallet(api);

    alert("Wallet connected!");
};

async function deposit() {
    const ada = document.getElementById("amount").value;
    if (!ada) return alert("Enter an amount");

    const lovelace = BigInt(ada) * 1_000_000n;

    const tx = await lucid
        .newTx()
        .payToAddress(SCRIPT_ADDR, { lovelace })
        .complete();

    const signed = await tx.sign().complete();
    const txHash = await signed.submit();

    alert("Deposit successful: " + txHash);
}

async function withdraw() {
    const utxos = await lucid.utxosAt(SCRIPT_ADDR);

    const redeemer = Data.to(1); // Withdraw

    const tx = await lucid
        .newTx()
        .collectFrom(utxos, redeemer)
        .attachScript(SCRIPT_CBOR)
        .complete();

    const signed = await tx.sign().complete();
    const txHash = await signed.submit();

    alert("Withdraw submitted: " + txHash);
}CardanoVaultCardanoVaultCardanoVaultCardanoVault