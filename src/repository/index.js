import Realm, {BSON} from 'realm';
import app from '../shared/realmApp';
import 'react-native-get-random-values';

const TransactionSchema = {
  name: 'Transaction',
  properties: {
    _id: 'objectId',
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
        existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
      },
    });

    let transactions = realm.objects('Transaction');
    return transactions.sorted('date', true);
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
      existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
    },
  });

  let {amount, type, category, note, date} = data;
  let transaction;

  realm.write(() => {
    transaction = realm.create('Transaction', {
      _id: new BSON.ObjectId(),
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
      newRealmFileBehavior: OpenRealmBehaviorConfiguration,
      existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
    },
  });

  let {amount, type, category, note, date} = data;

  const transaction = realm.objectForPrimaryKey(
    'Transaction',
    new BSON.ObjectId(transactionId),
  );

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
      newRealmFileBehavior: OpenRealmBehaviorConfiguration,
      existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
    },
  });

  let transaction = realm.objectForPrimaryKey(
    'Transaction',
    new BSON.ObjectId(transactionId),
  );

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
      newRealmFileBehavior: OpenRealmBehaviorConfiguration,
      existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
    },
  });

  const transaction = realm.objectForPrimaryKey(
    'Transaction',
    new BSON.ObjectId(id),
  );

  return transaction;
};

export {
  getAllTransactions,
  createTransaction,
  getTransactionById,
  editTransaction,
  deleteTransaction,
};
