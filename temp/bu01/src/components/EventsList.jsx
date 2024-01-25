import { Link, useLoaderData } from 'react-router-dom';
import calculateDaysLeft from '../utils/axios';

const EventsList = () => {
  const { events } = useLoaderData();

  return (
    <div className='mt-12 grid gap-y-8'>
      {events.map((event) => {
        const { title, eventDate, image, company } = event.attributes;
        const countdown = calculateDaysLeft(eventDate );
        return (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className='p-8 rounded-lg flex flex-col sm:flex-row gap-y-4 flex-wrap  bg-base-100 shadow-xl hover:shadow-2xl duration-300 group'
          >
            <img
              src={image}
              alt={title}
              className='h-24 w-24 rounded-lg sm:h-32 sm:w-32 object-cover group-hover:scale-105 transition duration-300'
            />
            <div className='ml-0 sm:ml-16'>
              <h3 className='capitalize font-medium text-lg'>{title}</h3>
              <h4 className='capitalize text-md text-neutral-content'>
                {company}
              </h4>
            </div>
            <p className='font-medium ml-0 sm:ml-auto text-lg'>
              {countdown}
            </p>
          </Link>
        );
      })}
    </div>
  );
};
export default EventsList;
