import Wallet from "../wallet/index.js";
import Transaction from "../wallet/transaction.js";

class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransactions = this.transactionPool.validTransactions();
    validTransactions.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
    );

    const block = this.blockchain.addBlock(validTransactions);

    this.p2pServer.syncChains();

    this.transactionPool.clear();

    this.p2pServer.broadcastClearTransactions();

    return block;
  }
}

export default Miner;
