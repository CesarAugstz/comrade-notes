import { useState } from 'react'
import FormTextField from '../../../shared/components/form/components/form-text-field'
import FormPasswordField from '../../../shared/components/form/components/form-password-field'
import { FormikProvider, useFormik } from 'formik'
import * as Yup from 'yup'
import FormSubmitButton from '../../../shared/components/form/components/form-submit-button'
import { axiosInstance } from '../../../shared/api/axios'
import { useAuthStore } from '../../../shared/store/auth.store'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'

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

      try {
        const res = await axiosInstance.post('/auth/login', {
          ...values,
        })

        const messageError = res?.data?.message ?? res?.data?.error?.message

        if (messageError || !res?.data?.token) {
          setLoginError(messageError ?? 'An error occured')
          return
        }
        toast.success('Login success')

        const { token, user } = res?.data ?? {}

        saveLoginStore(token, user)
        navigation('/')
      } catch (e: any) {
        console.error('Error on login', e)
        const messageError =
          e?.response?.data?.message ?? e?.response?.data?.error?.message
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
            Welcome Back
          </h1>
          <p className="text-base-content/70 text-lg">
            Sign in to your account
          </p>
        </div>

        {loginError && (
          <div className="alert alert-error mb-6">
            <span>{loginError}</span>
          </div>
        )}

        <FormikProvider value={form}>
          <div className="space-y-5">
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
