import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Firma'>;
  route: RouteProp<RootStackParamList, 'Firma'>;
};

export default function FirmaScreen({ navigation, route }: Props) {
  const ref = useRef<any>(null);

  const handleOK = (signature: string) => {
  navigation.navigate({
    name: 'Entrega',
    params: {
      numeroEnvio: route.params.numeroEnvio,
      firma: signature,
      nombre: route.params.nombre,
      cedula: route.params.cedula,
      fotoCedulaFrente: route.params.fotoCedulaFrente,
      fotoCedulaReverso: route.params.fotoCedulaReverso,
      huellaCapturada: route.params.huellaCapturada,
      envioId: route.params.envioId, // ← importante
    },
    merge: true,
  });
};

  const handleClear = () => {
    ref.current?.clearSignature();
  };

  const handleEmpty = () => {
    Alert.alert('Firma vacía', 'Por favor firma antes de confirmar');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Firma del Cliente</Text>
        <Text style={styles.headerSubtitle}>Solicite al destinatario que firme en el recuadro</Text>
      </View>

      {/* Área de firma */}
      <View style={styles.signatureContainer}>
        <SignatureScreen
          ref={ref}
          onOK={handleOK}
          onEmpty={handleEmpty}
          descriptionText=""
          clearText="Limpiar"
          confirmText="Guardar Firma"
          webStyle={`.m-signature-pad--footer { display: none; margin: 0px; }`}
          autoClear={false}
          imageType="image/png"
        />
      </View>

      {/* Botones */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearText}>LIMPIAR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => ref.current?.readSignature()}
        >
          <Text style={styles.saveText}>GUARDAR FIRMA</Text>
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
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#a0c4e8',
    fontSize: 14,
    marginTop: 4,
  },
  signatureContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#4b4a4a',
    borderWidth: 1.5,
    borderColor: '#666',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#2e7d32',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});