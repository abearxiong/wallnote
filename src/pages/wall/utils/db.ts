import { MyCache } from '@kevisual/cache';

const cache = new MyCache('cacheWall');

export async function getCacheWallData(key?: string) {
  try {
    const data = await cache.get(key ?? 'cacheWall');
    return data;
  } catch (e) {
    cache.del();
  }
}

export async function setCacheWallData(data: any, key?: string) {
  await cache.set(key ?? 'cacheWall', data);
}

export async function clearCacheWallData() {
  await cache.del();
}
