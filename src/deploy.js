const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const config = require("./config");

const inboxContractFile = require("./compile");
const bytecode = inboxContractFile.evm.bytecode.object;
const abi = inboxContractFile.abi;

const provider = new HDWalletProvider({
    mnemonic: {
        phrase: config.wallet.phrase,
    },
    providerOrUrl: config.wallet.providerUrl,
});

const web3 = new Web3(provider);

async function deploy() {
    try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts.find((account) => account === config.wallet.account);

        if (!account) throw new Error("no account");

        console.log("Attempting to deploy from account:", account);

        const inbox = await new web3.eth.Contract(abi)
            .deploy({ data: bytecode, arguments: ["Hi There!"] })
            .send({ from: account, gas: "1000000" });

        console.log("Contract deployed", inbox.options.address);
    } catch (e) {
        console.log(e);
    }
}

(async function main() {
    await deploy();
})();

provider.engine.stop();
