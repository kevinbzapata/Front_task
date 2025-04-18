import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Spinner = () => {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', 
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default Spinner;
