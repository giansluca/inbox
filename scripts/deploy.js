const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const config = require("./config");

const inboxContractFile = require("./compile");
const bytecode = inboxContractFile.evm.bytecode.object;
const abi = inboxContractFile.abi;

let provider;
let web3;

function init() {
    provider = new HDWalletProvider({
        mnemonic: {
            phrase: config.wallet.phrase,
        },
        providerOrUrl: config.wallet.providerUrl,
    });

    web3 = new Web3(provider);
}

function stop() {
    provider.engine.stop();
}

async function deploy() {
    try {
        init();

        const accounts = await web3.eth.getAccounts();
        const account = accounts.find((account) => account === config.wallet.account);

        if (!account) throw new Error("no account");

        console.log("Attempting to deploy from account:", account);

        const inbox = await new web3.eth.Contract(abi)
            .deploy({ data: bytecode, arguments: ["Hi There!"] })
            .send({ from: account, gas: "1000000" });

        console.log("Contract deployed", inbox.options.address);

        stop();
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

(async function main() {
    try {
        await deploy();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
