import { useNavigate } from "react-router-dom";

import { useColorModeValue } from "./components/ui/color-mode";
import { Text } from "@chakra-ui/react";

export default function Welcome() {
  const navigate = useNavigate();

  const textColor = useColorModeValue("gray.800", "white");


  return (
    <div className="flex flex-col items-center justify-center h-80 w-screen">
      <h1 className="text-5xl font-archivo font-bold mb-6">
        <Text color={textColor}>
          Meet Tolu!
        </Text>
      </h1>
      <button
        onClick={() => navigate("/chat")}
        className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-3 rounded-lg transition duration-300"
      >
        Let's Chat
      </button>
    </div>
  );
}
