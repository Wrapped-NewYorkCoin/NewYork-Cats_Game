import Web3 from 'web3';
import KittyService from './kitty.service';
import KittyMarketPlaceService from './kittyMarketPlace.service';
import WalletService from './walletService';

export default class Service {
  static chainIdToAddress = {
    // '0x38': // Binance MainNet
    '0x61': {
      // Binance Test'
      kitty: '0x1494d0de6b9ed33aee11aae99789f4b77514c7f6',
      market: '0xa885f2d6353063c094040a1d56a68e8adb47bae6',
    },
    '0x38': {
      // Binance MainNet
      kitty: '0x9312e2681EC932ab10a8733F4Ff60B4068D32B6F',
      market: '0xe59ff6CF2f513Ea166D6af2226D78705906EA6bB',
    },
  };

  static web3;
  static kitty;
  static market;
  static wallet;

  static web3ProviderAvailable = () => Boolean(Web3.givenProvider);

  static initServices = () => {
    if (!Service.web3ProviderAvailable()) {
      throw new Error('No web 3 provider available. Please install Metamask');
    }

    this.web3 = new Web3(Web3.givenProvider);
    this.kitty = new KittyService(Service.web3);
    this.market = new KittyMarketPlaceService(Service.web3);
    this.wallet = new WalletService(Service.web3);
  }

  static initContracts = async (chainId) => {
    const contractAddresses = this.chainIdToAddress[chainId];
    if (!contractAddresses) {
      throw new Error(`Contract init error. Unsupported chainId: ${chainId}`);
    }

    Service.kitty.init(contractAddresses.kitty);
    Service.market.init(contractAddresses.market, Service.kitty);
  }
}
