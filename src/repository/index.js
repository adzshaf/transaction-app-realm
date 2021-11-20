import Realm from 'realm';

const TransactionSchema = {
  name: 'transaction',
  properties: {
    transaction_id: 'int',
    date: 'string',
    category: 'string',
    amount: 'int',
    type: 'string',
    note: 'string?',
  },
  primaryKey: 'transaction_id',
};

const getAllTransactions = async () => {
  const realm = await Realm.open({
    path: 'myrealm',
    schema: [TransactionSchema],
  });

  return realm.objects('transaction');
};

const createTransaction = async data => {
  const realm = await Realm.open({
    path: 'myrealm',
    schema: [TransactionSchema],
  });

  let {amount, type, category, note} = data;
  let transaction;
  const transactions = realm.objects('transaction');
  let latestId;

  if (transactions.length == 0) {
    latestId = 1;
  } else {
    latestId = transactions[transactions.length - 1].transaction_id;
  }

  realm.write(() => {
    transaction = realm.create('transaction', {
      transaction_id: latestId + 1,
      date: new Date().toISOString(),
      category: category,
      amount: parseInt(amount),
      type: type,
      note: note,
    });
  });

  return realm.objects('transaction');
};

const editTransaction = async (data, transactionId) => {
  const realm = await Realm.open({
    path: 'myrealm',
    schema: [TransactionSchema],
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

const deleteTransaction = async transactionId => {
  const realm = await Realm.open({
    path: 'myrealm',
  });

  let transaction = realm.objectForPrimaryKey('transaction', transactionId);

  realm.write(() => {
    realm.delete(transaction);

    transaction = null;
  });
};

const getTransactionById = async id => {
  const realm = await Realm.open({
    path: 'myrealm',
    schema: [TransactionSchema],
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
