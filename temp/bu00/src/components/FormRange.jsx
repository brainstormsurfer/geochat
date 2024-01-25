import calculateDaysLeft from '../utils/axios';
import { useState } from 'react';
const FormRange = ({ label, name, size, eventDate }) => {
  const step = 1000;
  const maxCountdown = 100000;
  const [selectedCountdown, setSelectedCountdown] = useState(eventDate || maxCountdown);

  return (
    <div className='form-control'>
      <label htmlFor={name} className='label cursor-pointer'>
        <span className='label-text capitalize'>{label}</span>
        <span>{calculateDaysLeft(selectedCountdown)}</span>
      </label>
      <input
        type='range'
        name={name}
        min={0}
        max={maxCountdown}
        value={selectedCountdown}
        onChange={(e) => setSelectedCountdown(e.target.value)}
        className={`range range-primary ${size}`}
        step={step}
      />
      <div className='w-full flex justify-between text-xs px-2 mt-2'>
        <span className='font-bold text-md'>0</span>
        <span className='font-bold text-md'>Max : {calculateDaysLeft(maxCountdown)}</span>
      </div>
    </div>
  );
};
export default FormRange;
