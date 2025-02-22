import { get, set, clear } from 'idb-keyval';

export async function getWallData() {
  const data = await get('cacheWall');
  return data;
}

export async function setWallData(data: any) {
  await set('cacheWall', data);
}

export async function clearWallData() {
  await clear();
}
