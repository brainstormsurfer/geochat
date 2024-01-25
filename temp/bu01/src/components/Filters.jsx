import { Form, useLoaderData, Link } from 'react-router-dom';
import FormInput from './FormInput';
import FormRowSelect from './FormRowSelect';
import FormRange from './FormRange';
import FormCheckbox from './FormCheckbox';
const Filters = () => {
  const { meta, params } = useLoaderData();
  const { search, company, category, mobility, order, eventDate } = params;

  return (
    <Form className='bg-base-200 rounded-md px-8 py-4 grid gap-x-4  gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 helpers-center'>
      {/* SEARCH */}
      <FormInput
        type='search'
        label='search event'
        name='search'
        size='input-sm'
        defaultValue={search}
      />
      {/* CATEGORIES */}
      <FormRowSelect
        label='select category'
        name='category'
        list={meta.categories}
        size='select-sm'
        defaultValue={category}
      />
      {/* COMPANIES */}
      <FormRowSelect
        label='select company'
        name='company'
        list={meta.companies}
        size='select-sm'
        defaultValue={company}
      />
      {/* ORDER */}
      <FormRowSelect
        label='sort by'
        name='order'
        list={['a-z', 'z-a', 'latest', 'earliest']}
        size='select-sm'
        defaultValue={order}
      />
      {/* eventDate */}
      <FormRange
        name='eventDate'
        label='select eventDate'
        size='range-sm'
        eventDate={eventDate}
      />
      {/* SHIPPING */}
      <FormCheckbox
        name='mobility'
        label='free mobility'
        size='checkbox-sm'
        defaultValue={mobility}
      />
      {/* BUTTONS */}
      <button type='submit' className='btn btn-primary btn-sm'>
        search
      </button>
      <Link to='/events' className='btn btn-accent btn-sm'>
        reset
      </Link>
    </Form>
  );
};
export default Filters;
