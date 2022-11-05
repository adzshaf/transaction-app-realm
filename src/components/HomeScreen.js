import * as React from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {FAB, Text, Subheading, useTheme, Colors} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {getUserId} from '../store/auth';
import {useIsFocused} from '@react-navigation/native';
import TransactionContext, {Transaction} from '../repository/shared';
import {logger} from 'react-native-logs';

function HomeScreen({navigation}) {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const [flatListItems, setFlatListItems] = React.useState([]);
  const userId = useSelector(getUserId);
  var log = logger.createLogger();
  let startTime = new Date();

  const {useQuery} = TransactionContext;
  const transactions = useQuery(Transaction);

  console.log(transactions.sorted('date', true));
  let endTime = new Date();
  let costTime = (endTime - startTime) / 1000;

  log.info('SYNC TIME: ' + costTime);

  // React.useEffect(() => {
  //   async function fetchData() {
  //     const transactions = await getAllTransactions(userId);
  //     return transactions;
  //   }

  //   fetchData()
  //     .then(transactions => {
  //       setFlatListItems([...transactions]);
  //     })
  //     .catch(err => console.log(err));

  //   // try {
  //   //   const transactions = fetchData();
  //   //   setFlatListItems([...transactions]);
  //   //   transactions.addListener(() => {
  //   //     setFlatListItems([...transactions]);
  //   //   });
  //   // } catch (err) {
  //   //   console.log('error', err);
  //   // }
  // }, [isFocused]);

  return (
    <>
      <FlatList
        style={styles.container}
        data={transactions.sorted('date', true)}
        renderItem={({item}) => (
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Edit', {
                  transactionId: item._id.toString(),
                })
              }>
              <Subheading>
                {new Date(item.date).toLocaleDateString('id-ID')}
              </Subheading>
              <View style={styles.col}>
                <View>
                  <Text>Type: {item.type}</Text>
                  <Text>Category: {item.category}</Text>
                  <Text>Note: {item.note ? item.note : '-'}</Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: item.type === 'Income' ? '#338BA8' : '#FF5C5C',
                    }}>
                    Amount: {item.amount}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item._id}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('Create')}
      />
    </>
  );
}

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      backgroundColor: colors.surfaceVariant,
    },
    col: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    row: {
      padding: 15,
      marginBottom: 5,
      backgroundColor: colors.background,
      borderRadius: 15,
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
  });

export default HomeScreen;
