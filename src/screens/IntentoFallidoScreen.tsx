import React, { useState } from 'react';
import { View,Text,StyleSheet,TouchableOpacity,ScrollView,TextInput,Image,Alert,StatusBar,Vibration,} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from '../../App';
import * as Location from 'expo-location';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'IntentoFallido'>;
  route: RouteProp<RootStackParamList, 'IntentoFallido'>;
};

const MOTIVOS = [
  'Destinatario Ausente',
  'Dirección Incorrecta',
  'Desconocido',
  'Envío rechazado por el destinatario',
];

export default function IntentoFallidoScreen({ navigation, route }: Props) {
  const { numeroEnvio } = route.params;
  const { mode, colors, toggleTheme } = useTheme();
  
  // Si vienen varios ids, los usamos; si no, solo el envioId
  const idsAEliminar: string[] =
    route.params.envioIds && route.params.envioIds.length > 0
      ? route.params.envioIds
      : route.params.envioId
      ? [route.params.envioId]
      : [];

  const [motivoSeleccionado, setMotivoSeleccionado] = useState<string | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [avisado, setAvisado] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);

  const tomarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso necesario', 'Necesitamos acceso a la cámara');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!resultado.canceled && resultado.assets[0]) {
      setFoto(resultado.assets[0].uri);
    }
  };

  const registrarFallidos = (ubicacionTexto: string) => {
    if (idsAEliminar.length === 0) {
      navigation.navigate('ListaEnvios');
      return;
    }

    // Por ahora registramos el primero; ListaEnvios procesa uno por navegación.
    // Si hay más de uno, el usuario puede volver a marcar los restantes.
       navigation.navigate('ListaEnvios', {
       eliminarId: route.params.envioId, // o eliminarIds si usas varios
       tipo: 'fallido',
       motivo: motivoSeleccionado || undefined,
       ubicacion: ubicacionTexto,
     });
  };

  const handleAceptar = async () => {
    if (!motivoSeleccionado) {
      Alert.alert('Atención', 'Debes seleccionar un motivo');
      return;
    }

    Vibration.vibrate(80);

    const cantidad = idsAEliminar.length;
    const textoCantidad =
      cantidad > 1 ? `\n\nSe marcarán ${cantidad} envíos como fallidos (el primero ahora).` : '';

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let ubicacionTexto = 'No disponible';

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const { latitude, longitude } = location.coords;
        ubicacionTexto = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      }

      Alert.alert(
        '⚠️ Intento fallido',
        `Envío: ${numeroEnvio}\nMotivo: ${motivoSeleccionado}\nUbicación: ${ubicacionTexto}${
          observaciones ? `\nObservaciones: ${observaciones}` : ''
        }${textoCantidad}`,
        [
          {
            text: 'Listo',
            onPress: () => registrarFallidos(ubicacionTexto),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        '⚠️ Intento fallido',
        `Envío: ${numeroEnvio}\nMotivo: ${motivoSeleccionado}${textoCantidad}`,
        [
          {
            text: 'Listo',
            onPress: () => registrarFallidos('No se pudo obtener'),
          },
        ]
      );
    }
  };

    return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
     <StatusBar barStyle="light-content" />

      <View style={[styles.header, { backgroundColor: '#E65100' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Intento Fallido</Text>
          <Text style={styles.numeroEnvio}>
            {numeroEnvio}
            {idsAEliminar.length > 1 ? ` (+${idsAEliminar.length - 1} más)` : ''}
          </Text>
        </View>

        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <Text style={{ fontSize: 22 }}>{mode === 'light' ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Motivo del intento fallido</Text>

        {MOTIVOS.map((motivo) => (
          <TouchableOpacity
            key={motivo}
            style={[
              styles.motivoButton,
              motivoSeleccionado === motivo && styles.motivoSeleccionado,
            ]}
            onPress={() => setMotivoSeleccionado(motivo)}
          >
            <Text
              style={[
                styles.motivoText,
                motivoSeleccionado === motivo && styles.motivoTextSeleccionado,
              ]}
            >
              {motivo}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Observaciones (opcional)</Text>
        <TextInput
          style={styles.observacionesInput}
          placeholder="Escribe alguna observación adicional..."
          placeholderTextColor="#999"
          value={observaciones}
          onChangeText={setObservaciones}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Foto (opcional)</Text>
        <TouchableOpacity style={styles.fotoButton} onPress={tomarFoto}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.fotoPreview} />
          ) : (
            <>
              <Text style={styles.fotoIcon}>📷</Text>
              <Text style={styles.fotoText}>Tomar Foto</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.aceptarButton} onPress={handleAceptar}>
          <Text style={styles.aceptarText}>ACEPTAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    backgroundColor: '#E65100',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
    headerCenter: {
    flex: 1,
    marginLeft: 4,
    marginRight: 4,
  },
  themeButton: {
    padding: 8,
    marginLeft: 4,
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
  },
  numeroEnvio: {
    color: '#a0c4e8',
    fontSize: 14,
    marginTop: 2,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 12,
  },
  motivoButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  motivoSeleccionado: {
    backgroundColor: '#e8f5e9',
    borderColor: '#2e7d32',
    borderWidth: 2,
  },
  motivoText: {
    fontSize: 14,
    color: '#333',
  },
  motivoTextSeleccionado: {
    color: '#1b5e20',
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#2e7d32',
    borderColor: '#2e7d32',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  observacionesInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    minHeight: 90,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  fotoButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  fotoIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  fotoText: {
    fontSize: 14,
    color: '#555',
  },
  fotoPreview: {
    width: '100%',
    height: '100%',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  aceptarButton: {
    backgroundColor: '#E65100',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  aceptarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});