import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const LoginInput = (props) => {
  const { username, setUsername } = props;

  const generateUsername = () => {
    setUsername(uuidv4().substring(2, 7));
  };
  // const handleValueChange = (e) => {
  //   setUsername(e.target.value);
  // };

  useEffect(() => {
    generateUsername();
  }, []);
  const handleValueChange = () => {
    // setUsername(e.target.value);
    setUsername(generateUsername);
  };

  return (
    <input
      className="l_page_input"
      value={username}
      onChange={handleValueChange}
    />
  );
};

export default LoginInput;
