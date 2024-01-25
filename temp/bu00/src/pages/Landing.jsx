import { FeaturedEvents, Hero } from '../components';

import customFetch from '../utils';
const url = '/events?featured=true';

const featuredEventsQuery = {
  queryKey: ['featuredEvents'],
  queryFn: () => customFetch(url),
};

export const loader = (queryClient) => async () => {
  const response = await queryClient.ensureQueryData(featuredEventsQuery);

  const events = response.data.data;
  return { events };
};

const Landing = () => {
  return (
    <>
      <Hero />
      <FeaturedEvents />
    </>
  );
};
export default Landing;
