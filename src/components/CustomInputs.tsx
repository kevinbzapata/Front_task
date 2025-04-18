import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

type CustomInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  toggleSecureEntry?: () => void;
  showToggle?: boolean;
};

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  toggleSecureEntry,
  showToggle = false,
}: CustomInputProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {showToggle && (
          <TouchableOpacity style={styles.toggleButton} onPress={toggleSecureEntry}>
            <Text style={styles.toggleText}>
              {secureTextEntry ? 'Mostrar' : 'Ocultar'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  toggleButton: {
    position: 'absolute',
    right: 16,
  },
  toggleText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CustomInput;