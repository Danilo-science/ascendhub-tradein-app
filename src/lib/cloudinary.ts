import { v2 as cloudinary } from 'cloudinary';

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
}

export interface UploadOptions {
  folder?: string;
  transformation?: Array<{
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
    [key: string]: string | number | undefined;
  }>;
  quality?: string | number;
  format?: string;
  width?: number;
  height?: number;
  crop?: string;
}

/**
 * Sube una imagen a Cloudinary con optimizaciones automáticas
 */
export async function uploadImage(
  file: File | string,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  try {
    const {
      folder = 'ascendhub',
      quality = 'auto',
      format = 'auto',
      ...otherOptions
    } = options;

    let uploadData: string;
    
    if (file instanceof File) {
      // Convertir File a base64
      uploadData = await fileToBase64(file);
    } else {
      uploadData = file;
    }

    const result = await cloudinary.uploader.upload(uploadData, {
      folder,
      quality,
      format,
      ...otherOptions,
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Sube múltiples imágenes a Cloudinary
 */
export async function uploadMultipleImages(
  files: File[],
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult[]> {
  try {
    const uploadPromises = files.map(file => uploadImage(file, options));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw new Error('Failed to upload images');
  }
}

/**
 * Elimina una imagen de Cloudinary
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
}

/**
 * Genera URL optimizada para diferentes tamaños
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string | number;
    format?: string;
    crop?: string;
  } = {}
): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    quality,
    format,
    crop,
    fetch_format: 'auto',
    dpr: 'auto',
  });
}

/**
 * Genera URLs para diferentes tamaños responsivos
 */
export function getResponsiveImageUrls(publicId: string) {
  return {
    thumbnail: getOptimizedImageUrl(publicId, { width: 150, height: 150 }),
    small: getOptimizedImageUrl(publicId, { width: 300, height: 300 }),
    medium: getOptimizedImageUrl(publicId, { width: 600, height: 600 }),
    large: getOptimizedImageUrl(publicId, { width: 1200, height: 1200 }),
    original: getOptimizedImageUrl(publicId),
  };
}

/**
 * Convierte un File a base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Valida si un archivo es una imagen válida
 */
export function validateImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Tipo de archivo no válido. Solo se permiten imágenes JPEG, PNG, WebP y GIF.');
  }

  if (file.size > maxSize) {
    throw new Error('El archivo es demasiado grande. Máximo 10MB.');
  }

  return true;
}

/**
 * Hook personalizado para subir imágenes (para usar en componentes React)
 */
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (files: File | File[], options?: UploadOptions) => {
    setUploading(true);
    setError(null);

    try {
      if (Array.isArray(files)) {
        // Validar todos los archivos
        files.forEach(validateImageFile);
        const results = await uploadMultipleImages(files, options);
        return results;
      } else {
        // Validar archivo único
        validateImageFile(files);
        const result = await uploadImage(files, options);
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir imagen';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, error };
}

// Importar useState para el hook
import { useState } from 'react';

export default cloudinary;