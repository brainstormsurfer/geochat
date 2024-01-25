const FormRowSelect = ({ label, name, list, defaultValue, size }) => {
  return (
    // <div className='form-control'>
    <div className='form-row'>
      <label htmlFor={name} className='label'>
        <span className='label-text capitalize'>{label || name}</span>
      </label>
      <select
           id={name}
           type={type}
           name={name}
           value={value}
          //  onChange={handleChange}
          //  className='form-input'       
        className={`select select-bordered ${size}`}
        // defaultValue={defaultValue}
      >
        {list.map((el) => {
          return (
            <option key={el} value={el}>
              {el}
            </option>
          );
        })}
      </select>
    </div>
  );
};
export default FormRowSelect;
