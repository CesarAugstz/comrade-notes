import { FormikProvider, type FormikValues, useFormik } from 'formik'
import { useEffect, useRef, type ReactNode } from 'react'
import Modal from '../ui/modal'
import FormSubmitButton from './components/form-submit-button'

interface FormModalProps<T extends FormikValues> {
  isOpen: boolean
  isEditing?: boolean
  onClose: () => void
  title: string
  initialValues: T
  validationSchema: any
  onSubmit: (values: T) => Promise<void>
  children: ReactNode
  loading?: boolean
  submitText?: string
  loadingText?: string
}

export default function FormModal<T extends FormikValues>({
  isOpen,
  onClose,
  title,
  initialValues,
  validationSchema,
  onSubmit,
  children,
  isEditing = false,
  loading = false,
  submitText = 'Submit',
  loadingText = 'Submitting...',
}: FormModalProps<T>) {
  const form = useFormik<T>({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      await onSubmit(values)
      form.resetForm()
    },
  })

  const wasReset = useRef(false)

  useEffect(() => {
    if (isEditing && !wasReset.current && initialValues && isOpen) {
      form.setValues(initialValues)
      wasReset.current = true
    }
  }, [isOpen, form, initialValues, isEditing])

  useEffect(() => {
    if (!isOpen) wasReset.current = false
  }, [wasReset, isOpen])

  return (
    <FormikProvider value={form}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        actions={
          <>
            <button className="btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <FormSubmitButton
              className="btn-primary"
              onClick={() => form.handleSubmit()}
              text={submitText}
              loadingText={loadingText}
            />
          </>
        }
      >
        <div className="space-y-4">{children}</div>
      </Modal>
    </FormikProvider>
  )
}
