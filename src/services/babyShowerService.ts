// src/services/babyShowerService.ts

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { BabyShowerConfirmation, GiftStock, SelectedGift } from "@/types";
import { GIFTS_LIST } from "@/data/giftsList";

const CONFIRMATIONS_COLLECTION = "baby-shower-confirmations";
const GIFTS_STOCK_COLLECTION = "baby-shower-gifts-stock";

// Inicializar stock de regalos en Firebase (solo una vez)
export async function initializeGiftsStock(): Promise<void> {
  const stockRef = collection(db, GIFTS_STOCK_COLLECTION);

  for (const gift of GIFTS_LIST) {
    const giftStock: GiftStock = {
      id: gift.id,
      name: gift.name,
      maxCount: gift.maxCount,
      currentCount: gift.maxCount,
      isUnique: gift.isUnique,
    };

    await addDoc(stockRef, giftStock);
  }
}

// Obtener stock actual de regalos
export async function getGiftsStock(): Promise<GiftStock[]> {
  const stockRef = collection(db, GIFTS_STOCK_COLLECTION);
  const snapshot = await getDocs(stockRef);

  return snapshot.docs.map((doc) => ({
    ...(doc.data() as GiftStock),
  }));
}

// Verificar disponibilidad de regalos seleccionados
async function checkGiftsAvailability(gifts: SelectedGift[]): Promise<boolean> {
  const stockRef = collection(db, GIFTS_STOCK_COLLECTION);
  const snapshot = await getDocs(stockRef);

  for (const selectedGift of gifts) {
    const giftDoc = snapshot.docs.find(
      (doc) => doc.data().id === selectedGift.id
    );
    if (!giftDoc) return false;

    const currentStock = giftDoc.data().currentCount;
    if (currentStock < selectedGift.quantity) return false;
  }

  return true;
}

// Actualizar stock de regalos (decrementar)
async function updateGiftsStock(gifts: SelectedGift[]): Promise<void> {
  const stockRef = collection(db, GIFTS_STOCK_COLLECTION);
  const snapshot = await getDocs(stockRef);

  for (const selectedGift of gifts) {
    const giftDoc = snapshot.docs.find(
      (doc) => doc.data().id === selectedGift.id
    );
    if (!giftDoc) continue;

    await updateDoc(doc(db, GIFTS_STOCK_COLLECTION, giftDoc.id), {
      currentCount: increment(-selectedGift.quantity),
    });
  }
}

// Enviar confirmación de asistencia
export async function submitBabyShowerConfirmation(
  confirmation: BabyShowerConfirmation
): Promise<void> {
  // 1. Verificar disponibilidad de regalos
  if (confirmation.gifts.length > 0) {
    const available = await checkGiftsAvailability(confirmation.gifts);
    if (!available) {
      throw new Error(
        "Algunos regalos ya no están disponibles. Por favor recarga la página."
      );
    }
  }

  // 2. Guardar confirmación
  const confirmationsRef = collection(db, CONFIRMATIONS_COLLECTION);
  await addDoc(confirmationsRef, {
    ...confirmation,
    timestamp: Date.now(),
  });

  // 3. Actualizar stock de regalos
  if (confirmation.gifts.length > 0) {
    await updateGiftsStock(confirmation.gifts);
  }
}

// Obtener todas las confirmaciones
export async function getAllConfirmations(): Promise<BabyShowerConfirmation[]> {
  const confirmationsRef = collection(db, CONFIRMATIONS_COLLECTION);
  const snapshot = await getDocs(confirmationsRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as BabyShowerConfirmation),
  }));
}

// Verificar si un grupo ya confirmó
export async function hasGroupConfirmed(groupId: string): Promise<boolean> {
  const confirmations = await getAllConfirmations();
  return confirmations.some((conf) => conf.groupId === groupId);
}
