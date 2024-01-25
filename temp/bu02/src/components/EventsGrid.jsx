import { Link
  // , useLoaderData 
} from 'react-router-dom';
import calculateDaysLeft from '../utils/axios';

const EventsGrid = () => {
  const { events } = useLoaderData();

  return (
    <div className='pt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {events.map((event) => {
        const { title, eventDate, image } = event.attributes;
        const countdown = calculateDaysLeft(eventDate);
        return (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className='card w-full shadow-xl hover:shadow-2xl transition duration-300'
          >
            <figure className='px-4 pt-4'>
              <img
                src={image}
                alt={title}
                className='rounded-xl h-64 md:h-48 w-full object-cover'
              />
            </figure>
            <div className='card-body helpers-center text-center'>
              <h2 className='card-title capitalize tracking-wider'>{title}</h2>
              <span className='text-secondary'>{countdown}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
export default EventsGrid;
