/**
 * Utilidades para manejo de imágenes
 */

/**
 * Agrega cache busting a una URL de imagen
 * Esto fuerza al navegador/app a recargar la imagen en lugar de usar la versión en caché
 * 
 * @param imageUrl - URL original de la imagen
 * @returns URL con parámetro de cache busting
 * 
 * @example
 * addCacheBusting('https://api.com/image.jpg') 
 * // => 'https://api.com/image.jpg?v=1731211234567'
 */
export function addCacheBusting(imageUrl: string | undefined | null): string {
  if (!imageUrl) return '';
  
  // Si ya tiene parámetros, usar & en lugar de ?
  const separator = imageUrl.includes('?') ? '&' : '?';
  const timestamp = Date.now();
  
  return `${imageUrl}${separator}v=${timestamp}`;
}

/**
 * Remueve parámetros de cache busting de una URL
 * Útil para comparar URLs o guardar en base de datos
 * 
 * @param imageUrl - URL con posible cache busting
 * @returns URL limpia sin parámetros de versión
 */
export function removeCacheBusting(imageUrl: string | undefined | null): string {
  if (!imageUrl) return '';
  
  return imageUrl.split('?')[0];
}

/**
 * Verifica si una URL necesita cache busting
 * Las URLs locales (no empiezan con http) no necesitan cache busting
 * 
 * @param imageUrl - URL a verificar
 * @returns true si necesita cache busting
 */
export function needsCacheBusting(imageUrl: string | undefined | null): boolean {
  if (!imageUrl) return false;
  
  return imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
}

/**
 * Aplica cache busting solo si es necesario
 * 
 * @param imageUrl - URL de la imagen
 * @returns URL con cache busting si es remota, o la URL original si es local
 */
export function smartCacheBusting(imageUrl: string | undefined | null): string {
  if (!imageUrl) return '';
  
  if (needsCacheBusting(imageUrl)) {
    return addCacheBusting(imageUrl);
  }
  
  return imageUrl;
}
