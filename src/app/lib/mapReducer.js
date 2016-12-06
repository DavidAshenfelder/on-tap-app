const mapReducer = (reducer) => {
  return (state, action) => {
    return reducer(state, action.data || action);
  };
};

export default mapReducer;
