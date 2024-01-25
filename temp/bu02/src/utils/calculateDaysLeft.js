import { differenceInDays } from 'date-fns';

export const calculateDaysLeft = (eventDate) => {
  const today = new Date();
  console.log("utils - differenceInDays", differenceInDays(eventDate, today))
  return  differenceInDays(eventDate, today)
};

// export default calculateDaysLeft;

