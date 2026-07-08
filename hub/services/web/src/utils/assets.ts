/**
 * Resolves the asset URL based on the current environment.
 * In development, it routes through the local Vite dev server.
 * In production, it targets the Cloudinary CDN.
 *
 * @param path The relative asset path within the studio/src directory (e.g., 'three/models/car.glb')
 * @returns The resolved asset URL
 */
export function getAssetUrl(path: string): string {
  let cleanPath = path;
  if (path.startsWith('/') === true) {
    cleanPath = path.substring(1);
  }

  if (import.meta.env.DEV === true) {
    return `/@studio-assets/${cleanPath}`;
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
  if (cloudName === undefined || cloudName === '') {
    throw new Error('VITE_CLOUDINARY_CLOUD_NAME is not defined in environment variables.');
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/studio/${cleanPath}`;
}
