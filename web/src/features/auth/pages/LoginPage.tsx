import { Box, Container, Stack, Text, Flex } from '@chakra-ui/react'
import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  return (
    <Box 
      minH="100vh" 
      bg="linear-gradient(135deg, primary.50 0%, secondary.50 100%)"
      display="flex"
      alignItems="center"
      py="12"
    >
      <Container maxW="lg" px="6">
        <Stack gap="8" align="center">
          <Box textAlign="center">
            <Text 
              fontSize="4xl" 
              fontWeight="bold" 
              color="primary.950"
              mb="2"
            >
              Comrade Notes
            </Text>
            <Text 
              fontSize="lg" 
              color="primary.700"
              maxW="md"
            >
              Your collaborative note-taking platform for seamless teamwork and productivity
            </Text>
          </Box>
          
          <LoginForm />
          
          <Flex gap="1" fontSize="sm" color="primary.600">
            <Text>Don't have an account?</Text>
            <Text 
              color="secondary.600" 
              fontWeight="medium" 
              cursor="pointer"
              _hover={{ color: "secondary.700" }}
            >
              Sign up here
            </Text>
          </Flex>
        </Stack>
      </Container>
    </Box>
  )
}
