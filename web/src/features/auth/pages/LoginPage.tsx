import { Box, Container, Stack, Text, Flex } from '@chakra-ui/react'
import LoginForm from '../components/LoginForm'
import { useState } from 'react'
import SingupForm from '../components/SingupForm'
import { AnimatePresence, motion } from 'motion/react'

export default function LoginPage() {
  const [isSingup, setIsSingup] = useState(false)

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
            <Text fontSize="4xl" fontWeight="bold" color="primary.950" mb="2">
              Comrade Notes
            </Text>
            <Text fontSize="lg" color="primary.700" maxW="md">
              Your collaborative note-taking platform for seamless teamwork and
              productivity
            </Text>
          </Box>

          <AnimatePresence mode="wait">
            <motion.div
              key={isSingup ? 'signup' : 'login'}
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              transition={{
                duration: 0.2,
                ease: 'easeInOut',
              }}
            >
              {!isSingup ? (
                <LoginForm />
              ) : (
                <SingupForm
                  onSingup={() => {
                    setIsSingup(false)
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <Flex gap="1" fontSize="sm" color="primary.600">
            <Text>Don't have an account?</Text>
            <Text
              color="secondary.600"
              fontWeight="medium"
              cursor="pointer"
              onClick={() => setIsSingup(!isSingup)}
              _hover={{ color: 'secondary.700' }}
            >
              Sign up here
            </Text>
          </Flex>
        </Stack>
      </Container>
    </Box>
  )
}
