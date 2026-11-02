import React, { useState } from 'react';
import { View, Text,TextInput,TouchableOpacity,StyleSheet, KeyboardAvoidingView,Platform,StatusBar,} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';
import { useTheme } from '../theme/ThemeContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const { mode, colors, toggleTheme } = useTheme();

    const handleLogin = async () => {
    if (!usuario.trim() || !contrasena.trim()) {
      alert('Ingresa usuario y contraseña');
      return;
    }

    try {
      // Tú escribes US0604360138 → Firebase usa el correo
      const email = `${usuario.trim()}@mensajeria.app`;

      await signInWithEmailAndPassword(auth, email, contrasena.trim());

      navigation.replace('ListaEnvios');
    } catch (error: any) {
      console.log(error.code);
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        alert('Usuario o contraseña incorrectos');
      } else if (error.code === 'auth/invalid-email') {
        alert('Usuario inválido');
      } else {
        alert('Error al iniciar sesión. Intenta de nuevo.');
      }
    }
  };

    return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#E65100' }]}>
        <TouchableOpacity
          style={{ position: 'absolute', right: 20, top: 50 }}
          onPress={toggleTheme}
        >
          <Text style={{ fontSize: 24 }}>{mode === 'light' ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>

        <Text style={styles.logoText}>📦</Text>
        <Text style={styles.appName}>Gestión de Entregas</Text>
      </View>

      {/* Formulario */}
      <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.label, { color: colors.text }]}>Usuario</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBg,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="👤 Ingresa tu usuario"
          placeholderTextColor={colors.textSecondary}
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
        />

        <Text style={[styles.label, { color: colors.text }]}>Contraseña</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBg,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="🔒 Ingresa tu contraseña"
          placeholderTextColor={colors.textSecondary}
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />

        <TouchableOpacity
           style={[styles.button, { backgroundColor: '#E65100' }]}
           onPress={handleLogin}
          >
         <Text style={styles.buttonText}>Ingresar</Text>
       </TouchableOpacity>

        <TouchableOpacity
          style={styles.changePassword}
          onPress={() => navigation.navigate('CambioContrasena')}
        >
          <Text style={[styles.changePasswordText, { color: '#E65100' }]}>
           Cambiar contraseña
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.version, { color: colors.textSecondary }]}>
        Versión 1.0.0
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#E65100',
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  logoSubtext: {
    color: '#f8f8f8',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  appName: {
    color: '#fff',
    fontSize: 20,
    marginTop: 16,
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 12,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 18,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#E65100',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  changePassword: {
    marginTop: 16,
    alignItems: 'center',
  },
  changePasswordText: {
    color: '#E65100',
    fontSize: 14,
  },
  version: {
    textAlign: 'center',
    color: '#999',
    marginTop: 30,
    fontSize: 12,
  },
});