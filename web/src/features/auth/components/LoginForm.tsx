import { Box, Card, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import FormTextField from '../../../shared/form/components/form-text-field'
import FormPasswordField from '../../../shared/form/components/form-password-field'
import { FormikProvider, useFormik } from 'formik'
import * as Yup from 'yup'
import FormSubmitButton from '../../../shared/form/components/form-submit-button'
import { axiosInstance } from '../../../shared/api/axios'
import { Alert } from '../../../components/ui/alert'
import { toaster } from '../../../components/ui/toaster'
import { useAuthStore } from '../../../shared/store/auth.store'
import { useNavigate } from 'react-router'

type FormValues = {
  login: string
  password: string
}

export default function LoginForm() {
  const [loginError, setLoginError] = useState<string | null>(null)
  const schema = Yup.object().shape({
    login: Yup.string().min(1, 'Username is required').required(),
    password: Yup.string()
      .min(3, 'Password must be at least 3 characters')
      .required(),
  })
  const saveLoginStore = useAuthStore(state => state.login)
  const navigation = useNavigate()

  const form = useFormik<FormValues>({
    initialValues: {
      login: '',
      password: '',
    },
    validationSchema: schema,
    onSubmit: async values => {
      setLoginError(null)

      console.log('values', values)
      try {
        const res = await axiosInstance.post('/auth/login', {
          ...values,
        })

        const messageError = res?.data?.message ?? res?.data?.error?.message

        console.log('res', res, messageError)

        if (messageError || !res?.data?.token) {
          setLoginError(messageError ?? 'An error occured')
          return
        }
        toaster.success({ title: 'Login success' })

        const { token, user } = res?.data ?? {}

        saveLoginStore(token, user)
        navigation('/')

        console.log('login sucesful')
      } catch (e: any) {
        console.error('Error on login', e)
        const messageError =
          e?.response?.data?.message ?? e?.response?.data?.error?.message
        console.log('message', messageError)
        setLoginError(messageError ?? 'An error occured')
      }
    },
    validateOnBlur: true,
  })

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
          <Stack gap="5">
            <FormTextField
              placeholder="Type your username"
              label="Username"
              name="login"
            />

            <FormPasswordField
              placeholder="Type your password"
              label="password"
              name="password"
              onKeyDown={e => e?.key === 'Enter' && form.handleSubmit()}
            />

            <Box pt="4">
              <FormSubmitButton
                className="w-full"
                onClick={async e => {
                  console.log('handlesubmit')
                  e?.preventDefault()
                  console.log('isvalie', await form.validateForm())
                  form.handleSubmit()
                }}
              />
            </Box>
          </Stack>
        </FormikProvider>
      </Card.Body>
    </Card.Root>
  )
}
