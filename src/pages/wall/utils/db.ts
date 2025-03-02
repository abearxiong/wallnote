import { MyCache } from '@kevisual/cache';

const cache = new MyCache('cacheWall');

export async function getWallData() {
  const data = await cache.getData();
  return data;
}

export async function setWallData(data: any) {
  await cache.setData(data);
}

export async function clearWallData() {
  await cache.del();
}
