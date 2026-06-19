'use server';

import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

/**
 * Updates an appointment's status in Firestore.
 * @param {string} id - The Firestore document ID
 * @param {string} newStatus - The new status (PENDING, COMPLETED, CANCELLED)
 */
export async function updateAppointmentStatus(id, newStatus) {
  try {
    const validStatuses = ['PENDING', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(newStatus)) {
      return { success: false, error: 'Invalid status' };
    }

    await db.collection('appointments').doc(id).update({
      status: newStatus,
      updatedAt: new Date()
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return { success: false, error: 'Failed to update appointment' };
  }
}

/**
 * Deletes an appointment from Firestore.
 * @param {string} id - The Firestore document ID
 */
export async function deleteAppointment(id) {
  try {
    await db.collection('appointments').doc(id).delete();

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return { success: false, error: 'Failed to delete appointment' };
  }
}
