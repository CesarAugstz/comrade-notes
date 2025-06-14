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

type FormValues = {
  email: string
  name: string
  password: string
  confirmPassword: string
}

interface Props {
  onSingup?: ({ email }: { email: string }) => void
}

export default function SingupForm({ onSingup }: Props) {
  const [loginError, setLoginError] = useState<string | null>(null)

  const schema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required(),
    name: Yup.string().min(1, 'Name is required').required(),
    password: Yup.string()
      .min(3, 'Password must be at least 3 characters')
      .required(),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
      .required(),
  })

  const form = useFormik<FormValues>({
    initialValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: schema,
    onSubmit: async values => {
      setLoginError(null)

      console.log('values', values)
      try {
        await axiosInstance.post('/auth/singup', {
          ...values,
        })

        toaster.success({ title: 'Singup success' })
        onSingup?.({ email: values.email })

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
    <Card.Root maxW="md" mx="auto" p="8" bg="bg" shadow="lg" borderRadius="xl">
      <Card.Header pb="6">
        <Stack gap="2" textAlign="center">
          <Text fontSize="3xl" fontWeight="bold" color="primary.950">
            Create an account
          </Text>
          <Text color="primary.600" fontSize="lg">
            Join Comrade Notes
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
              placeholder="Type your name"
              label="Name"
              name="name"
            />

            <FormTextField
              placeholder="Type your email"
              label="Email"
              name="email"
            />

            <FormPasswordField
              placeholder="Type your password"
              label="Password"
              name="password"
            />

            <FormPasswordField
              placeholder="Confirm your password"
              label="Confirm password"
              name="confirmPassword"
              onKeyDown={e => e?.key === 'Enter' && form.handleSubmit()}
            />

            <Box pt="4">
              <FormSubmitButton
                className="w-full"
                onClick={async e => {
                  e?.preventDefault()
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
