import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import axiosInstance from '../config/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewTaskModal from '../components/NewTaskModal';

type RootStackParamList = {
  Login: undefined;
  Tasks: undefined;
};

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'PENDING' | 'COMPLETED';  
}

const TaskScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  const [tasks, setTasks] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isNewTaskModalVisible, setIsNewTaskModalVisible] = useState(false);

  // Obtener tareas
  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get('/tasks');
      console.log("Tareaas::" , response);
      
      setTasks(response);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'No se pudieron cargar las tareas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Marcar tarea como completada
  const updateTask = async (task: Task) => {
    try {
      
      const updatedTask = {
        title: task.title,
        description: task.description,
        status: task.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED'
      };
  
      await axiosInstance.put(`/tasks/${task.id}`, updatedTask);
      
      // Actualiza la lista
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'No se pudo actualizar la tarea');
    }
  };

  const deleteTask = async (taskId: string) => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          onPress: async () => {
            try {
              await axiosInstance.delete(`/tasks/${taskId}`);
              fetchTasks();
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('Error', 'No se pudo eliminar la tarea');
            }
          } 
        }
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
  
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  
  const openNewTaskModal = () => {
    setIsNewTaskModalVisible(true);
  };

  const closeNewTaskModal = () => {
    setIsNewTaskModalVisible(false);
  };
  
  const handleTaskCreated = () => {
    fetchTasks();
  };

  //Listar tareas
  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskContent}>
        <Text style={[styles.taskText, ]}>
          {item.title}
        </Text>
        <Text style={styles.taskDate}>{item.status}</Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            item.status === 'COMPLETED' ? styles.finishButton : styles.completeButton
          ]}
          onPress={() => updateTask(item)}
        >
           <Text style={styles.actionButtonText}>
              {item.status === 'COMPLETED' ? 'Finalizada' : 'Completar'}
            </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteTask(item.id.toString())}
        >
          <Text style={styles.actionButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleLogout}
          style={{ marginLeft: 'auto' }}
        >
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3F51B5" />
          <Text style={styles.loadingText}>Cargando tareas...</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchTasks();
              }}
              colors={['#3F51B5']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay tareas pendientes</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={openNewTaskModal}
      >
        <Text style={styles.addButtonText}>+ Nueva Tarea</Text>
      </TouchableOpacity>

      <NewTaskModal
        visible={isNewTaskModalVisible}
        onClose={closeNewTaskModal}
        onTaskCreated={handleTaskCreated}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#3F51B5',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#F44336',
    borderRadius: 4,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'right'
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskContent: {
    marginBottom: 12,
  },
  taskText: {
    fontSize: 16,
    color: '#212121',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  taskDate: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  finishButton: {
    backgroundColor: '#007AFF', 
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#3F51B5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#3F51B5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#9E9E9E',
    fontSize: 16,
  },
});

export default TaskScreen;