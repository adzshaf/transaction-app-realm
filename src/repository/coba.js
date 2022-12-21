const {useRealm} = TransactionContext;
const realm = useRealm();

const onSubmit = data => {
  let {amount, type, category, note, date} = data;
  realm.write(() => {
    defaultData.date = date.toISOString();
    defaultData.amount = parseInt(amount);
    defaultData.type = type;
    defaultData.category = category;
    defaultData.note = note;
  });
  navigation.navigate('Home');
};
