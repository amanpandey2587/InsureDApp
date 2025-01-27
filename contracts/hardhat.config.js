// require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("@nomiclabs/hardhat-ethers")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("@nomicfoundation/hardhat-network-helpers")
require("@nomicfoundation/hardhat-chai-matchers");
require("dotenv").config()
/** @type import('hardhat/config').HardhatUserConfig */
const RPC_URL = process.env.RPC_URL;
const privateKey = process.env.PRIVATE_KEY;
const apiKey = process.env.ETHERSCAN_API_KEY;
const coinkey=process.env.COINMARKETCAP_KEY


module.exports = {
    defaultNetwork:"hardhat",
    networks:{
        hardhat:{
            chainId:31337,
            blockConfirmations:1,
            live:true,
        },
        sepolia: {
            url: RPC_URL,
            accounts: [privateKey],
            chainId: 11155111,
            blockConfirmations:6,
        },
    },
    solidity: "0.8.7",
    namedAccounts:{
        deployer:{
            default:0,
        },
        player:{
            default:1,
        },
    }, 
    settings: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
    ,
    gasReporter:{
        enabled:false,
        outputFile:"gasReport.txt",
        noColors:true,
        currency:"USD",
        coinmarketCap:coinkey,
        token:"MATIC"
      }
}
