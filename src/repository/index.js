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
  console.log('hahah');

  try {
    const realm = await Realm.open({
      schema: [TransactionSchema],
      sync: {
        user: app.currentUser,
        partitionValue: userId,
        newRealmFileBehavior: OpenRealmBehaviorConfiguration,
      },
    });
    return realm.objects('transaction');
  } catch (err) {
    console.log(
      `This block should catch any
      instantiation errors.`,
      err,
    );
  }
};

const createTransaction = async (data, userId) => {
  console.log('hihhih', app.currentUser);
  const realm = await Realm.open({
    schema: [TransactionSchema],
    sync: {
      user: app.currentUser,
      partitionValue: userId,
      newRealmFileBehavior: OpenRealmBehaviorConfiguration,
    },
  });

  let {amount, type, category, note} = data;
  let transaction;
  const transactions = realm.objects('transaction');
  let latestId;

  console.log('cuy');
  if (transactions.length == 0) {
    latestId = 1;
  } else {
    latestId = transactions[transactions.length - 1].id;
  }

  realm.write(() => {
    transaction = realm.create('transaction', {
      _id: latestId + 1,
      date: new Date().toISOString(),
      category: category,
      amount: parseInt(amount),
      type: type,
      note: note,
    });
    console.log('HOHOHO', transaction);
  });

  return realm.objects('transaction');
};

const editTransaction = async (data, transactionId, userId) => {
  const realm = await Realm.open({
    schema: [TransactionSchema],
    sync: {
      user: app.currentUser,
      partitionValue: userId,
    },
  });

  let {amount, type, category, note} = data;

  const transaction = realm.objectForPrimaryKey('transaction', transactionId);

  realm.write(() => {
    transaction.amount = parseInt(amount);
    transaction.type = type;
    transaction.category = category;
    transaction.note = note;
  });

  return realm.objects('transaction');
};

const deleteTransaction = async (transactionId, userId) => {
  const realm = await Realm.open({
    sync: {
      user: app.currentUser,
      partitionValue: userId,
    },
  });

  let transaction = realm.objectForPrimaryKey('transaction', transactionId);

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

  const transaction = realm.objectForPrimaryKey('transaction', id);

  return transaction;
};

export {
  getAllTransactions,
  createTransaction,
  getTransactionById,
  editTransaction,
  deleteTransaction,
};
