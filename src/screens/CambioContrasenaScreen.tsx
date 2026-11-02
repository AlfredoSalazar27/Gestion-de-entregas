import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CambioContrasena'>;
};

export default function CambioContrasenaScreen({ navigation }: Props) {
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const { mode, colors, toggleTheme } = useTheme();

  const handleCambiar = async () => {
    try {
      // Obtenemos la contraseña guardada (si no hay, usamos la por defecto)
      const contrasenaGuardada = (await AsyncStorage.getItem('contrasena')) || '1234';

      if (contrasenaActual.trim() !== contrasenaGuardada) {
        Alert.alert('Error', 'La contraseña actual es incorrecta');
        return;
      }

      if (nuevaContrasena.trim().length < 4) {
        Alert.alert('Error', 'La nueva contraseña debe tener al menos 4 caracteres');
        return;
      }

      if (nuevaContrasena !== confirmarContrasena) {
        Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
        return;
      }

      // Guardamos la nueva contraseña
      await AsyncStorage.setItem('contrasena', nuevaContrasena.trim());

      Alert.alert('Éxito', 'Contraseña actualizada correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar la contraseña');
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cambio de Contraseña</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.backButton}>
          <Text style={{ fontSize: 22 }}>{mode === 'light' ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.form, { backgroundColor: colors.card }]}>
        <Text style={[styles.label, { color: colors.text }]}>Contraseña actual</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBg,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="🔒 Ingresa tu contraseña actual"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={contrasenaActual}
          onChangeText={setContrasenaActual}
        />

        <Text style={[styles.label, { color: colors.text }]}>Nueva contraseña</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBg,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="🔒 Ingrese la contraseña nueva"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={nuevaContrasena}
          onChangeText={setNuevaContrasena}
        />

        <Text style={[styles.label, { color: colors.text }]}>Confirmar nueva contraseña</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBg,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="🔒 Confirme la nueva contraseña"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={confirmarContrasena}
          onChangeText={setConfirmarContrasena}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#E65100' }]}
          onPress={handleCambiar}
          >
           <Text style={styles.buttonText}>GUARDAR CAMBIOS</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 8,
  },
  form: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 24,
    elevation: 3,
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
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});