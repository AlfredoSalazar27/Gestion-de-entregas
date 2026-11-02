import {collection,getDocs,doc,setDoc,deleteDoc,query,where,getDoc,} from 'firebase/firestore';
import { db } from '../config/firebase';

export type Envio = {
  id: string;
  numero: string;
  destinatario: string;
  direccion: string;
};

export type Entregado = Envio & {
  nombre?: string;
  cedula?: string;
  ubicacion?: string;
  hora?: string;
};

export type Fallido = Envio & {
  motivo?: string;
  ubicacion?: string;
  hora?: string;
};

export async function obtenerEnviosPendientes(): Promise<Envio[]> {
  const q = query(collection(db, 'envios'), where('estado', '==', 'pendiente'));
  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      numero: data.numero || '',
      destinatario: data.destinatario || '',
      direccion: data.direccion || data['dirección'] || '',
    };
  });
}

export async function crearEnvioPendiente(data: {
  numero: string;
  destinatario: string;
  direccion: string;
}): Promise<Envio> {
  const contadorRef = doc(db, 'config', 'contador');
  const contadorSnap = await getDoc(contadorRef);

  let siguiente = 1;
  if (contadorSnap.exists()) {
    siguiente = (contadorSnap.data().ultimo || 0) + 1;
  }

  const id = String(siguiente);

  await setDoc(doc(db, 'envios', id), {
    numero: data.numero,
    destinatario: data.destinatario,
    direccion: data.direccion,
    estado: 'pendiente',
  });

  await setDoc(contadorRef, { ultimo: siguiente }, { merge: true });

  return {
    id,
    numero: data.numero,
    destinatario: data.destinatario,
    direccion: data.direccion,
  };
}

export async function guardarEntrega(
  envio: Envio,
  extra: { nombre?: string; cedula?: string; ubicacion?: string; hora?: string }
) {
  await setDoc(doc(db, 'entregas', envio.id), {
    ...envio,
    ...extra,
    estado: 'entregado',
    fecha: new Date().toISOString(),
  });
  await deleteDoc(doc(db, 'envios', envio.id));
}

export async function guardarFallido(
  envio: Envio,
  extra: { motivo?: string; ubicacion?: string; hora?: string }
) {
  await setDoc(doc(db, 'fallidos', envio.id), {
    ...envio,
    ...extra,
    estado: 'fallido',
    fecha: new Date().toISOString(),
  });
  await deleteDoc(doc(db, 'envios', envio.id));
}

export async function obtenerEntregas(): Promise<Entregado[]> {
  const snap = await getDocs(collection(db, 'entregas'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Entregado));
}

export async function obtenerFallidos(): Promise<Fallido[]> {
  const snap = await getDocs(collection(db, 'fallidos'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Fallido));
}