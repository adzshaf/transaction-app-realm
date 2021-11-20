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
    latestId = transactions[transaction.length - 1];
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
    console.log(`created two tasks: ${transaction.name}`);
  });

  return realm.objects('transaction');
};

const editTransaction = async (data, transactionId) => {
  const realm = await Realm.open({
    path: 'myrealm',
    schema: [TransactionSchema],
  });

  let {amount, type, category, note} = data;

  const transactions = realm.objects('transaction');

  const transaction = transactions.filtered(
    `transaction_id = ${transactionId}`,
  )[0];

  realm.write(() => {
    transaction = realm.create('transaction', {
      transaction_id: latestId + 1,
      date: new Date().toISOString(),
      category: category,
      amount: parseInt(amount),
      type: type,
      note: note,
    });
    console.log(`created two tasks: ${transaction.name}`);
  });

  return realm.objects('transaction');
};

const getTransactionById = async id => {
  const realm = await Realm.open({
    path: 'myrealm',
    schema: [TransactionSchema],
  });

  const transactions = realm.objects('transaction');

  const transaction = transactions.filtered(`transaction_id = ${id}`);

  return transaction[0];
};

export {
  getAllTransactions,
  createTransaction,
  getTransactionById,
  editTransaction,
};
