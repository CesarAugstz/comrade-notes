import { FormikProvider, useFormik } from 'formik'
import * as Yup from 'yup'
import FormTextField from '../../../shared/components/form/components/form-text-field'
import FormSubmitButton from '../../../shared/components/form/components/form-submit-button'
import { useCreateWishlistMutation } from '../../../generated/graphql'
import toast from 'react-hot-toast'
import { QueryKeysInvalidate } from '../../../shared/graphql/consts/queries.consts'

interface CreateWishlistModalProps {
  isOpen: boolean
  onClose: () => void
}

type FormValues = {
  name: string
  description: string
}

export default function CreateWishlistModal({
  isOpen,
  onClose,
}: CreateWishlistModalProps) {
  const [createWishlist, { loading }] = useCreateWishlistMutation({
    refetchQueries: QueryKeysInvalidate.wishlist,
  })

  const schema = Yup.object().shape({
    name: Yup.string().min(1, 'Name is required').required(),
    description: Yup.string(),
  })

  const form = useFormik<FormValues>({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: schema,
    onSubmit: async values => {
      try {
        const result = await createWishlist({
          variables: {
            input: values,
          },
        })

        if (result.data?.createWishlist.success) {
          toast.success('Wishlist created successfully')
          form.resetForm()
          onClose()
        } else {
          toast.error(
            result.data?.createWishlist.message || 'Failed to create wishlist'
          )
        }
      } catch (error) {
        console.error('Error creating wishlist:', error)
        toast.error('Failed to create wishlist')
      }
    },
  })

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Create New Wishlist</h3>

        <FormikProvider value={form}>
          <div className="space-y-4">
            <FormTextField
              name="name"
              label="Name"
              placeholder="Enter wishlist name"
            />

            <FormTextField
              name="description"
              label="Description"
              placeholder="Enter wishlist description (optional)"
            />
          </div>

          <div className="modal-action">
            <button className="btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <FormSubmitButton
              className="btn-primary"
              onClick={() => form.handleSubmit()}
            />
          </div>
        </FormikProvider>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  )
}
