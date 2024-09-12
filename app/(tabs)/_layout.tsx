// app/(tabs)/_layout.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ToDoApp from './index'; // Asegúrate de que la ruta sea correcta

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Tu Lista" component={ToDoApp} />
      {/* Agrega otras pestañas aquí */}
    </Tab.Navigator>
  );
}
