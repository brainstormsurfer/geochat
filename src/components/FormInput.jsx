const FormInput = ({ label, username, type, defaultValue }) => {
  return (
    <label className="form-control">
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
      <input
        type={type}
        name={username}
        defaultValue={defaultValue}
        placeholder="Type here"
        className="input input-bordered"
      />
    </label>
  );
};

export default FormInput;
