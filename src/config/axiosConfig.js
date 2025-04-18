import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.0.107:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    console.log('Token recuperado:', token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('URL de solicitud:', config.url);
      console.log('Cabeceras de solicitud:', JSON.stringify(config.headers));
    } else {
      console.log('No se encontró token para la solicitud a:', config.url);
    }
    return config;
  },
  (error) => {
    console.log('Error en la solicitud:', error);
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Respuesta exitosa de:', response.config.url);
    return response.data;
  },
  (error) => {
    console.log('Error de respuesta completo:', error);
    if (error.response) {
      console.log('URL con error:', error.config?.url);
      console.log('Estado de error:', error.response.status);
      console.log('Datos de error:', error.response.data);
      return Promise.reject({
        message: error.response.data?.message || 'Error desconocido',
        status: error.response.status,
        data: error.response.data
      });
    }
    console.log('Error de conexión para URL:', error.config?.url);
    return Promise.reject({
      message: 'Error de conexión'
    });
  }
);

export default axiosInstance;