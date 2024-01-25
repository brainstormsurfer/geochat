import { showLoading, hideLoading, getAllEvents } from '../allEvents/allEventsSlice';
import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';
import { clearValues } from './eventSlice';

export const createEventThunk = async (event, thunkAPI) => {
  try {
    const resp = await customFetch.post('/events', event);
    thunkAPI.dispatch(clearValues());
    return resp.data.msg;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
export const deleteEventThunk = async (eventId, thunkAPI) => {
  thunkAPI.dispatch(showLoading());
  try {
    const resp = await customFetch.delete(`/events/${eventId}`);
    thunkAPI.dispatch(getAllEvents());
    return resp.data.msg;
  } catch (error) {
    thunkAPI.dispatch(hideLoading());
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
export const editEventThunk = async ({ eventId, event }, thunkAPI) => {
  try {
    const resp = await customFetch.update(`/events/${eventId}`, event);
    thunkAPI.dispatch(clearValues());
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
