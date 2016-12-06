export const formatData = (itemsList, selectedItems, attr) => {
  let selectedArr = [];
  if (selectedItems) {
    selectedArr = selectedItems.map((item) => {
      return item.payload;
    });
  }
  return itemsList.map((item) => {
    const remove = selectedArr.includes(item[attr]);
    const text = item.value || item.Value;
    const value = item.value || item.Key;
    return { ...item, value, text, remove };
  });
};
