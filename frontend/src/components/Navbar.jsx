import { Button, Container, Flex, HStack, Text } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
// import { CiSquarePlus } from "react-icons/ci";
import { FaMoon } from "react-icons/fa6";
import { IoSunnyOutline } from "react-icons/io5";
import { useColorMode, useColorModeValue } from './ui/color-mode';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const textColor = useColorModeValue("gray.800", "white");
  const iconColor = useColorModeValue("gray.800", "white");

  return (
    <Container maxW={"1140px"} px={"4"}
      position="sticky"
      top="0"
      bg={useColorModeValue('gray.100', 'gray.900')}
      zIndex="50"
      borderBottomWidth='1px' borderBottomColor='gray.400'
    >
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'} flexDir={{ base: 'row', sm: 'row' }}>
        <Link to={'/'}>
          <Text
            fontSize={{ base: '22', sm: '28' }}
            fontWeight={'bold'}
            textTransform={'uppercase'}
            textAlign={'center'}
            color={textColor}>
            Tolu
          </Text>
        </Link>

        <HStack spacing={2} alignItems={'center'}>
          <Button focusRing='none' onClick={toggleColorMode} color={iconColor}>
            {colorMode === "light" ? <FaMoon /> : <IoSunnyOutline />}
          </Button>
        </HStack>

      </Flex>

    </Container>
  )
}

export default Navbar