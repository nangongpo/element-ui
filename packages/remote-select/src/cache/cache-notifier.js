export function notify(store, change) {
  Array.from(store.listeners).forEach(listener => {
    try {
      listener(change);
    } catch (e) {
      // A listener must not interrupt cache operations or other listeners.
    }
  });
}

export function subscribe(store, listener) {
  store.listeners.add(listener);
  return () => store.listeners.delete(listener);
}
