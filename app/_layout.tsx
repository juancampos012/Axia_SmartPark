
import { Drawer } from 'expo-router/drawer';
import "../global.css";

export default function AppLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ title: 'Inicio', drawerLabel:'Inicio' }} />
      <Drawer.Screen name="(home)" options={{ title: 'Home', drawerLabel: 'Home' }} />
      <Drawer.Screen name="parkings" options={{ title: 'Estacionamientos' }} />
      <Drawer.Screen name="payment" options={{ title: 'Pagos' }} />
      <Drawer.Screen name="reservation" options={{ title: 'Reservas' }} />
      <Drawer.Screen name="tabs" options={{ title: 'Más' }} />
    </Drawer>
  );
}