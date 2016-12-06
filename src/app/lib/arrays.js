export const lowerBoundCheck = (index) => {
  let selectedIndex = index;
  if (selectedIndex < 0) {
    selectedIndex = 0;
  }
  return selectedIndex;
};

export const upperBoundCheck = (index, list) => {
  let selectedIndex = index;
  if (selectedIndex >= list.length) {
    selectedIndex = (list.length - 1);
  }
  return selectedIndex;
};
