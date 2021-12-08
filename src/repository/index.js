import Realm from 'realm';
import app from '../shared/realmApp';

const TransactionSchema = {
  name: 'Transaction',
  properties: {
    _id: 'int',
    _partition: 'string',
    amount: 'int',
    category: 'string',
    date: 'string',
    note: 'string?',
    type: 'string',
  },
  primaryKey: '_id',
};

const OpenRealmBehaviorConfiguration = {
  type: 'openImmediately',
};

const getAllTransactions = async userId => {
  try {
    const realm = await Realm.open({
      schema: [TransactionSchema],
      sync: {
        user: app.currentUser,
        partitionValue: userId,
        newRealmFileBehavior: OpenRealmBehaviorConfiguration,
      },
    });
    return realm.objects('Transaction');
  } catch (err) {
    console.log(
      `This block should catch any
      instantiation errors.`,
      err,
    );
  }
};

const createTransaction = async (data, userId) => {
  const realm = await Realm.open({
    schema: [TransactionSchema],
    sync: {
      user: app.currentUser,
      partitionValue: userId,
      newRealmFileBehavior: OpenRealmBehaviorConfiguration,
    },
  });

  let {amount, type, category, note, date} = data;
  let transaction;
  const transactions = realm.objects('Transaction');
  let latestId;

  if (transactions.length == 0) {
    latestId = 1;
  } else {
    latestId = transactions[transactions.length - 1].id;
  }

  realm.write(() => {
    transaction = realm.create('Transaction', {
      _id: latestId + 1,
      date: date.toISOString(),
      category: category,
      amount: parseInt(amount),
      type: type,
      note: note,
      _partition: userId,
    });
  });

  return realm.objects('Transaction');
};

const editTransaction = async (data, transactionId, userId) => {
  const realm = await Realm.open({
    schema: [TransactionSchema],
    sync: {
      user: app.currentUser,
      partitionValue: userId,
    },
  });

  let {amount, type, category, note, date} = data;

  const transaction = realm.objectForPrimaryKey('Transaction', transactionId);

  realm.write(() => {
    transaction.date = date.toISOString();
    transaction.amount = parseInt(amount);
    transaction.type = type;
    transaction.category = category;
    transaction.note = note;
  });

  return realm.objects('Transaction');
};

const deleteTransaction = async (transactionId, userId) => {
  const realm = await Realm.open({
    sync: {
      user: app.currentUser,
      partitionValue: userId,
    },
  });

  let transaction = realm.objectForPrimaryKey('Transaction', transactionId);

  realm.write(() => {
    realm.delete(transaction);

    transaction = null;
  });
};

const getTransactionById = async (id, userId) => {
  const realm = await Realm.open({
    schema: [TransactionSchema],
    sync: {
      user: app.currentUser,
      partitionValue: userId,
    },
  });

  const transaction = realm.objectForPrimaryKey('Transaction', id);

  return transaction;
};

export {
  getAllTransactions,
  createTransaction,
  getTransactionById,
  editTransaction,
  deleteTransaction,
};
