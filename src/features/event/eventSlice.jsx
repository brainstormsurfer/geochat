import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getFromLocalStorage } from '../../utils/localStorage';
import { createEventThunk, deleteEventThunk, editEventThunk } from './eventThunk';
const initialState = {
  isLoading: false,
  position: '',
  company: '',
  eventLocation: '',
  eventTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  eventType: 'full-time',
  statusOptions: ['interview', 'declined', 'pending'],
  status: 'pending',
  isEditing: false,
  editEventId: '',
};

export const createEvent = createAsyncThunk('event/createEvent', createEventThunk);

export const deleteEvent = createAsyncThunk('event/deleteEvent', deleteEventThunk);

export const editEvent = createAsyncThunk('event/editEvent', editEventThunk);

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    handleChange: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearValues: () => {
      return {
        ...initialState,
        eventLocation: getFromLocalStorage()?.location || '',
      };
    },
    setEditEvent: (state, { payload }) => {
      return { ...state, isEditing: true, ...payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEvent.fulfilled, (state) => {
        state.isLoading = false;
        toast.success('Event Created');
      })
      .addCase(createEvent.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })
      .addCase(deleteEvent.fulfilled, (state, { payload }) => {
        toast.success(payload);
      })
      .addCase(deleteEvent.rejected, (state, { payload }) => {
        toast.error(payload);
      })
      .addCase(editEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editEvent.fulfilled, (state) => {
        state.isLoading = false;
        toast.success('Event Modified...');
      })
      .addCase(editEvent.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      });
  },
});

export const { handleChange, clearValues, setEditEvent } = eventSlice.actions;

export default eventSlice.reducer;
