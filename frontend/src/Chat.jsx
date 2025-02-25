import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Groq from "groq-sdk";

import { Box } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import { useColorModeValue } from "./components/ui/color-mode";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Initialize Groq API
const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch relevant FixINEC sections before sending to AI
  const fetchRelevantSections = async (query) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/reports/search?q=${query}`);
      let relevantText = response.data.map(section => section.text).join("\n\n");

      // Truncate text if too long (max 5000 characters)
      if (relevantText.length > 5000) {
        relevantText = relevantText.substring(0, 5000) + "... [Truncated]";
      }

      return relevantText;
    } catch (error) {
      console.error("Error fetching FixINEC data:", error);
      return "No relevant data found in FixINEC report.";
    }
  };


  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    try {
      // 1️⃣ Get relevant FixINEC sections from MongoDB
      const fixInecContent = await fetchRelevantSections(input);

      // console.log("📝 Sending to AI:", fixInecContent);

      // 2️⃣ Send only relevant sections to the AI model
      const response = await groq.chat.completions.create({
        model: "deepseek-r1-distill-llama-70b",
        messages: [
          {
            role: "system",
            content: `You are an expert AI assistant named "Tolu" specializing in the FixINEC campaign report. Only use the provided FixINEC content to answer questions.
            Use **clear formatting** for better readability:  
      - Use **bold headers**  
      - Use **bullet points** where necessary  
      - Ensure **double spacing between sections**  
      - Provide structured Markdown responses  
             📜 **FixINEC Document Content**: ${fixInecContent}
          🚨 Note: This content may be truncated. If the response is incomplete, ask the user to refine the query.
          If it returns "No relevant data was found" You don't have to let the user know. it may be because the user just greeted.
          If a question is unrelated to this document or FixINEC campaign, politely decline to answer.
              Now, answer the user's question based only on this document. You should also respond to greetings in a friendly manner. Provide structured Markdown responses.`

          },
          ...newMessages
        ],
        reasoning_format: "hidden",
      });

      const fullMessage = response.choices[0].message.content;
      let displayedMessage = "";

      // 3️⃣ Typewriter effect for AI response
      fullMessage.split("").forEach((char, i) => {
        setTimeout(() => {
          displayedMessage += char;
          setMessages([...newMessages, { role: "assistant", content: displayedMessage }]);
        }, i * 5);
      });

    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  const chatContainerRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // Auto-scroll when messages update (unless user is scrolling)
  useEffect(() => {
    if (chatContainerRef.current && !isUserScrolling) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth", // Makes it scroll smoothly
      });
    }
  }, [messages, loading]);

  // Detect if user is scrolling manually
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px margin
      setIsUserScrolling(!isAtBottom);
    }
  };



  return (
    <div className="flex justify-center items-center mx-auto w-screen">
      <div className="flex flex-col min-h-[calc(100vh-64px)] w-screen max-w-[1140px]">

        {/* Chat messages - Scrollable */}
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 p-4 overflow-y-auto mx-auto w-full space-y-4 flex flex-col"
          style={{ maxHeight: "80vh", overflowY: "auto" }} // Ensures scrolling works
        >

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg max-w-[75%] leading-relaxed w-fit ${msg.role === "user"
                ? "bg-blue-500 text-white self-end text-right"
                : "bg-gray-300 text-black self-start text-left"
                }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          ))}

          {/* Show Loading Animation (Left Side - AI Side) */}
          {loading && (
            <div className="flex items-center justify-start space-x-1 mt-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:100ms]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:200ms]"></div>
            </div>
          )}
        </div>

        {/* Input Field - Sticky at Bottom */}
        <Box bg={useColorModeValue("gray.100", "gray.900")}
          padding='4'
          position="sticky"
          bottom="0"
          width="100%"
          zIndex="50"
          sx={{
            boxShadow: "0 -6px 10px rgba(0, 0, 0, 0.15)", // Strictly top shadow
            clipPath: "inset(-10px 0px 0px 0px)", // Ensures shadow doesn't extend to sides
          }}
        >
          <div className="sticky rounded-2xl bg-gray-200 dark:bg-gray- bottom-0 p-10 w-full flex justify-center"
            style={{
              backgroundColor: useColorModeValue("#E5E7EB", "#27272A"), // Light gray (Tailwind gray-200) and dark gray (Tailwind gray-800)
            }}
          >
            <input
              type="text"
              className="flex-1 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
              style={{
                color: useColorModeValue("black", "white"),
              }}
            />
            <button
              onClick={sendMessage}
              className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Loading..." : "Send"}
            </button>
          </div>
        </Box>
      </div>
    </div>
  );
}
