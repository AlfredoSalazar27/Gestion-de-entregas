import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StatusBar,
  Vibration,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from '../../App';
import * as Location from 'expo-location';
import { useTheme } from '../theme/ThemeContext';


type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Entrega'>;
  route: RouteProp<RootStackParamList, 'Entrega'>;
};

export default function EntregaScreen({ navigation, route }: Props) {
  const { numeroEnvio } = route.params;
  const [envioId, setEnvioId] = useState(route.params.envioId);

  const [nombre, setNombre] = useState(route.params.nombre || '');
  const [cedula, setCedula] = useState(route.params.cedula || '');
  const [fotoCedulaFrente, setFotoCedulaFrente] = useState<string | null>(route.params.fotoCedulaFrente || null);
  const [fotoCedulaReverso, setFotoCedulaReverso] = useState<string | null>(route.params.fotoCedulaReverso || null);
  const [firma, setFirma] = useState<string | null>(route.params.firma || null);
  const [huellaCapturada, setHuellaCapturada] = useState(route.params.huellaCapturada || false);
  const { mode, colors, toggleTheme } = useTheme();

  useEffect(() => {
    if (route.params.firma) {
      setFirma(route.params.firma);
    }
    if (route.params.huellaCapturada !== undefined) {
      setHuellaCapturada(route.params.huellaCapturada);
    }
    if (route.params.nombre) setNombre(route.params.nombre);
    if (route.params.cedula) setCedula(route.params.cedula);
    if (route.params.fotoCedulaFrente) setFotoCedulaFrente(route.params.fotoCedulaFrente);
    if (route.params.fotoCedulaReverso) setFotoCedulaReverso(route.params.fotoCedulaReverso);
    if (route.params.envioId) {
      setEnvioId(route.params.envioId);
    }
  }, [route.params]);

  const tomarFoto = async (tipo: 'frente' | 'reverso') => {
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
      const uri = resultado.assets[0].uri;
      if (tipo === 'frente') setFotoCedulaFrente(uri);
      if (tipo === 'reverso') setFotoCedulaReverso(uri);
    }
  };

  const irAFirmar = () => {
    navigation.navigate('Firma', {
      numeroEnvio,
      nombre,
      cedula,
      fotoCedulaFrente: fotoCedulaFrente || undefined,
      fotoCedulaReverso: fotoCedulaReverso || undefined,
      huellaCapturada,
      envioId: envioId,
    });
  };

 const handleConfirmar = async () => {
    if (!nombre.trim() || !cedula.trim()) {
      Alert.alert('Datos incompletos', 'Debes ingresar el nombre y la cédula');
      return;
    }

    if (cedula.length < 9) {
      Alert.alert('Cédula inválida', 'La cédula debe tener al menos 9 dígitos');
      return;
    }
    Vibration.vibrate(80);
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
        '✅ Entrega exitosa',
        `El paquete se registró correctamente.\n\n` +
          `Guía: ${numeroEnvio}\n` +
          `Recibió: ${nombre}\n` +
          `Cédula: ${cedula}\n` +
          `Ubicación: ${ubicacionTexto}`,
        [
          {
            text: 'Listo',
            onPress: () => {
              navigation.navigate('ListaEnvios', {
                eliminarId: envioId,
                tipo: 'entregado',
                nombre: nombre,
                cedula: cedula,
                ubicacion: ubicacionTexto,
              });
            },
          },
        ]
      );
    } catch (error) {
            Alert.alert(
        '✅ Entrega exitosa',
        `El paquete se registró correctamente.\n\n` +
          `Guía: ${numeroEnvio}\n` +
          `Recibió: ${nombre}\n` +
          `Cédula: ${cedula}`,
        [
          {
            text: 'Listo',
            onPress: () => {
              navigation.navigate('ListaEnvios', {
                eliminarId: envioId,
                tipo: 'entregado',
                nombre: nombre,
                cedula: cedula,
                ubicacion: 'No se pudo obtener',
              });
            },
          },
        ]
      );
    }
  };

  const handleFallido = () => {
    navigation.navigate('IntentoFallido', {
      numeroEnvio,
      envioId: envioId,
    });
  };

    return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { backgroundColor: '#E65100' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Confirmar Entrega</Text>
          <Text style={styles.numeroEnvio}>{numeroEnvio}</Text>
        </View>
        <TouchableOpacity onPress={toggleTheme} style={styles.backButton}>
          <Text style={{ fontSize: 22 }}>{mode === 'light' ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: '#E65100' }]}>
         Datos de quien recibe
        </Text>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Nombre completo</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="👤 Nombre de quien recibe"
          placeholderTextColor={colors.textSecondary}
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Número de cédula</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="🪪 Número de identificación"
          placeholderTextColor={colors.textSecondary}
          value={cedula}
          onChangeText={(texto) => {
            const soloNumeros = texto.replace(/[^0-9]/g, '');
            setCedula(soloNumeros);
          }}
          keyboardType="numeric"
          maxLength={12}
        />

        <Text style={[styles.sectionTitle, { marginTop: 24, color: '#E65100' }]}>
         Evidencias
        </Text>

        <View style={styles.evidenciasGrid}>
          <TouchableOpacity
            style={[styles.evidenciaCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => tomarFoto('frente')}
          >
            {fotoCedulaFrente ? (
              <Image source={{ uri: fotoCedulaFrente }} style={styles.preview} />
            ) : (
              <>
                <Text style={styles.evidenciaIcon}>📷</Text>
                <Text style={[styles.evidenciaText, { color: colors.textSecondary }]}>
                  Cédula Frente
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.evidenciaCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => tomarFoto('reverso')}
          >
            {fotoCedulaReverso ? (
              <Image source={{ uri: fotoCedulaReverso }} style={styles.preview} />
            ) : (
              <>
                <Text style={styles.evidenciaIcon}>📷</Text>
                <Text style={[styles.evidenciaText, { color: colors.textSecondary }]}>
                  Foto del paquete
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.evidenciaCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              huellaCapturada && styles.evidenciaCardSuccess,
            ]}
            onPress={() => {
              Alert.alert(
                'Captura de Huella',
                '¿Confirmas que se tomó la huella del destinatario?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Sí, capturada',
                    onPress: () => setHuellaCapturada(true),
                  },
                ]
              );
            }}
          >
            {huellaCapturada ? (
              <>
                <Text style={styles.evidenciaIcon}>✅</Text>
                <Text style={[styles.evidenciaText, { color: colors.success }]}>
                  Huella Capturada
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.evidenciaIcon}>🫆</Text>
                <Text style={[styles.evidenciaText, { color: colors.textSecondary }]}>
                  Huella
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.evidenciaCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={irAFirmar}
          >
            {firma ? (
              <Image source={{ uri: firma }} style={styles.preview} resizeMode="contain" />
            ) : (
              <>
                <Text style={styles.evidenciaIcon}>🖊️</Text>
                <Text style={[styles.evidenciaText, { color: colors.textSecondary }]}>
                  Firma Cliente
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.fallidoButton} onPress={handleFallido}>
          <Text style={styles.fallidoText}>FALLIDO</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirmarButton} onPress={handleConfirmar}>
          <Text style={styles.confirmarText}>CONFIRMAR ENTREGA</Text>
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
    color: '#fff',
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
    color: '#003366',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  evidenciasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  evidenciaCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  evidenciaCardSuccess: {
    borderColor: '#2e7d32',
    borderWidth: 2,
    backgroundColor: '#e8f5e9',
  },
  evidenciaIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  evidenciaText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 10,
  },
  fallidoButton: {
    flex: 1,
    backgroundColor: '#d32f2f',
    borderWidth: 1.5,
    borderColor: '#d32f2f',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  fallidoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  confirmarButton: {
    flex: 2,
    backgroundColor: '#2e7d32',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});