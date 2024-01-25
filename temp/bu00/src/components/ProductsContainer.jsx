import { useLoaderData } from 'react-router-dom';
import EventsGrid from './EventsGrid';
import EventsList from './EventsList';
import { useState } from 'react';
import { BsFillGridFill, BsList } from 'react-icons/bs';

const EventsContainer = () => {
  const { meta } = useLoaderData();
  const totalEvents = meta.pagination.total;

  const [layout, setLayout] = useState('grid');

  const setActiveStyles = (pattern) => {
    return `text-xl btn btn-circle btn-sm ${
      pattern === layout
        ? 'btn-primary text-primary-content'
        : 'btn-ghost text-based-content'
    }`;
  };

  return (
    <>
      {/* HEADER */}
      <div className='flex justify-between helpers-center mt-8 border-b border-base-300 pb-5'>
        <h4 className='font-medium text-md'>
          {totalEvents} event{totalEvents > 1 && 's'}
        </h4>
        <div className='flex gap-x-2'>
          <button
            type='button'
            onClick={() => setLayout('grid')}
            className={setActiveStyles('grid')}
          >
            <BsFillGridFill />
          </button>
          <button
            type='button'
            onClick={() => setLayout('list')}
            className={setActiveStyles('list')}
          >
            <BsList />
          </button>
        </div>
      </div>
      {/* EventS */}
      <div>
        {totalEvents === 0 ? (
          <h5 className='text-2xl mt-16'>
            Sorry, no events matched your search...
          </h5>
        ) : layout === 'grid' ? (
          <EventsGrid />
        ) : (
          <EventsList />
        )}
      </div>
    </>
  );
};
export default EventsContainer;
