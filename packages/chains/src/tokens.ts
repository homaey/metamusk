/**
 * Token registry.
 *
 * Safety note: a wallet that shows the wrong contract address for a token is
 * dangerous. So we ship a *curated, verified* set of the most important tokens
 * (native coins, major stablecoins, blue-chips) with hand-checked addresses, and
 * support loading the full "top ~200" from standard token-list feeds at runtime
 * (`loadTokenList`). The curated set is the offline fallback; the fetched list
 * extends coverage to hundreds of assets without baking unverified addresses in.
 */
import type { ChainFamily } from "./types.js";

export interface TokenInfo {
  /** Network id from the registry, e.g. "evm:1", "solana:mainnet". */
  networkId: string;
  family: ChainFamily;
  symbol: string;
  name: string;
  decimals: number;
  /** Contract/mint/jetton address. `null` for the chain's native coin. */
  address: string | null;
  /** CoinGecko id for price lookups, where known. */
  coingeckoId?: string;
  logoURI?: string;
  /** True for the chain's gas/native asset. */
  native?: boolean;
}

const t = (x: TokenInfo): TokenInfo => x;

/** Native gas coins for every supported network. */
const NATIVE: TokenInfo[] = [
  t({ networkId: "ton:mainnet", family: "ton", symbol: "TON", name: "Toncoin", decimals: 9, address: null, native: true, coingeckoId: "the-open-network" }),
  t({ networkId: "evm:1", family: "evm", symbol: "ETH", name: "Ether", decimals: 18, address: null, native: true, coingeckoId: "ethereum" }),
  t({ networkId: "evm:42161", family: "evm", symbol: "ETH", name: "Ether", decimals: 18, address: null, native: true, coingeckoId: "ethereum" }),
  t({ networkId: "evm:10", family: "evm", symbol: "ETH", name: "Ether", decimals: 18, address: null, native: true, coingeckoId: "ethereum" }),
  t({ networkId: "evm:8453", family: "evm", symbol: "ETH", name: "Ether", decimals: 18, address: null, native: true, coingeckoId: "ethereum" }),
  t({ networkId: "evm:56", family: "evm", symbol: "BNB", name: "BNB", decimals: 18, address: null, native: true, coingeckoId: "binancecoin" }),
  t({ networkId: "evm:137", family: "evm", symbol: "POL", name: "Polygon", decimals: 18, address: null, native: true, coingeckoId: "matic-network" }),
  t({ networkId: "evm:43114", family: "evm", symbol: "AVAX", name: "Avalanche", decimals: 18, address: null, native: true, coingeckoId: "avalanche-2" }),
  t({ networkId: "solana:mainnet", family: "solana", symbol: "SOL", name: "Solana", decimals: 9, address: null, native: true, coingeckoId: "solana" }),
  t({ networkId: "bitcoin:mainnet", family: "bitcoin", symbol: "BTC", name: "Bitcoin", decimals: 8, address: null, native: true, coingeckoId: "bitcoin" }),
];

/** Verified major tokens (addresses hand-checked). Extend via loadTokenList(). */
const CURATED: TokenInfo[] = [
  // Ethereum mainnet
  t({ networkId: "evm:1", family: "evm", symbol: "USDT", name: "Tether USD", decimals: 6, address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", coingeckoId: "tether" }),
  t({ networkId: "evm:1", family: "evm", symbol: "USDC", name: "USD Coin", decimals: 6, address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", coingeckoId: "usd-coin" }),
  t({ networkId: "evm:1", family: "evm", symbol: "DAI", name: "Dai", decimals: 18, address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", coingeckoId: "dai" }),
  t({ networkId: "evm:1", family: "evm", symbol: "WETH", name: "Wrapped Ether", decimals: 18, address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", coingeckoId: "weth" }),
  t({ networkId: "evm:1", family: "evm", symbol: "WBTC", name: "Wrapped Bitcoin", decimals: 8, address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", coingeckoId: "wrapped-bitcoin" }),
  t({ networkId: "evm:1", family: "evm", symbol: "LINK", name: "Chainlink", decimals: 18, address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", coingeckoId: "chainlink" }),
  t({ networkId: "evm:1", family: "evm", symbol: "UNI", name: "Uniswap", decimals: 18, address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", coingeckoId: "uniswap" }),
  t({ networkId: "evm:1", family: "evm", symbol: "AAVE", name: "Aave", decimals: 18, address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", coingeckoId: "aave" }),
  t({ networkId: "evm:1", family: "evm", symbol: "SHIB", name: "Shiba Inu", decimals: 18, address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", coingeckoId: "shiba-inu" }),
  t({ networkId: "evm:1", family: "evm", symbol: "PEPE", name: "Pepe", decimals: 18, address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933", coingeckoId: "pepe" }),
  t({ networkId: "evm:1", family: "evm", symbol: "MKR", name: "Maker", decimals: 18, address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2", coingeckoId: "maker" }),
  t({ networkId: "evm:1", family: "evm", symbol: "LDO", name: "Lido DAO", decimals: 18, address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32", coingeckoId: "lido-dao" }),
  t({ networkId: "evm:1", family: "evm", symbol: "CRV", name: "Curve DAO", decimals: 18, address: "0xD533a949740bb3306d119CC777fa900bA034cd52", coingeckoId: "curve-dao-token" }),
  t({ networkId: "evm:1", family: "evm", symbol: "SUSHI", name: "SushiSwap", decimals: 18, address: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2", coingeckoId: "sushi" }),
  t({ networkId: "evm:1", family: "evm", symbol: "YFI", name: "yearn.finance", decimals: 18, address: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e", coingeckoId: "yearn-finance" }),
  t({ networkId: "evm:1", family: "evm", symbol: "COMP", name: "Compound", decimals: 18, address: "0xc00e94Cb662C3520282E6f5717214004A7f26888", coingeckoId: "compound-governance-token" }),
  t({ networkId: "evm:1", family: "evm", symbol: "SNX", name: "Synthetix", decimals: 18, address: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F", coingeckoId: "havven" }),
  t({ networkId: "evm:1", family: "evm", symbol: "BAL", name: "Balancer", decimals: 18, address: "0xba100000625a3754423978a60c9317c58a424e3D", coingeckoId: "balancer" }),
  t({ networkId: "evm:1", family: "evm", symbol: "1INCH", name: "1inch Network", decimals: 18, address: "0x111111111117dC0aa78b770fA6A738034120C302", coingeckoId: "1inch" }),
  t({ networkId: "evm:1", family: "evm", symbol: "GRT", name: "The Graph", decimals: 18, address: "0xc944E90C64B2c07662A292be6244BDf05Cda44a7", coingeckoId: "the-graph" }),
  t({ networkId: "evm:1", family: "evm", symbol: "ENS", name: "Ethereum Name Service", decimals: 18, address: "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72", coingeckoId: "ethereum-name-service" }),
  t({ networkId: "evm:1", family: "evm", symbol: "stETH", name: "Lido Staked Ether", decimals: 18, address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84", coingeckoId: "staked-ether" }),
  t({ networkId: "evm:1", family: "evm", symbol: "wstETH", name: "Wrapped stETH", decimals: 18, address: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0", coingeckoId: "wrapped-steth" }),
  t({ networkId: "evm:1", family: "evm", symbol: "APE", name: "ApeCoin", decimals: 18, address: "0x4d224452801ACEd8B2F0aebE155379bb5D594381", coingeckoId: "apecoin" }),
  t({ networkId: "evm:1", family: "evm", symbol: "SAND", name: "The Sandbox", decimals: 18, address: "0x3845badAde8e6dFF049820680d1F14bD3903a5d0", coingeckoId: "the-sandbox" }),
  t({ networkId: "evm:1", family: "evm", symbol: "MANA", name: "Decentraland", decimals: 18, address: "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942", coingeckoId: "decentraland" }),
  t({ networkId: "evm:1", family: "evm", symbol: "AXS", name: "Axie Infinity", decimals: 18, address: "0xBB0E17EF65F82Ab018d8EDd776e8DD940327B28b", coingeckoId: "axie-infinity" }),
  t({ networkId: "evm:1", family: "evm", symbol: "CHZ", name: "Chiliz", decimals: 18, address: "0x3506424F91fD33084466F402d5D97f05F8e3b4AF", coingeckoId: "chiliz" }),
  t({ networkId: "evm:1", family: "evm", symbol: "CVX", name: "Convex Finance", decimals: 18, address: "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B", coingeckoId: "convex-finance" }),
  t({ networkId: "evm:1", family: "evm", symbol: "FRAX", name: "Frax", decimals: 18, address: "0x853d955aCEf822Db058eb8505911ED77F175b99e", coingeckoId: "frax" }),
  t({ networkId: "evm:1", family: "evm", symbol: "FXS", name: "Frax Share", decimals: 18, address: "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0", coingeckoId: "frax-share" }),
  t({ networkId: "evm:1", family: "evm", symbol: "IMX", name: "Immutable", decimals: 18, address: "0xF57e7e7C23978C3cAEC3C3548E3D615c346e79fF", coingeckoId: "immutable-x" }),
  t({ networkId: "evm:1", family: "evm", symbol: "RPL", name: "Rocket Pool", decimals: 18, address: "0xD33526068D116cE69F19A9ee46F0bd304F21A51f", coingeckoId: "rocket-pool" }),
  t({ networkId: "evm:1", family: "evm", symbol: "BLUR", name: "Blur", decimals: 18, address: "0x5283D291DBCF85356A21bA090E6db59121208b44", coingeckoId: "blur" }),
  t({ networkId: "evm:1", family: "evm", symbol: "WLD", name: "Worldcoin", decimals: 18, address: "0x163f8C2467924be0ae7B5347228CABF260318753", coingeckoId: "worldcoin-wld" }),
  t({ networkId: "evm:1", family: "evm", symbol: "PENDLE", name: "Pendle", decimals: 18, address: "0x808507121B80c02388fAd14726482e061B8da827", coingeckoId: "pendle" }),
  t({ networkId: "evm:1", family: "evm", symbol: "FET", name: "Artificial Superintelligence Alliance", decimals: 18, address: "0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85", coingeckoId: "fetch-ai" }),
  t({ networkId: "evm:1", family: "evm", symbol: "RNDR", name: "Render", decimals: 18, address: "0x6De037ef9aD2725EB40118Bb1702EBb27e4Aeb24", coingeckoId: "render-token" }),
  t({ networkId: "evm:1", family: "evm", symbol: "ONDO", name: "Ondo Finance", decimals: 18, address: "0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3", coingeckoId: "ondo-finance" }),
  t({ networkId: "evm:1", family: "evm", symbol: "PYUSD", name: "PayPal USD", decimals: 6, address: "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8", coingeckoId: "paypal-usd" }),
  t({ networkId: "evm:1", family: "evm", symbol: "crvUSD", name: "Curve USD", decimals: 18, address: "0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E", coingeckoId: "crvusd" }),
  t({ networkId: "evm:1", family: "evm", symbol: "ARB", name: "Arbitrum", decimals: 18, address: "0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1", coingeckoId: "arbitrum" }),
  t({ networkId: "evm:1", family: "evm", symbol: "GALA", name: "Gala", decimals: 8, address: "0xd1d2Eb1B1e90B638588728b4130137D262C87cae", coingeckoId: "gala" }),
  t({ networkId: "evm:1", family: "evm", symbol: "FTM", name: "Fantom", decimals: 18, address: "0x4E15361FD6b4BB609Fa63C81A2be19d873717870", coingeckoId: "fantom" }),

  // BNB Smart Chain
  t({ networkId: "evm:56", family: "evm", symbol: "USDT", name: "Tether USD", decimals: 18, address: "0x55d398326f99059fF775485246999027B3197955", coingeckoId: "tether" }),
  t({ networkId: "evm:56", family: "evm", symbol: "USDC", name: "USD Coin", decimals: 18, address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", coingeckoId: "usd-coin" }),
  t({ networkId: "evm:56", family: "evm", symbol: "BUSD", name: "Binance USD", decimals: 18, address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", coingeckoId: "binance-usd" }),
  t({ networkId: "evm:56", family: "evm", symbol: "CAKE", name: "PancakeSwap", decimals: 18, address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", coingeckoId: "pancakeswap-token" }),
  t({ networkId: "evm:56", family: "evm", symbol: "WBNB", name: "Wrapped BNB", decimals: 18, address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", coingeckoId: "wbnb" }),
  t({ networkId: "evm:56", family: "evm", symbol: "BTCB", name: "Bitcoin BEP20", decimals: 18, address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c", coingeckoId: "bitcoin" }),
  t({ networkId: "evm:56", family: "evm", symbol: "ETH", name: "Ethereum BEP20", decimals: 18, address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", coingeckoId: "ethereum" }),
  t({ networkId: "evm:56", family: "evm", symbol: "XRP", name: "XRP BEP20", decimals: 18, address: "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBe", coingeckoId: "ripple" }),
  t({ networkId: "evm:56", family: "evm", symbol: "ADA", name: "Cardano BEP20", decimals: 18, address: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47", coingeckoId: "cardano" }),
  t({ networkId: "evm:56", family: "evm", symbol: "DOGE", name: "Dogecoin BEP20", decimals: 8, address: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43", coingeckoId: "dogecoin" }),
  t({ networkId: "evm:56", family: "evm", symbol: "DOT", name: "Polkadot BEP20", decimals: 18, address: "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402", coingeckoId: "polkadot" }),
  t({ networkId: "evm:56", family: "evm", symbol: "LINK", name: "Chainlink BEP20", decimals: 18, address: "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD", coingeckoId: "chainlink" }),
  t({ networkId: "evm:56", family: "evm", symbol: "UNI", name: "Uniswap BEP20", decimals: 18, address: "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1", coingeckoId: "uniswap" }),
  t({ networkId: "evm:56", family: "evm", symbol: "SOL", name: "Solana BEP20", decimals: 18, address: "0x570A5D26f7765Ecb712C0924E4De545B89fD43dF", coingeckoId: "solana" }),

  // Polygon
  t({ networkId: "evm:137", family: "evm", symbol: "USDT", name: "Tether USD", decimals: 6, address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", coingeckoId: "tether" }),
  t({ networkId: "evm:137", family: "evm", symbol: "USDC", name: "USD Coin", decimals: 6, address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", coingeckoId: "usd-coin" }),
  t({ networkId: "evm:137", family: "evm", symbol: "DAI", name: "Dai", decimals: 18, address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", coingeckoId: "dai" }),
  t({ networkId: "evm:137", family: "evm", symbol: "WMATIC", name: "Wrapped POL", decimals: 18, address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", coingeckoId: "wmatic" }),
  t({ networkId: "evm:137", family: "evm", symbol: "WBTC", name: "Wrapped Bitcoin", decimals: 8, address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", coingeckoId: "wrapped-bitcoin" }),
  t({ networkId: "evm:137", family: "evm", symbol: "WETH", name: "Wrapped Ether", decimals: 18, address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", coingeckoId: "weth" }),
  t({ networkId: "evm:137", family: "evm", symbol: "LINK", name: "Chainlink", decimals: 18, address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39", coingeckoId: "chainlink" }),
  t({ networkId: "evm:137", family: "evm", symbol: "AAVE", name: "Aave", decimals: 18, address: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B", coingeckoId: "aave" }),

  // Arbitrum One
  t({ networkId: "evm:42161", family: "evm", symbol: "USDC", name: "USD Coin", decimals: 6, address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", coingeckoId: "usd-coin" }),
  t({ networkId: "evm:42161", family: "evm", symbol: "USDT", name: "Tether USD", decimals: 6, address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", coingeckoId: "tether" }),
  t({ networkId: "evm:42161", family: "evm", symbol: "ARB", name: "Arbitrum", decimals: 18, address: "0x912CE59144191C1204E64559FE8253a0e49E6548", coingeckoId: "arbitrum" }),
  t({ networkId: "evm:42161", family: "evm", symbol: "WETH", name: "Wrapped Ether", decimals: 18, address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", coingeckoId: "weth" }),
  t({ networkId: "evm:42161", family: "evm", symbol: "WBTC", name: "Wrapped Bitcoin", decimals: 8, address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f", coingeckoId: "wrapped-bitcoin" }),
  t({ networkId: "evm:42161", family: "evm", symbol: "GMX", name: "GMX", decimals: 18, address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a", coingeckoId: "gmx" }),
  t({ networkId: "evm:42161", family: "evm", symbol: "PENDLE", name: "Pendle", decimals: 18, address: "0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8", coingeckoId: "pendle" }),
  t({ networkId: "evm:42161", family: "evm", symbol: "DAI", name: "Dai", decimals: 18, address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", coingeckoId: "dai" }),

  // Optimism
  t({ networkId: "evm:10", family: "evm", symbol: "USDC", name: "USD Coin", decimals: 6, address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", coingeckoId: "usd-coin" }),
  t({ networkId: "evm:10", family: "evm", symbol: "USDT", name: "Tether USD", decimals: 6, address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58", coingeckoId: "tether" }),
  t({ networkId: "evm:10", family: "evm", symbol: "OP", name: "Optimism", decimals: 18, address: "0x4200000000000000000000000000000000000042", coingeckoId: "optimism" }),
  t({ networkId: "evm:10", family: "evm", symbol: "WETH", name: "Wrapped Ether", decimals: 18, address: "0x4200000000000000000000000000000000000006", coingeckoId: "weth" }),
  t({ networkId: "evm:10", family: "evm", symbol: "WBTC", name: "Wrapped Bitcoin", decimals: 8, address: "0x68f180fcCe6836688e9084f035309E29Bf0A2095", coingeckoId: "wrapped-bitcoin" }),
  t({ networkId: "evm:10", family: "evm", symbol: "SNX", name: "Synthetix", decimals: 18, address: "0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4", coingeckoId: "havven" }),

  // Base
  t({ networkId: "evm:8453", family: "evm", symbol: "USDC", name: "USD Coin", decimals: 6, address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", coingeckoId: "usd-coin" }),
  t({ networkId: "evm:8453", family: "evm", symbol: "DAI", name: "Dai", decimals: 18, address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", coingeckoId: "dai" }),
  t({ networkId: "evm:8453", family: "evm", symbol: "WETH", name: "Wrapped Ether", decimals: 18, address: "0x4200000000000000000000000000000000000006", coingeckoId: "weth" }),
  t({ networkId: "evm:8453", family: "evm", symbol: "cbETH", name: "Coinbase Wrapped Staked ETH", decimals: 18, address: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22", coingeckoId: "coinbase-wrapped-staked-eth" }),
  t({ networkId: "evm:8453", family: "evm", symbol: "cbBTC", name: "Coinbase Wrapped BTC", decimals: 8, address: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf", coingeckoId: "coinbase-wrapped-btc" }),
  t({ networkId: "evm:8453", family: "evm", symbol: "AERO", name: "Aerodrome Finance", decimals: 18, address: "0x940181a94A35A4569E4529A3CDfB74e38FD98631", coingeckoId: "aerodrome-finance" }),

  // Avalanche C-Chain
  t({ networkId: "evm:43114", family: "evm", symbol: "USDC", name: "USD Coin", decimals: 6, address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", coingeckoId: "usd-coin" }),
  t({ networkId: "evm:43114", family: "evm", symbol: "USDT", name: "Tether USD", decimals: 6, address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7", coingeckoId: "tether" }),
  t({ networkId: "evm:43114", family: "evm", symbol: "WAVAX", name: "Wrapped AVAX", decimals: 18, address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", coingeckoId: "avalanche-2" }),
  t({ networkId: "evm:43114", family: "evm", symbol: "WETH", name: "Wrapped Ether", decimals: 18, address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB", coingeckoId: "weth" }),
  t({ networkId: "evm:43114", family: "evm", symbol: "JOE", name: "Trader Joe", decimals: 18, address: "0x6e84a6216eA6daCC71eE8E6b0a5B7322EEbC0fDd", coingeckoId: "joe" }),

  // Solana (SPL mints)
  t({ networkId: "solana:mainnet", family: "solana", symbol: "USDC", name: "USD Coin", decimals: 6, address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", coingeckoId: "usd-coin" }),
  t({ networkId: "solana:mainnet", family: "solana", symbol: "USDT", name: "Tether USD", decimals: 6, address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", coingeckoId: "tether" }),
  t({ networkId: "solana:mainnet", family: "solana", symbol: "BONK", name: "Bonk", decimals: 5, address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", coingeckoId: "bonk" }),
  t({ networkId: "solana:mainnet", family: "solana", symbol: "JUP", name: "Jupiter", decimals: 6, address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", coingeckoId: "jupiter-exchange-solana" }),
  t({ networkId: "solana:mainnet", family: "solana", symbol: "RAY", name: "Raydium", decimals: 6, address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", coingeckoId: "raydium" }),
  t({ networkId: "solana:mainnet", family: "solana", symbol: "mSOL", name: "Marinade staked SOL", decimals: 9, address: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", coingeckoId: "msol" }),
  t({ networkId: "solana:mainnet", family: "solana", symbol: "PYTH", name: "Pyth Network", decimals: 6, address: "HZ1JovNiVvGrGs6eGeFgFkXS58NoNiJnXLwQKOnE9D5e", coingeckoId: "pyth-network" }),

  // TON (jetton masters)
  t({ networkId: "ton:mainnet", family: "ton", symbol: "USDT", name: "Tether USD", decimals: 6, address: "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs", coingeckoId: "tether" }),
  t({ networkId: "ton:mainnet", family: "ton", symbol: "NOT", name: "Notcoin", decimals: 9, address: "EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT", coingeckoId: "notcoin" }),
  t({ networkId: "ton:mainnet", family: "ton", symbol: "TONCOIN", name: "TON Liquid Staking", decimals: 9, address: "EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw", coingeckoId: "bemo-staked-ton" }),
];

export const ALL_TOKENS: TokenInfo[] = [...NATIVE, ...CURATED];

export const tokensForNetwork = (networkId: string): TokenInfo[] =>
  ALL_TOKENS.filter((tok) => tok.networkId === networkId);

export function searchTokens(query: string, networkId?: string): TokenInfo[] {
  const q = query.trim().toLowerCase();
  return ALL_TOKENS.filter((tok) => {
    if (networkId && tok.networkId !== networkId) return false;
    if (!q) return true;
    return (
      tok.symbol.toLowerCase().includes(q) ||
      tok.name.toLowerCase().includes(q) ||
      (tok.address?.toLowerCase().includes(q) ?? false)
    );
  });
}

/**
 * Token-list schema (Uniswap/CoinGecko-compatible) for runtime extension to the
 * full top-200+. Maps a fetched list onto our TokenInfo for one network.
 */
interface RawTokenListEntry {
  chainId?: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export async function loadTokenList(
  url: string,
  networkId: string,
  family: ChainFamily,
): Promise<TokenInfo[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Token list fetch failed (${res.status}).`);
  const data = (await res.json()) as { tokens?: RawTokenListEntry[] };
  return (data.tokens ?? []).map((e) => ({
    networkId,
    family,
    symbol: e.symbol,
    name: e.name,
    decimals: e.decimals,
    address: e.address,
    logoURI: e.logoURI,
  }));
}
