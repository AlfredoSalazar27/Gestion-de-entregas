import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import './src/config/firebase';

import LoginScreen from './src/screens/LoginScreen';
import ListaEnviosScreen from './src/screens/ListaEnviosScreen';
import EntregaScreen from './src/screens/EntregaScreen';
import FirmaScreen from './src/screens/FirmaScreen';
import IntentoFallidoScreen from './src/screens/IntentoFallidoScreen';
import CambioContrasenaScreen from './src/screens/CambioContrasenaScreen';
import EntregadosScreen from './src/screens/EntregadosScreen';
import FallidosScreen from './src/screens/FallidosScreen';
import ScanScreen from './src/screens/ScanScreen';
import { ThemeProvider } from './src/theme/ThemeContext';

export type RootStackParamList = {
  Login: undefined;
  Scan: undefined;
  ListaEnvios:
    | {
        eliminarId?: string;
        tipo?: 'entregado' | 'fallido';
        nombre?: string;
        cedula?: string;
        motivo?: string;
        ubicacion?: string;
        codigoEscaneado?: string;
      }
    | undefined;
  Entrega: {
    numeroEnvio: string;
    envioId?: string;
    firma?: string;
    nombre?: string;
    cedula?: string;
    fotoCedulaFrente?: string;
    fotoCedulaReverso?: string;
    huellaCapturada?: boolean;
  };
  Firma: {
    numeroEnvio: string;
    nombre?: string;
    cedula?: string;
    fotoCedulaFrente?: string;
    fotoCedulaReverso?: string;
    huellaCapturada?: boolean;
    envioId?: string;
  };
  IntentoFallido: {
    numeroEnvio: string;
    envioId?: string;
    envioIds?: string[];
  };
  CambioContrasena: undefined;
  Entregados: {
    items: {
      id: string;
      numero: string;
      destinatario: string;
      direccion: string;
      nombre?: string;
      cedula?: string;
      ubicacion?: string;
      hora?: string;
    }[];
  };
  Fallidos: {
    items: {
      id: string;
      numero: string;
      destinatario: string;
      direccion: string;
      motivo?: string;
      ubicacion?: string;
      hora?: string;
    }[];
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ListaEnvios" component={ListaEnviosScreen} />
          <Stack.Screen name="Entrega" component={EntregaScreen} />
          <Stack.Screen name="Firma" component={FirmaScreen} />
          <Stack.Screen name="IntentoFallido" component={IntentoFallidoScreen} />
          <Stack.Screen name="CambioContrasena" component={CambioContrasenaScreen} />
          <Stack.Screen name="Entregados" component={EntregadosScreen} />
          <Stack.Screen name="Fallidos" component={FallidosScreen} />
          <Stack.Screen name="Scan" component={ScanScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}