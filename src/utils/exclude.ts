/**
 * Removes a fields that is not needed from a given type.
 * It is like Omit for a single object but it is for list of objects
 */
export const excludeFieldFromListOfObject = <T>(
  objectList: T[],
  key: keyof T,
): T[] => {
  objectList.forEach((object) => delete object[key]);
  return objectList;
};

/**
 * Removes a fields that is not needed from a given type.
 * It is like Omit.
 */
export const excludeFieldFromSingleObject = <T>(object: T, key: keyof T): T => {
  delete object[key];
  return object;
};
