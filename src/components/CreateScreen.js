import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Text,
  Caption,
  useTheme,
  TextInput,
  RadioButton,
  Button,
} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {useSelector} from 'react-redux';
import {getUserId} from '../store/auth';
import DatePicker from 'react-native-date-picker';
import TransactionContext, {Transaction} from '../repository/shared';
import {useUser} from '@realm/react';

function CreateScreen({navigation}) {
  const {useRealm} = TransactionContext;
  const realm = useRealm();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();

  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const userId = useSelector(getUserId);
  const user = useUser();

  const [date, setDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(false);

  const onSubmit = data => {
    realm.write(() => {
      realm.create('Transaction', Transaction.generate(data, user?.id));
    });
    navigation.navigate('Home');
  };

  return (
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
      <View style={styles.row}>
        <Controller
          control={control}
          rules={{
            required: true,
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
          defaultValue=""
        />
      </View>
      <View style={styles.row}>
        <Caption>Type</Caption>
        <Controller
          control={control}
          rules={{
            required: true,
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
        />
      </View>
      <View style={styles.row}>
        <Caption>Category</Caption>
        <Controller
          control={control}
          rules={{
            required: true,
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
        defaultValue=""
      />
      <View style={styles.row}>
        <Button
          mode="contained"
          title="Submit"
          onPress={handleSubmit(onSubmit)}>
          Save
        </Button>
      </View>
    </View>
  );
}

const makeStyles = () =>
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
      marginBottom: 8,
      marginTop: 8,
    },
    input: {
      marginTop: 8,
      marginBottom: 8,
    },
  });

export default CreateScreen;
