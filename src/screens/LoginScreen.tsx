import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import CustomInput from '../components/CustomInputs';
import CustomButton from '../components/CustomButton';
import CustomAlert from '../components/CustomAlert';
import axiosInstance from '../config/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Login: undefined;
  Tasks: undefined;
};

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const validateFields = (): boolean => {
    if (!username.trim()) {
      showAlert('Campos vacíos', 'Por favor, ingresa tu usuario');
      return false;
    }
    
    if (!password.trim()) {
      showAlert('Campos vacíos', 'Por favor, ingresa tu contraseña');
      return false;
    }
    
    return true;
  };

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleLogin = async () => {
    if (!validateFields()) return;
    
    try {
      setLoading(true);
      const response: any = await axiosInstance.post('/auth/signin', {
        username,
        password
      });

      if (response.accessToken) {
        await AsyncStorage.setItem('accessToken', response.accessToken);
        navigation.navigate('Tasks');
      } else {
        showAlert('Error de autenticación', 'No se pudo obtener el token de acceso');
      }
    } catch (error) {
      console.error('Error completo:', error);
      showAlert('Error de inicio de sesión', 'Usuario y/o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Image
            source={require('../assets/iconLogin.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

          <View style={styles.form}>
            <CustomInput
              label="Usuario"
              value={username}
              onChangeText={setUsername}
              placeholder="username"
            />

            <CustomInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={secureTextEntry}
              showToggle
              toggleSecureEntry={() => setSecureTextEntry(!secureTextEntry)}
            />

            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <CustomButton
              title="Iniciar Sesión"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
            <TouchableOpacity>
              <Text style={styles.signUpText}> Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  signUpText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;