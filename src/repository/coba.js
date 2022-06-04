const realm = await Realm.open({
  schema: [TransactionSchema],
  sync: {
    user: app.currentUser,
    partitionValue: userId,
    newRealmFileBehavior: OpenRealmBehaviorConfiguration,
    existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
  },
});
