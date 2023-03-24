const ENV = process.env.ENV || "dev";
if (ENV !== "prod") {
    require("dotenv").config();
}

const pkg = require("../package");

const config = {
    env: process.env.ENV || "local",
    app: {
        name: process.env.APP_NAME || "inbox",
        version: pkg.version,
        commit: process.env.APP_COMMIT,
    },
    secret: {
        walletPhrase: process.env.WALLET_PHRASE,
        providerUrl: process.env.PROVIDER_URL,
    },
};

module.exports = config;
