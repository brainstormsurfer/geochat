export const addToLocalStorage = (token) => {
  localStorage.setItem('token', JSON.stringify(token));
};

export const removeFromLocalStorage = () => {
  localStorage.removeItem('token');
};

export const getFromLocalStorage = () => {
  try {
    const result = localStorage.getItem('token');
    console.log("LocSt result", result);
    return result !== null ? JSON.parse(result) : null;  
  } catch (error) {
    console.error('Error parsing token from localStorage:', error);
    return null; 
  }
};
