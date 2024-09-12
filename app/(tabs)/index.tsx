import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

interface Todo {
  id: string;
  text: string;
  date: Timestamp;
}

const ToDoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [newDate, setNewDate] = useState<string | undefined>(undefined);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [editDate, setEditDate] = useState<string | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const todosCollection = collection(db, 'todos');
      const todoSnapshot = await getDocs(todosCollection);
      const todoList = todoSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Todo[];
      setTodos(todoList);
    } catch (error) {
      console.error('Error fetching todos: ', error);
      Alert.alert('Error', 'No se pudieron cargar las tareas.');
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() !== '' && newDate) {
      try {
        await addDoc(collection(db, 'todos'), {
          text: newTodo,
          date: Timestamp.fromDate(new Date(newDate))
        });
        setNewTodo('');
        setNewDate(undefined);
        fetchTodos();
      } catch (error) {
        console.error('Error adding todo: ', error);
        Alert.alert('Error', 'No se pudo agregar la tarea.');
      }
    } else {
      Alert.alert('Advertencia', 'Por favor completa todos los campos.');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo: ', error);
      Alert.alert('Error', 'No se pudo eliminar la tarea.');
    }
  };

  const startEdit = (todo: Todo) => {
    setEditTodo(todo);
    setEditText(todo.text);
    setEditDate(todo.date.toDate().toISOString().split('T')[0]); // Format to YYYY-MM-DD
    setIsEditing(true);
  };

  const updateTodo = async () => {
    if (editText.trim() !== '' && editDate) {
      try {
        if (editTodo) {
          await updateDoc(doc(db, 'todos', editTodo.id), {
            text: editText,
            date: Timestamp.fromDate(new Date(editDate))
          });
          setEditTodo(null);
          setEditText('');
          setEditDate(undefined);
          setIsEditing(false);
          fetchTodos();
        }
      } catch (error) {
        console.error('Error updating todo: ', error);
        Alert.alert('Error', 'No se pudo actualizar la tarea.');
      }
    } else {
      Alert.alert('Advertencia', 'Por favor completa todos los campos.');
    }
  };

  const showDatepicker = () => {
    setShowCalendar(true);
  };

  const onDayPress = (day: any) => {
    const selectedDate = day.dateString;
    if (isEditing) {
      setEditDate(selectedDate);
    } else {
      setNewDate(selectedDate);
    }
    setShowCalendar(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Tareas</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="Escribe una nueva tarea"
        />
        <TouchableOpacity style={styles.dateButton} onPress={showDatepicker}>
          <Text style={styles.dateButtonText}>{newDate ? newDate : 'Selecciona una fecha'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={addTodo}>
          <Text style={styles.buttonText}>Agregar Tarea</Text>
        </TouchableOpacity>
      </View>

      {isEditing && editTodo && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={editText}
            onChangeText={setEditText}
            placeholder="Edita la tarea"
          />
          <TouchableOpacity style={styles.dateButton} onPress={showDatepicker}>
            <Text style={styles.dateButtonText}>{editDate ? editDate : 'Selecciona una fecha'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={updateTodo}>
            <Text style={styles.buttonText}>Actualizar Tarea</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={todos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text style={styles.todoText}>{item.text}</Text>
            <Text style={styles.todoDate}>{item.date.toDate().toLocaleDateString()}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton} onPress={() => startEdit(item)}>
                <Text style={styles.actionButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => deleteTodo(item.id)}>
                <Text style={styles.actionButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {showCalendar && (
        <Modal
          transparent={true}
          visible={showCalendar}
          onRequestClose={() => setShowCalendar(false)}
        >
          <View style={styles.modalContainer}>
            <Calendar
              onDayPress={onDayPress}
              markedDates={{
                [newDate || '']: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedColor: 'blue'
                }
              }}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  inputContainer: {
    marginBottom: 16
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  dateButton: {
    backgroundColor: '#e9ecef',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  dateButtonText: {
    color: '#333',
    fontSize: 16
  },
  todoItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1
  },
  todoText: {
    fontSize: 16,
    marginBottom: 4
  },
  todoDate: {
    fontSize: 14,
    color: '#888'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  actionButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  }
});

export default ToDoApp;
