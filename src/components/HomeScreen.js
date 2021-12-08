import * as React from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {FAB, Text, Subheading, useTheme, Colors} from 'react-native-paper';
import {getAllTransactions} from '../repository/index';
import {useSelector} from 'react-redux';
import {getUserId} from '../store/auth';

function HomeScreen({navigation}) {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const [flatListItems, setFlatListItems] = React.useState([]);
  const userId = useSelector(getUserId);

  React.useEffect(() => {
    async function fetchData() {
      const transactions = await getAllTransactions(userId);
      setFlatListItems(transactions);
    }
    fetchData();
  }, []);

  return (
    <>
      <FlatList
        style={styles.container}
        data={flatListItems}
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
                      color:
                        item.type === 'Income'
                          ? Colors.blue900
                          : colors.notification,
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
        onPress={() => navigation.push('Create')}
      />
    </>
  );
}

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
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

export default HomeScreen;
