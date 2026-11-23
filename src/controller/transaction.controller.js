const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose");

async function createTransaction(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "fromAccount, toAccount, amount and idempotencyKey are required",
    });
  }

  if (Number(amount) <= 0) {
    return res.status(400).json({
      message: "Amount must be greater than zero",
    });
  }

 
  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
    user: req.user._id,
  });
  const toUserAccount = await accountModel.findOne({ _id: toAccount });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "Invalid fromAccount or toAccount",
    });
  }

  const existingTransaction = await transactionModel.findOne({ idempotencyKey });
  if (existingTransaction) {
    if (existingTransaction.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already processed",
        transaction: existingTransaction,
      });
    }
    if (existingTransaction.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is processing",
      });
    }
    if (existingTransaction.status === "FAILED") {
      return res.status(500).json({
        message: "Transaction failed",
      });
    }
    if (existingTransaction.status === "REVERSED") {
      return res.status(500).json({
        message: "Transaction reversed",
      });
    }
  }

  if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
    return res.status(400).json({
      message: "Both fromAccount and toAccount must be ACTIVE to process transaction",
    });
  }

  const balance = await fromUserAccount.getBalance();
  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}.`,
    });
  }

  const session = await mongoose.startSession();
  let transaction;

  try {
    session.startTransaction();

    [transaction] = await transactionModel.create(
      [
        {
          fromAccount,
          toAccount,
          amount,
          idempotencyKey,
          status: "PENDING",
        },
      ],
      { session }
    );

    await ledgerModel.create(
      [
        {
          account: fromAccount,
          amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
      ],
      { session }
    );

    await ledgerModel.create(
      [
        {
          account: toAccount,
          amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session }
    );

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({
      message: "Transaction failed",
      error: error.message,
    });
  } finally {
    session.endSession();
  }

  try {
    await emailService.sendTransactionEmail(
      req.user.email,
      req.user.name,
      `Amount ${amount} has been transferred from account ${fromAccount} to account ${toAccount}.`
    );
  } catch (err) {
    console.error("Transaction email failed:", err.message);
  }

  return res.status(201).json({
    message: "Transaction completed successfully",
    transaction,
  });
}

async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "toAccount, amount and idempotencyKey are required",
    });
  }

  const toUserAccount = await accountModel.findOne({ _id: toAccount });
  if (!toUserAccount) {
    return res.status(400).json({
      message: "Invalid toAccount",
    });
  }

  
  const fromUserAccount = await accountModel.findOne({ user: req.user._id });
  if (!fromUserAccount) {
    return res.status(400).json({
      message: "System user account not found for the current user",
    });
  }

  const existingTransaction = await transactionModel.findOne({ idempotencyKey });
  if (existingTransaction) {
    return res.status(200).json({
      message: "Transaction already processed",
      transaction: existingTransaction,
    });
  }

  const session = await mongoose.startSession();
  let transaction;

  try {
    session.startTransaction();

    [transaction] = await transactionModel.create(
      [
        {
          fromAccount: fromUserAccount._id,
          toAccount,
          amount,
          idempotencyKey,
          status: "PENDING",
        },
      ],
      { session }
    );

    await ledgerModel.create(
      [
        {
          account: fromUserAccount._id,
          amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
      ],
      { session }
    );

    await ledgerModel.create(
      [
        {
          account: toAccount,
          amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session }
    );

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({
      message: "Initial funds transaction failed",
      error: error.message,
    });
  } finally {
    session.endSession();
  }

  return res.status(201).json({
    message: "Initial funds transaction completed successfully",
    transaction,
  });
}

module.exports = {
  createTransaction,
  createInitialFundsTransaction,
};