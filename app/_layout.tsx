// app/_layout.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ToDoApp from './(tabs)/index'; // Asegúrate de que la ruta sea correcta
import TabsLayout from './(tabs)/_layout'; // Asegúrate de que la ruta sea correcta

const Stack = createNativeStackNavigator();

export default function Layout() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="index" component={ToDoApp} options={{ title: 'ToDo List' }} />
      <Stack.Screen name="(tabs)" component={TabsLayout} options={{ title: 'Hola Gerson UwU' }} />
    </Stack.Navigator>
  );
}
