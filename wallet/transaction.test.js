import Transaction from "./transaction.js";
import Wallet from "./index.js";

describe("Transaction", () => {
  let transaction, wallet, recipient, amount;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    recipient = "r3c1p13nt";
    transaction = Transaction.newTransaction(wallet, recipient, amount);
  });

  it("Output the amount subtracted from the wallet balance", () => {
    expect(
      transaction.outputs.find((output) => output.address === wallet.publicKey)
        .amount
    ).toEqual(wallet.balance - amount);
  });

  it("Output the amount added to recipient", () => {
    expect(
      transaction.outputs.find((output) => output.address === recipient).amount
    ).toEqual(amount);
  });

  it("Inputs the balance of the wallet", () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it("Validates a valid transaction", () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true);
  });

  it("Invalidates a corrupt transaction", () => {
    transaction.outputs[0].amount = 50000;
    expect(Transaction.verifyTransaction(transaction)).toBe(false);
  });

  describe("Transacting with an amount that exceeds the balance", () => {
    beforeEach(() => {
      amount = 50000;
      transaction = Transaction.newTransaction(wallet, recipient, amount);
    });
    it("Doesn't create the transaction", () => {
      expect(transaction).toEqual(undefined);
    });
  });

  describe("And updating a transaction", () => {
    let nextAmount, nextRecipient;

    beforeEach(() => {
      nextAmount = 20;
      nextRecipient = "n3xt-4ddr355";
      transaction = transaction.update(wallet, nextRecipient, nextAmount);
    });

    it("Subtracts the net  amount from the  sender's output", () => {
      expect(
        transaction.outputs.find(
          (output) => output.address === wallet.publicKey
        ).amount
      ).toEqual(wallet.balance - amount - nextAmount);
    });

    it("Outputs an amount for the next recipient", () => {
      expect(
        transaction.outputs.find((output) => output.address === nextRecipient)
          .amount
      ).toEqual(nextAmount);
    });
  });
});
