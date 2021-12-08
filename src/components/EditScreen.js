import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  FAB,
  Title,
  Text,
  Caption,
  useTheme,
  TextInput,
  RadioButton,
  Button,
  ActivityIndicator,
} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {
  getTransactionById,
  editTransaction,
  deleteTransaction,
} from '../repository';
import {useSelector} from 'react-redux';
import {getUserId} from '../store/auth';
import DatePicker from 'react-native-date-picker';

function EditScreen({route, navigation}) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();

  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const [date, setDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(false);

  const {transactionId} = route.params;
  const [defaultData, setDefaultData] = React.useState(null);
  const userId = useSelector(getUserId);

  const onSubmit = async data => {
    const response = await editTransaction(data, transactionId, userId);
    navigation.push('Home');
  };

  const deleteSubmit = async () => {
    const response = await deleteTransaction(transactionId, userId);
    navigation.push('Home');
  };

  React.useEffect(() => {
    async function fetchData() {
      const transaction = await getTransactionById(transactionId, userId);
      setDefaultData(transaction);
    }
    fetchData();
    // db.transaction(function (txn) {
    //   txn.executeSql(
    //     'SELECT * FROM table_transaction WHERE transaction_id = ?',
    //     [transactionId],
    //     (tx, results) => {
    //       let temp = [];
    //       for (let i = 0; i < results.rows.length; ++i) {
    //         temp.push(results.rows.item(i));
    //       }

    //       if (temp.length > 0) {
    //         setDefaultData(temp[0]);
    //       }
    //     },
    //   );
    // });
  }, []);

  return defaultData === null ? (
    <ActivityIndicator />
  ) : (
    <View style={styles.container}>
      <Caption>Date</Caption>
      <View>
        <Text onPress={() => setOpen(true)}>
          {new Date(date).toLocaleDateString('id-ID')}
        </Text>
      </View>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <DatePicker
            modal
            open={open}
            date={date}
            onConfirm={date => {
              setOpen(false);
              setDate(date);
              onChange(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
            mode="date"
          />
        )}
        name="date"
        defaultValue=""
      />
      <Controller
        control={control}
        rules={{
          required: false,
        }}
        render={({field: {onChange, onBlur, value}}) => {
          return (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
              value={value}
              label="Amount"
            />
          );
        }}
        name="amount"
        defaultValue={defaultData.amount.toString()}
      />
      <View>
        <Caption>Type</Caption>
        <Controller
          control={control}
          rules={{
            required: false,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <RadioButton.Group
              onValueChange={newValue => onChange(newValue)}
              value={value}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton value="Income" />
                <Text>Income</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton value="Expense" />
                <Text>Expense</Text>
              </View>
            </RadioButton.Group>
          )}
          name="type"
          defaultValue={defaultData.type}
        />
      </View>
      <View>
        <Caption>Category</Caption>
        <Controller
          control={control}
          rules={{
            required: false,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <RadioButton.Group
              onValueChange={newValue => onChange(newValue)}
              value={value}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton value="Food" />
                <Text>Food</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton value="Holiday" />
                <Text>Holiday</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton value="Culture" />
                <Text>Culture</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton value="Health" />
                <Text>Health</Text>
              </View>
            </RadioButton.Group>
          )}
          name="category"
          defaultValue={defaultData.category}
        />
      </View>
      <Controller
        control={control}
        rules={{
          required: false,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            label="Note"
          />
        )}
        name="note"
        defaultValue={defaultData.note}
      />
      <Button mode="contained" title="Submit" onPress={handleSubmit(onSubmit)}>
        Save
      </Button>

      <Button onPress={() => deleteSubmit()}>Delete</Button>
    </View>
  );
}

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
    },
    col: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    row: {
      padding: 15,
      marginBottom: 5,
      backgroundColor: colors.background,
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: colors.notification,
    },
  });

export default EditScreen;
