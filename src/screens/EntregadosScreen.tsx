import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Entregados'>;
  route: RouteProp<RootStackParamList, 'Entregados'>;
};

export default function EntregadosScreen({ navigation, route }: Props) {
  const items = route.params?.items || [];
  const { mode, colors, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Entregados</Text>
          <Text style={styles.headerSubtitle}>{items.length} paquetes</Text>
        </View>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <Text style={{ fontSize: 22 }}>{mode === 'light' ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aún no hay entregas</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.numero}>{item.numero}</Text>
              <Text style={styles.destinatario}>{item.destinatario}</Text>
              <Text style={styles.direccion}>{item.direccion}</Text>
              {item.nombre ? (
                <Text style={styles.extra}>Recibió: {item.nombre}</Text>
              ) : null}
              {item.cedula ? (
                <Text style={styles.extra}>Cédula: {item.cedula}</Text>
              ) : null}
              {item.ubicacion ? (
                <Text style={styles.extra}>GPS: {item.ubicacion}</Text>
              ) : null}
              {item.hora ? (
                <Text style={styles.extra}>Hora: {item.hora}</Text>
              ) : null} 
            </View>
          )}
        />
      )}
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
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
  list: {
    padding: 12,
  },
    card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,        
    marginBottom: 14,   
    borderLeftWidth: 5,
    borderLeftColor: '#2e7d32', 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  numero: {
    fontSize: 18,       
    fontWeight: 'bold',
    color: '#2e7d32',   
    letterSpacing: 0.5,
  },
  destinatario: {
    fontSize: 16,       
    color: '#222',
    marginTop: 8,
    fontWeight: '500',
  },
  direccion: {
    fontSize: 14,       
    color: '#666',
    marginTop: 5,
  },
    hora: {
    fontSize: 13,
    color: '#2e7d32',
    marginTop: 8,
    fontWeight: '600',
  },
  extra: {
    fontSize: 14,
    color: '#555',
    marginTop: 6,
  },
});