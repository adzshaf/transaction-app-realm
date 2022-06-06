import {Realm, createRealmContext} from '@realm/react';

export class Transaction extends Realm.Object {
  static generate(data, userId) {
    let {amount, type, category, note, date} = data;

    return {
      _id: new Realm.BSON.ObjectId(),
      date: date.toISOString(),
      category: category,
      amount: parseInt(amount),
      type: type,
      note: note,
      _partition: userId,
    };
  }

  static schema = {
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
}

const config = {
  schema: [Transaction],
};

export default createRealmContext(config);
