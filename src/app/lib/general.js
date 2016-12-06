export const calcPercentage = (totalValue, myNumber) => {
  const percentage = (myNumber / totalValue) * 100;
  return isNaN(percentage) ? 0 : Math.round(percentage);
};

export const defaultErrMsg = 'An error has occurred. Please try again or contact support.';
export const testErrMsg = 'There was an error.';

export const generateUUID = () => {
  let d = new Date().getTime();

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};
