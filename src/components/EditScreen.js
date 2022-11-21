import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Text,
  Caption,
  useTheme,
  TextInput,
  RadioButton,
  Button,
  ActivityIndicator,
} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {useSelector} from 'react-redux';
import {getUserId} from '../store/auth';
import DatePicker from 'react-native-date-picker';
import TransactionContext, {Transaction} from '../repository/shared';
import {BSON} from 'realm';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

function EditScreen({route, navigation}) {
  const schema = yup.object().shape({
    date: yup.date(),
    amount: yup.number().positive().integer().required('Required'),
    type: yup.string().required('Required'),
    category: yup.string().required('Required'),
    note: yup.string(),
  });

  const {useObject, useRealm} = TransactionContext;

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm({resolver: yupResolver(schema)});

  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const [date, setDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(false);

  const {transactionId} = route.params;

  const defaultData = useObject(Transaction, new BSON.ObjectId(transactionId));
  const realm = useRealm();
  const userId = useSelector(getUserId);

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

  const deleteSubmit = () => {
    realm.write(() => {
      realm.delete(defaultData);
    });
    navigation.navigate('Home');
  };

  return defaultData === null ? (
    <ActivityIndicator />
  ) : (
    <View style={styles.container}>
      <Caption>Date</Caption>
      <View style={styles.row}>
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
      {errors?.date?.message && (
        <Text style={{color: colors.error}}>{errors.date.message}</Text>
      )}
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
      {errors?.amount?.message && (
        <Text style={{color: colors.error}}>{errors.amount.message}</Text>
      )}
      <View style={styles.row}>
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
        {errors?.type?.message && (
          <Text style={{color: colors.error}}>{errors.type.message}</Text>
        )}
      </View>
      <View style={styles.row}>
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
        {errors?.category?.message && (
          <Text style={{color: colors.error}}>{errors.category.message}</Text>
        )}
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
      <View style={styles.row}>
        <Button
          mode="contained"
          title="Submit"
          onPress={handleSubmit(onSubmit)}>
          Save
        </Button>
      </View>

      <View style={styles.row}>
        <Button onPress={() => deleteSubmit()}>Delete</Button>
      </View>
    </View>
  );
}

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      backgroundColor: colors.background,
    },
    col: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    row: {
      marginTop: 8,
      marginBottom: 8,
    },
    input: {
      marginTop: 8,
      marginBottom: 8,
    },
  });

export default EditScreen;
