import axios from 'axios';

// const eventionUrl = ' https://strapi-store-server.onrender.com/api';
// const eventionUrl = 'https://api.postman.com/collections/31619296-36260cba-6dbd-4703-9d20-69f7d4938dc6?access_key=PMAT-01HMPJQSDRJXJ7T6J4JJC9EZ8K'
export const customFetch = axios.create({
  baseURL: eventionUrl,
});

export const calculateDaysLeft = (eventDate) => {
  const countdown = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format((eventDate / 100).toFixed(2));
  return countdown;
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
