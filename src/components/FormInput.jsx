const FormInput = ({ label, name, type, value, size }) => {
  return (
    <div className='form-control'>
      <label htmlFor={name} className='label'>
        <span className='label-text capitalize'>{label}</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        className={`input input-bordered ${size}`}
      />
    </div>
  );
};
export default FormInput;
