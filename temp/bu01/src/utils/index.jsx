import axios from 'axios';
import { differenceInDays } from 'date-fns';

const productionUrl = 'http://localhost:5000/api/v1';

export const customFetch = axios.create({
  baseURL: productionUrl,
});


// date format  - calculateDaysLeft("2024-01-25T12:00:00Z")

export const calculateDaysLeft = (eventDate) => {
  const today = new Date();
  return differenceInDays(eventDate, today);
};
