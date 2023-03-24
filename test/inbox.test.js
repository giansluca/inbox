const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const inboxContractFile = require("../src/compile");
const bytecode = inboxContractFile.evm.bytecode.object;
const abi = inboxContractFile.abi;

const provider = ganache.provider();
const web3 = new Web3(provider);
let account;
let inbox;

describe("Test contract", () => {
    beforeEach(async () => {
        const initialMessage = "Good morning!";
        const allAccounts = await web3.eth.getAccounts();
        account = allAccounts[0];

        inbox = await new web3.eth.Contract(abi)
            .deploy({ data: bytecode, arguments: [initialMessage] })
            .send({ from: account, gas: "1000000" });
    });

    it("should deploy the contract with the default message", async () => {
        // Given
        const expectedMessage = "Good morning!";

        // When
        const message = await inbox.methods.getMessage().call();

        // Then
        assert.ok(inbox.options.address);
        assert.strictEqual(message, expectedMessage);
    });

    it("should change the message", async () => {
        // Given
        const newMessage = "Updated message";

        // When
        await inbox.methods.setMessage(newMessage).send({ from: account });
        const message = await inbox.methods.getMessage().call();

        // Then
        assert.strictEqual(message, newMessage);
    });
});
