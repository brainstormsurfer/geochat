import EventsGrid from './EventsGrid';
import SectionTitle from './SectionTitle';

const FeaturedEvents = () => {
  return (
    <div className='pt-24'>
      <SectionTitle text='featured events' />
      <EventsGrid />
    </div>
  );
};
export default FeaturedEvents;
