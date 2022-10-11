import express from "express";
import Blockchain from "../blockchain/blockchain.js";
import P2pServer from "./p2p-server.js";
import Wallet from "../wallet/index.js";
import TransactionPool from "../wallet/transaction-pool.js";
import Miner from "./miner.js";

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();

app.use(express.json());

const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();

const p2pServer = new P2pServer(bc, tp);

const miner = new Miner(bc, tp, wallet, p2pServer);

app.get("/blocks", (req, res) => {
  res.json(bc.chain);
});

app.post("/mine", (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);

  p2pServer.syncChains();

  res.redirect("/blocks");
});

app.get("/transactions", (req, res) => {
  res.json(tp.transactions);
});

app.post("/transact", (req, res) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, bc, tp);
  p2pServer.broadcastTransaction(transaction);
  res.redirect("/transactions");
});

app.get("/mine-transactions", (req, res) => {
  const block = miner.mine();
  console.log(`New block added: ${block.toString()}`);
  res.redirect(`/blocks`);
});

app.get("/public-key", (req, res) => {
  res.json({ publicKey: wallet.publicKey });
});

app.listen(HTTP_PORT, () => {
  console.log(`Listening to port: ${HTTP_PORT}`);
});

p2pServer.listen();
