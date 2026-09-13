export default function useCache() {
  let cacheKey = null;
  let cache = {};
  return {
    get(key) {
      if (key !== cacheKey) {
        cacheKey = key;
        cache = {};
      }
      return cache;
    },
    clear() {
      cacheKey = null;
      cache = {};
    }
  };
}
