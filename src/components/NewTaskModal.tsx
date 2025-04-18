import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import axiosInstance from '../config/axiosConfig';

interface NewTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ visible, onClose, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Resetear el formulario
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setError('');
  };

  // Cerrar modal y resetear
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Validar formulario
  const validateForm = (): boolean => {
    if (!title.trim()) {
      setError('El título es obligatorio');
      return false;
    }
    
    if (!description.trim()) {
      setError('La descripción es obligatoria');
      return false;
    }
    
    return true;
  };

  // Guardar tarea
  const handleSaveTask = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const newTask = {
        title: title.trim(),
        description: description.trim(),
        status: 'IN_PROGRESS'  
      };
      
      await axiosInstance.post('/tasks', newTask);
      
      
      onTaskCreated();
      
      // Cerrar modal y limpiar formulario
      handleClose();
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      setError('No se pudo crear la tarea. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nueva Tarea</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.formContainer}>
              {/* Campo Título */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Título</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa el título de la tarea"
                  placeholderTextColor="#9E9E9E"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
              
              {/* Campo Descripción */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Descripción</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Ingresa la descripción de la tarea"
                  placeholderTextColor="#9E9E9E"
                  value={description}
                  onChangeText={setDescription}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              
              {/* Mensaje de error */}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              
              {/* Botones */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleClose}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSaveTask}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.saveButtonText}>Guardar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3F51B5',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#212121',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#3F51B5',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#757575',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default NewTaskModal;