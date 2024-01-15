// src/App.js
import { useState } from "react";
import ChatApp from "./components/ChatApp"; // Create a separate ChatApp component
import Home from "./components/Home";

function App() {
  const [isChatActive, setIsChatActive] = useState(false);

  const handleEnterChat = () => {
    setIsChatActive(true);
  };

  return (
    <>{isChatActive ? <ChatApp /> : <Home onEnterChat={handleEnterChat} />}</>
  );
}

export default App;
