/**
 * Removes the first element from the given array and returns the remaining elements.
 * @param array - The input array.
 * @returns A new array with the first element removed.
 */
export const dropFirst = <T>(array: T[]): T[] => array.slice(1);

/**
 * Removes the last element from the given array and returns the remaining elements.
 * @param array - The input array.
 * @returns A new array with the last element removed.
 */
export const dropLast = <T>(array: T[]): T[] => array.slice(0, array.length - 1);

/**
 * Returns the last element of the given array.
 * @param array - The input array.
 * @returns The last element of the array.
 */
export const last = <T>(array: T[]): T => array[array.length - 1];

/**
 * Returns the first element of the given array.
 * @param array - The input array.
 * @returns The first element of the array.
 */
export const first = <T>(array: T[]): T => array[0];
