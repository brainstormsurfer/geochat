import { FormRow, FormRowSelect } from '../../components';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  handleChange,
  clearValues,
  createEvent,
  editEvent,
} from '../../features/event/eventSlice';
import { useEffect } from 'react';
const AddEvent = () => {
  const {
    isLoading,
    position,
    company,
    eventLocation,
    eventType,
    eventTypeOptions,
    status,
    statusOptions,
    isEditing,
    editEventId,
  } = useSelector((store) => store.event);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!position || !company || !eventLocation) {
      toast.error('Please fill out all fields');
      return;
    }
    if (isEditing) {
      dispatch(
        editEvent({
          eventId: editEventId,
          event: { position, company, eventLocation, eventType, status },
        })
      );
      return;
    }
    dispatch(createEvent({ position, company, eventLocation, eventType, status }));
  };

  const handleEventInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch(handleChange({ name, value }));
  };

  useEffect(() => {
    if (!isEditing) {
      dispatch(
        handleChange({
          name: 'eventLocation',
          value: user.location,
        })
      );
    }
  }, []);

  return (
    <Wrapper>
      <form className='form'>
        <h3>{isEditing ? 'edit event' : 'add event'}</h3>
        <div className='form-center'>
          {/* position */}
          <FormRow
            type='text'
            name='position'
            value={position}
            handleChange={handleEventInput}
          />
          {/* company */}
          <FormRow
            type='text'
            name='company'
            value={company}
            handleChange={handleEventInput}
          />
          {/* eventLocation */}
          <FormRow
            type='text'
            name='eventLocation'
            labelText='event location'
            value={eventLocation}
            handleChange={handleEventInput}
          />
          {/* status */}
          <FormRowSelect
            name='status'
            value={status}
            handleChange={handleEventInput}
            list={statusOptions}
          />
          {/* event type*/}
          <FormRowSelect
            name='eventType'
            labelText='event type'
            value={eventType}
            handleChange={handleEventInput}
            list={eventTypeOptions}
          />
          <div className='btn-container'>
            <button
              type='button'
              className='btn btn-block clear-btn'
              onClick={() => dispatch(clearValues())}
            >
              clear
            </button>
            <button
              type='submit'
              className='btn btn-block submit-btn'
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};
export default AddEvent;
