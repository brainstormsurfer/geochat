export const addToLocalStorage = (token) => {
  localStorage.setItem('token', JSON.stringify(token));
};

export const removeFromLocalStorage = () => {
  localStorage.removeItem('token');
};

export const getFromLocalStorage = () => {
  const result = localStorage.getItem('token');
  const token = result ? JSON.parse(result) : null;
  return token;
};
