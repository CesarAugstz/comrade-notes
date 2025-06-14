import { useState } from 'react'
import FormTextField from '../../../shared/components/form/components/form-text-field'
import FormPasswordField from '../../../shared/components/form/components/form-password-field'
import { FormikProvider, useFormik } from 'formik'
import * as Yup from 'yup'
import FormSubmitButton from '../../../shared/components/form/components/form-submit-button'
import { axiosInstance } from '../../../shared/api/axios'
import toast from 'react-hot-toast'

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

        toast.success('Singup success')
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
    <div className="card w-full max-w-md mx-auto bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Create an account
          </h1>
          <p className="text-base-content/70 text-lg">Join Comrade Notes</p>
        </div>

        {loginError && (
          <div className="alert alert-error mb-6">
            <span>{loginError}</span>
          </div>
        )}

        <FormikProvider value={form}>
          <div className="space-y-5">
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

            <div className="pt-4">
              <FormSubmitButton
                className="btn-primary w-full"
                onClick={async e => {
                  e?.preventDefault()
                  form.handleSubmit()
                }}
              />
            </div>
          </div>
        </FormikProvider>
      </div>
    </div>
  )
}
