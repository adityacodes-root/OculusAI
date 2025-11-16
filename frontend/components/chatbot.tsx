"use client";
import { useState } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm VisionXAI Assistant. Ask me anything about eye diseases." }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      setMessages([...newMessages, { sender: "bot", text: data.reply }]);
    } catch {
      setMessages([...newMessages, { sender: "bot", text: "⚠️ Cannot connect to server." }]);
    }

    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-purple-600 text-white w-14 h-14 rounded-full
                   shadow-lg flex items-center justify-center text-3xl hover:bg-purple-700 z-50"
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-2xl border
                        p-5 flex flex-col space-y-3 z-50">
          
          <h3 className="text-xl font-bold text-purple-700 mb-1">
            VisionXAI Chatbot
          </h3>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto max-h-80 space-y-2 pr-1">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[85%] text-sm ${
                  msg.sender === "bot"
                    ? "bg-purple-100 text-purple-900 self-start"
                    : "bg-purple-600 text-white self-end"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Row */}
          <div className="flex gap-3 items-center mt-2">

            <input
              className="border p-3 flex-1 rounded-lg text-black 
                         focus:outline-purple-600 bg-white"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg 
                         font-semibold text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
