import { differenceInDays } from 'date-fns';


// date format  - calculateDaysLeft("2024-01-25T12:00:00Z")

const calculateDaysLeft = (eventDate) => {
  const today = new Date();
  console.log("utils - differenceInDays", differenceInDays(eventDate, today))
  return  differenceInDays(eventDate, today)
};

export default calculateDaysLeft;

