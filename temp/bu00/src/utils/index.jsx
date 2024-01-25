import axios from 'axios';
import { differenceInDays } from 'date-fns';

const eventionUrl = import.meta.env.VITE_BASE_URL;

export const customFetch = axios.create({
  baseURL: eventionUrl,
});

export const calculateDaysLeft = (eventDate) => {
  const today = new Date();
  return differenceInDays(eventDate, today);
};


export const generateAmountOptions = (number) => {
  return Array.from({ length: number }, (_, index) => {
    const amount = index + 1;
    return (
      <option key={amount} value={amount}>
        {amount}
      </option>
    );
  });
};
