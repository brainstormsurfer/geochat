const LoginButton = ({ disabled, onClickHandelr }) => {
  return (
    <button
      disabled={disabled}
      className="l_page_login_button"
      onClick={onClickHandelr}
    ></button>
  );
};

export default LoginButton;
