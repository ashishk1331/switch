export async function set(key: string, value: string | number | boolean) {
  await chrome.storage.local.set({ [key]: value });
}

export async function get(key: string) {
  const resp = await chrome.storage.local.get([key]);
  return resp[key];
}