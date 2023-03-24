const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const config = require("./config");

const inboxContractFile = require("./compile");
const bytecode = inboxContractFile.evm.bytecode.object;
const abi = inboxContractFile.abi;

const provider = new HDWalletProvider({
    mnemonic: {
        phrase: config.secret.walletPhrase,
    },
    providerOrUrl: config.secret.providerUrl,
});

const web3 = new Web3(provider);

async function deploy() {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account", accounts[0]);

    try {
        const inbox = await new web3.eth.Contract(abi)
            .deploy({ data: bytecode, arguments: ["Hi There!"] })
            .send({ from: accounts[0], gas: "1500000" });

        console.log("Contract deployed", inbox.options.address);
    } catch (e) {
        console.log(e);
        process.exit();
    }
}

deploy();
provider.engine.stop();
