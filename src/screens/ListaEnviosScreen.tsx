import React, { useState, useCallback } from 'react';
import {View,Text,StyleSheet,FlatList,TouchableOpacity,TextInput, StatusBar,Alert,Modal,Pressable,} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useTheme } from '../theme/ThemeContext';
import {obtenerEnviosPendientes,guardarEntrega,guardarFallido,crearEnvioPendiente,} from '../services/envios';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ListaEnvios'>;
};

type Envio = {
  id: string;
  numero: string;
  destinatario: string;
  direccion: string;
};

type Entregado = Envio & {
  nombre?: string;
  cedula?: string;
  ubicacion?: string;
  hora?: string;
};

type Fallido = Envio & {
  motivo?: string;
  ubicacion?: string;
  hora?: string;
};

const ENVIOS_INICIALES: Envio[] = [
  { id: '1', numero: 'PY082758069CR', destinatario: 'Alfredo Salazar', direccion: 'Puntarenas, Centro' },
  { id: '2', numero: 'BI003074299CR', destinatario: 'Juan Pérez', direccion: 'San José, Centro' },
];

// Memoria que NO se borra al navegar
let storeEnvios: Envio[] = [...ENVIOS_INICIALES];
let storeEntregados: Entregado[] = [];
let storeFallidos: Fallido[] = [];

const resetStore = () => {
  storeEnvios = [...ENVIOS_INICIALES];
  storeEntregados = [];
  storeFallidos = [];
};
const obtenerHora = () => {
  const ahora = new Date();
  const hora = ahora.toLocaleTimeString('es-CR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const fecha = ahora.toLocaleDateString('es-CR', {
    day: '2-digit',
    month: '2-digit',
  });
  return `${fecha} · ${hora}`;
};


export default function ListaEnviosScreen({ navigation }: Props) {
  const route = useRoute<RouteProp<RootStackParamList, 'ListaEnvios'>>();

  const [envios, setEnvios] = useState<Envio[]>([]);
  const [entregados, setEntregados] = useState<Entregado[]>(storeEntregados);
  const [fallidos, setFallidos] = useState<Fallido[]>(storeFallidos);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [cargando, setCargando] = useState(true);
  const { mode, colors, toggleTheme } = useTheme();

  useFocusEffect(
    useCallback(() => {
      let activo = true;

      const cargar = async () => {
        try {
          setCargando(true);
          const lista = await obtenerEnviosPendientes();
          if (activo) {
            storeEnvios = lista;
            setEnvios(lista);
          }
        } catch (e) {
          console.log('Error cargando envíos:', e);
          alert('No se pudieron cargar los envíos');
        } finally {
          if (activo) setCargando(false);
        }
      };

      cargar();

      setEntregados([...storeEntregados]);
      setFallidos([...storeFallidos]);

      const params = route.params;
      const eliminarId = params?.eliminarId;
      const tipo = params?.tipo;

      // Procesar entrega o fallido
      if (eliminarId) {
        const paquete = storeEnvios.find((e) => e.id === eliminarId);

        if (paquete) {
          const hora = obtenerHora();

          // Guardar en Firebase
          if (tipo === 'entregado') {
           guardarEntrega(paquete, {
           nombre: params?.nombre,
          cedula: params?.cedula,
          ubicacion: params?.ubicacion,
          hora,
        }).catch((e) => console.log('Error entrega:', e));
      } else if (tipo === 'fallido') {
      console.log('Guardando fallido en Firebase...', paquete.id);
       guardarFallido(paquete, {
       motivo: params?.motivo,
       ubicacion: params?.ubicacion,
       hora,
     }).catch((e) => console.log('Error fallido:', e));
    }
          // Actualizar lista local
          storeEnvios = storeEnvios.filter((e) => e.id !== eliminarId);

          if (tipo === 'entregado') {
            if (!storeEntregados.some((e) => e.id === eliminarId)) {
              storeEntregados = [
                ...storeEntregados,
                {
                  ...paquete,
                  nombre: params?.nombre,
                  cedula: params?.cedula,
                  ubicacion: params?.ubicacion,
                  hora,
                },
              ];
            }
          } else if (tipo === 'fallido') {
            if (!storeFallidos.some((e) => e.id === eliminarId)) {
              storeFallidos = [
                ...storeFallidos,
                {
                  ...paquete,
                  motivo: params?.motivo,
                  ubicacion: params?.ubicacion,
                  hora,
                },
              ];
            }
          }

          setEnvios([...storeEnvios]);
          setEntregados([...storeEntregados]);
          setFallidos([...storeFallidos]);
        }

        setSeleccionados((prev) => prev.filter((s) => s !== eliminarId));

        navigation.setParams({
          eliminarId: undefined,
          tipo: undefined,
          nombre: undefined,
          cedula: undefined,
          motivo: undefined,
          ubicacion: undefined,
        });
      }

      // Código escaneado con SCAN
// Código escaneado con SCAN
const codigoEscaneado = params?.codigoEscaneado;
if (codigoEscaneado) {
  const codigo = codigoEscaneado.trim();
  const encontrado = storeEnvios.find(
    (e) => e.numero.toLowerCase() === codigo.toLowerCase()
  );

  // Siempre quitar selección al escanear
  setSeleccionados([]);
  setBusqueda('');

  if (encontrado) {
    Alert.alert(
      'Paquete encontrado',
      `${encontrado.numero}\n${encontrado.destinatario}`
    );
          } else {
          const nombres = [
            'María Fernández Rojas',
            'Carlos Jiménez Vargas',
            'Ana Lucía Mora Solís',
            'José Andrés Pérez Castro',
            'Laura Gabriela Ramírez',
            'Diego Alejandro Soto',
            'Sofía Isabel Vargas',
            'Andrés Felipe Chaves',
            'Valeria Camila Rojas',
            'Daniel Eduardo Méndez',
          ];

          const direcciones = [
            'San José, Barrio Escalante',
            'Alajuela, Centro',
            'Cartago, Tejar del Guarco',
            'Heredia, San Francisco',
            'Puntarenas, El Roble',
            'Limón, Centro',
            'Guanacaste, Liberia Centro',
            'San José, Hatillo 4',
            'Alajuela, San Ramón Centro',
            'Puntarenas, Barranca',
          ];

          const nombreRandom = nombres[Math.floor(Math.random() * nombres.length)];
          const direccionRandom = direcciones[Math.floor(Math.random() * direcciones.length)];

                    crearEnvioPendiente({
            numero: codigo,
            destinatario: nombreRandom,
            direccion: direccionRandom,
          })
            .then(async (nuevo) => {
              // Recargar desde Firebase (evita duplicados)
              const lista = await obtenerEnviosPendientes();
              storeEnvios = lista;
              setEnvios(lista);

              Alert.alert(
                'Paquete nuevo agregado',
                `${nuevo.numero}\n${nuevo.destinatario}\n${nuevo.direccion}`
              );
            })
            .catch((e) => {
              console.log('Error creando envío:', e);
              Alert.alert('Error', 'No se pudo guardar el paquete en Firebase');
            });
        }

        navigation.setParams({ codigoEscaneado: undefined });
      }
    }, [route.params, navigation])
  );
  const toggleSeleccion = (id: string) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const enviosFiltrados = envios.filter(
    (envio) =>
      envio.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
      envio.destinatario.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleEntregar = () => {
    if (seleccionados.length === 0) {
      Alert.alert('Atención', 'Selecciona al menos un envío');
      return;
    }

    const envioSeleccionado = envios.find((e) => e.id === seleccionados[0]);
    if (envioSeleccionado) {
      if (seleccionados.length > 1) {
        Alert.alert(
          'Varios seleccionados',
          `Vas a entregar el primero (${envioSeleccionado.numero}).\nQuedarán ${seleccionados.length - 1} pendientes de entregar.`,
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Continuar',
              onPress: () => {
                navigation.navigate('Entrega', {
                  numeroEnvio: envioSeleccionado.numero,
                  envioId: envioSeleccionado.id,
                });
              },
            },
          ]
        );
      } else {
        navigation.navigate('Entrega', {
          numeroEnvio: envioSeleccionado.numero,
          envioId: envioSeleccionado.id,
        });
      }
    }
  };

  const handleCerrarSesion = () => {
    setMenuVisible(false);
    Alert.alert('Cerrar Sesión', '¿Estás seguro que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sí, salir',
        style: 'destructive',
        onPress: () => {
          resetStore();
          setEnvios([...storeEnvios]);
          setEntregados([]);
          setFallidos([]);
          setSeleccionados([]);
          navigation.replace('Login');
        },
      },
    ]);
  };

  const handleAcercaDe = () => {
    setMenuVisible(false);
    Alert.alert(
      'Acerca de la App',
      'Gestión de Entregas\nVersión 1.0.0\n\nDesarrollado para la gestión de envíos y entregas de paquetes.',
      [{ text: 'OK' }]
    );
  };
    const handleResumen = () => {
    setMenuVisible(false);

    const total =
      storeEnvios.length + storeEntregados.length + storeFallidos.length;

    Alert.alert(
      'Resumen del día',
      `Pendientes: ${storeEnvios.length}\n` +
        `Entregados: ${storeEntregados.length}\n` +
        `Fallidos: ${storeFallidos.length}\n\n` +
        `Total del día: ${total}`,
      [{ text: 'OK' }]
    );
  };

  const renderItem = ({ item }: { item: Envio }) => {
    const isSelected = seleccionados.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => toggleSeleccion(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.checkbox}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.info}>
          <Text style={styles.numero}>{item.numero}</Text>
          <Text style={styles.destinatario}>{item.destinatario}</Text>
          <Text style={styles.direccion}>{item.direccion}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

            <View style={[styles.header, { backgroundColor: '#E65100' }]}>
        <View>
          <Text style={styles.headerTitle}>Lista Envíos</Text>
          <Text style={styles.headerSubtitle}>
            {envios.length} pendientes · {seleccionados.length} seleccionados
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={styles.menuButton} onPress={toggleTheme}>
            <Text style={styles.menuIcon}>{mode === 'light' ? '🌙' : '☀️'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
            <Text style={styles.menuIcon}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleResumen}>
              <Text style={styles.menuItemText}>Resumen del día</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={handleAcercaDe}>
              <Text style={styles.menuItemText}>Acerca de la App</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={handleCerrarSesion}>
              <Text style={[styles.menuItemText, { color: '#E65100' }]}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => navigation.navigate('Scan')}
        >
          <Text style={styles.scanText}>SCAN</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar número o nombre..."
          placeholderTextColor="#999"
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {enviosFiltrados.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}> No hay más envíos pendientes</Text>
        </View>
      ) : (
        <FlatList
          data={enviosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.footerButton, styles.entregarButton]} onPress={handleEntregar}>
          <Text style={styles.footerIcon}>📦</Text>
          <Text style={styles.footerButtonText}>ENTREGAR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, styles.secundarioButton]}
          onPress={() => navigation.navigate('Entregados', { items: entregados })}
        >
          <Text style={styles.footerIcon}>✅</Text>
          <Text style={styles.footerButtonTextSecundario}>
            ENTREGADOS ({entregados.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, styles.secundarioButton]}
          onPress={() => navigation.navigate('Fallidos', { items: fallidos })}
        >
          <Text style={styles.footerIcon}>❌</Text>
          <Text style={styles.footerButtonTextSecundario}>
            FALLIDOS ({fallidos.length})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
    footerIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  header: {
    backgroundColor: '#E65100',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 22, 
    fontWeight: 'bold' 
  },

  headerSubtitle: { 
    color: '#fdfdfd', 
    fontSize: 14, 
    marginTop: 4 
  },

  menuButton: { 
    padding: 8 
  },

  menuIcon: { 
    color: '#fff', 
    fontSize: 28, 
    fontWeight: 'bold' 
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 90,
    marginRight: 16,
    minWidth: 180,
    elevation: 8,
  },
  menuItem: { 
    paddingVertical: 14, 
    paddingHorizontal: 20 
  },
  menuItemText: { 
    fontSize: 16, 
    color: '#333' 
  },
  menuDivider: { 
    height: 1, 
    backgroundColor: '#eee' 
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: 10,
  },
  scanButton: {
    backgroundColor: '#E65100',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  scanText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  list: { 
    padding: 12, 
    paddingBottom: 20 
  },
    card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8f4',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  checkmark: {
    color: '#2e7d32',
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  numero: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#E65100',
    letterSpacing: 0.5,
  },
  destinatario: {
    fontSize: 15,
    color: '#222',
    marginTop: 6,
    fontWeight: '500',
  },
  direccion: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emptyText: { 
    fontSize: 18, 
    color: '#666' 
  },
  footer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 8,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  entregarButton: {
    backgroundColor: '#E65100',
  },
  secundarioButton: {
    backgroundColor: '#E65100',
  },
  footerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  footerButtonTextSecundario: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
});