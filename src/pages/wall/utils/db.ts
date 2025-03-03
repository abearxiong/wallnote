import { MyCache } from '@kevisual/cache';

const cache = new MyCache('cacheWall');

export async function getWallData() {
  try {
    const data = await cache.getData();
    return data;
  } catch (e) {
    cache.del();
  }
}

export async function setWallData(data: any) {
  await cache.setData(data);
}

export async function clearWallData() {
  await cache.del();
}
