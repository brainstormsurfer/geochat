const FormRowSelect = ({ label, name, list, defaultValue, size }) => {
  return (
    <div className='form-control'>
      <label htmlFor={name} className='label'>
        <span className='label-text capitalize'>{label}</span>
      </label>
      <select
        name={name}
        id={name}
        className={`select select-bordered ${size}`}
        defaultValue={defaultValue}
      >
        {list.map((helper) => {
          return (
            <option key={helper} value={helper}>
              {helper}
            </option>
          );
        })}
      </select>
    </div>
  );
};
export default FormRowSelect;
