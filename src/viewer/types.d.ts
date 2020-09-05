/**
 * Object with a `forEach` function for iterating.
 */
export interface ForEach<T> {
  forEach(callbackfn: (value: T) => void): void;
}
