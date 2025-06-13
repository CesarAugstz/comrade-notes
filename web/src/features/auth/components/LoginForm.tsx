import { Box, Card, Stack, Text, Alert } from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import FormTextField from '../../../shared/form/components/form-text-field'
import FormPasswordField from '../../../shared/form/components/form-password-field'
import { Form, FormikProvider, useFormik } from 'formik'
import * as Yup from 'yup'
import FormSubmitButton from '../../../shared/form/components/form-submit-button'

export default function LoginForm() {
  const [loginError, setLoginError] = useState<string | null>(null)
  const schema = Yup.object().shape({
    username: Yup.string().min(1, 'Username is required').required(),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required(),
  })

  const form = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: schema,
    onSubmit: e => console.log('submit', e),
    validateOnBlur: true,
  })

  const onSubmit = useCallback(async () => {
    const errors = await form.validateForm()

    console.log('errors', errors)
    if (Object.values(errors).map(x => x)) {
      await form.setTouched({ username: true, password: true })
      return
    }

    form.handleSubmit()
  }, [form])

  return (
    <Card.Root
      maxW="md"
      mx="auto"
      p="8"
      bg="white"
      shadow="lg"
      borderRadius="xl"
    >
      <Card.Header pb="6">
        <Stack gap="2" textAlign="center">
          <Text fontSize="3xl" fontWeight="bold" color="primary.950">
            Welcome Back
          </Text>
          <Text color="primary.600" fontSize="lg">
            Sign in to your account
          </Text>
        </Stack>
      </Card.Header>

      <Card.Body>
        {loginError && (
          <Alert status="error" mb="6" borderRadius="md">
            {loginError}
          </Alert>
        )}

        <FormikProvider value={form}>
          <Form>
            <Stack gap="5">
              <FormTextField
                placeholder="Type your username"
                label="username"
                name="username"
              />

              <FormPasswordField
                placeholder="Type your password"
                label="password"
                name="password"
              />

              <Box pt="4">
                <FormSubmitButton />
              </Box>
            </Stack>
          </Form>
        </FormikProvider>
      </Card.Body>
    </Card.Root>
  )
}
