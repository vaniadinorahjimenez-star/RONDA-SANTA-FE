// Centralized storage and event dispatcher for the Santa Fé Official Logo (El Monito Panadero)

export const SANTAFE_LOGO_STORAGE_KEY = 'santafe_official_logo_v1';
export const LOGO_CHANGE_EVENT = 'santafe_logo_changed';

export function getStoredLogo(): string | null {
  try {
    return localStorage.getItem(SANTAFE_LOGO_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveStoredLogo(dataUrl: string): void {
  try {
    localStorage.setItem(SANTAFE_LOGO_STORAGE_KEY, dataUrl);
    window.dispatchEvent(new CustomEvent(LOGO_CHANGE_EVENT, { detail: dataUrl }));
  } catch (err) {
    console.warn('No se pudo guardar el logo en localStorage:', err);
  }
}

export function removeStoredLogo(): void {
  try {
    localStorage.removeItem(SANTAFE_LOGO_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(LOGO_CHANGE_EVENT, { detail: null }));
  } catch (err) {
    console.warn('No se pudo remover el logo:', err);
  }
}
