export const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Fail silently
  }
};

export const loadFromLocalStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
};
