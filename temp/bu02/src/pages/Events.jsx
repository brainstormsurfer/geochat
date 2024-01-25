import { Filters, PaginationContainer, EventsContainer } from '../components';
import customFetch from '../utils';
const url = '/events';

const allEventsQuery = (queryParams) => {
  const { search, category, company, sort, eventDate, mobility, page } =
    queryParams;

  return {
    queryKey: [
      'events',
      search ?? '',
      category ?? 'all',
      company ?? 'all',
      sort ?? 'a-z',
      eventDate ?? 356,
      mobility ?? false,
      page ?? 1,
    ],
    queryFn: () =>
      customFetch(url, {
        params: queryParams,
      }),
  };
};

export const loader =
  (queryClient) =>
  async ({ request }) => {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    const response = await queryClient.ensureQueryData(
      allEventsQuery(params)
    );
    const events = response.data.data;
    const meta = response.data.meta;
    return { events, meta, params };
  };

const Events = () => {
  return (
    <>
      <Filters />
      <EventsContainer />
      <PaginationContainer />
    </>
  );
};
export default Events;
