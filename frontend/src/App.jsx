// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { Box } from "@chakra-ui/react"

import Welcome from "./Welcome.jsx";
import Chat from "./Chat.jsx";
import Navbar from "./components/Navbar";
import { useColorModeValue } from "./components/ui/color-mode"




function App() {
  return (
      <Box minH={"100vh"} bg={useColorModeValue('gray.100', 'gray.900')} >
        <Navbar />
        <Routes>
          <Route path="/" element={<Welcome />} />  {/* Default Page */}
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Box>
  );
}

export default App;
