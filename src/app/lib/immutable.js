/**
 * Takes in `state` as array and edits the object at supplied `index` with passed in `obj`
 * @param state Array to copy from
 * @param index Index of object to update
 * @param obj Updates to object found at index
 * @returns {*[]} New array, with updates to index from obj
 */
export const mergeArray = (state, index, obj) => {
  return [
    ...state.slice(0, index),
    { ...state[index], ...obj },
    ...state.slice(index + 1),
  ];
};

/**
 * Takes in `state` as array and removes the object at the passed in `index`
 * @param state Array to copy from
 * @param index Index of object to delete
 * @returns {*[]} New array without object at index
 */
export const deleteFromArray = (state, index) => {
  let newArray = [];
  if (state.length !== 1) {
    newArray = [
      ...state.slice(0, index),
      ...state.slice(index + 1),
    ];
  } else if (index + 1 === state.length && index !== 0) {
    newArray = [
      ...state.slice(index),
    ];
  } else if (index === -1) {
    newArray = state;
  }
  return newArray;
};

/**
 * Takes in `srcArray` as source array and returns a copy of that array using .slice()
 * @param srcArray the source array you would like to copy
 * @returns New array, which is a "copy by value" of srcArray
 */
export const copyArray = (srcArray) => {
  return srcArray.slice(0);
};

/**
 * Will mutate array if it's an array of objects.
 * Moves value in srcArray, from 'fromIndex' to 'toIndex' in the array
 * @param srcArray
 * @param fromIndex
 * @param toIndex
 * @returns {*} New Array with rearranged entries
 */
export const moveIndex = (srcArray, fromIndex, toIndex) => {
  if (!srcArray.length) return srcArray;
  const entry = srcArray[fromIndex];
  let newArray = deleteFromArray(srcArray, fromIndex);
  if (!newArray.length || toIndex >= newArray.length + 1) {
    return srcArray;
  } else if (toIndex === 0 && newArray.length > 0) {
    newArray = [
      entry,
      ...newArray,
    ];
  } else {
    newArray = [
      ...newArray.slice(0, toIndex),
      entry,
      ...newArray.slice(toIndex),
    ];
  }

  return newArray;
};

/**
 * Takes in `state` as array and appends the object `val` to end of `list`
 * @param list Array to push to
 * @param val Object to push to end of list
 * @returns {*[]} New array, with new val pushed to list
 */
export const addToArray = (list, val) => {
  return [...list, val];
};

/**
 * Takes in `state` as array and prepends the object `val` to beginning of `list`
 * @param list Array to push to
 * @param val Object to push to beginning of list
 * @returns {*[]} New array, with new val prepended to list
 */
export const prependToArray = (list, val) => {
  return [val, ...list];
};
