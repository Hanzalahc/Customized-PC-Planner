import { useState } from "react";
import { chatWithGemini } from "../../utils/geminiChat"; 
import "./ChatPopup.css"; 

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    setIsTyping(true);

    const botReply = await chatWithGemini(input);
    setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
    setIsTyping(false);
  };

  return (
    <div className="chatPopup">
      <button className="chatButton" onClick={toggleChat}>Chat</button>
      {isOpen && (
        <div className="chatWindow">
          <div className="chatHeader">
            <h3>Chat with us</h3>
            <button onClick={toggleChat} className="closeButton">&times;</button>
          </div>
          <div className="chatBody">
            <div className="chatMessages">
              {messages.map((msg, i) => (
                <p
                  key={i}
                  className={`message ${msg.role === "user" ? "userMsg" : "botMsg"}`}
                >
                  {msg.content}
                </p>
              ))}
              {isTyping && <p className="botMsg">Bot is typing...</p>}
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPopup;
