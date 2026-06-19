'use server';

import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

/**
 * Updates site content details inside a single Firestore document.
 */
export async function updateContent(formData) {
  try {
    const keys = ['doctor_name', 'doctor_qualifications', 'doctor_bio', 'clinic_phone', 'clinic_email'];
    const data = {};
    
    for (const key of keys) {
      const value = formData.get(key);
      if (value !== null) {
        data[key] = value.toString();
      }
    }
    
    await db.collection('site').doc('content').set(data, { merge: true });
    
    // Revalidate paths
    revalidatePath('/');
    revalidatePath('/admin/content');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating content:', error);
    return { success: false, error: 'Failed to update content' };
  }
}

/**
 * Adds a new patient review into the reviews Firestore collection.
 */
export async function addReview(formData) {
  try {
    const patientName = formData.get('patientName');
    const initials = formData.get('initials');
    const content = formData.get('content');
    const rating = parseInt(formData.get('rating') || '5', 10);

    if (!patientName || !initials || !content) {
      return { success: false, error: 'All fields are required.' };
    }

    await db.collection('reviews').add({
      patientName,
      initials,
      content,
      rating,
      createdAt: new Date()
    });

    revalidatePath('/');
    revalidatePath('/admin/content');
    return { success: true };
  } catch (error) {
    console.error('Error adding review:', error);
    return { success: false, error: 'Failed to add review.' };
  }
}

/**
 * Deletes a review from the reviews Firestore collection.
 */
export async function deleteReview(id) {
  try {
    await db.collection('reviews').doc(id).delete();

    revalidatePath('/');
    revalidatePath('/admin/content');
    return { success: true };
  } catch (error) {
    console.error('Error deleting review:', error);
    return { success: false, error: 'Failed to delete review.' };
  }
}

/**
 * Updates an existing review in the reviews Firestore collection.
 */
export async function updateReview(id, formData) {
  try {
    const patientName = formData.get('patientName');
    const initials = formData.get('initials');
    const content = formData.get('content');
    const rating = parseInt(formData.get('rating') || '5', 10);

    if (!patientName || !initials || !content) {
      return { success: false, error: 'All fields are required.' };
    }

    await db.collection('reviews').doc(id).update({
      patientName,
      initials,
      content,
      rating,
      updatedAt: new Date()
    });

    revalidatePath('/');
    revalidatePath('/admin/content');
    return { success: true };
  } catch (error) {
    console.error('Error updating review:', error);
    return { success: false, error: 'Failed to update review.' };
  }
}
