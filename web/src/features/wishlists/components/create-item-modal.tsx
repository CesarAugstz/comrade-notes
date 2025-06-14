import { FormikProvider, useFormik } from 'formik'
import * as Yup from 'yup'
import FormTextField from '../../../shared/components/form/components/form-text-field'
import FormSubmitButton from '../../../shared/components/form/components/form-submit-button'
import { useCreateWishlistItemMutation } from '../../../generated/graphql'
import toast from 'react-hot-toast'
import { QueryKeysInvalidate } from '../../../shared/graphql/consts/queries.consts'

interface CreateItemModalProps {
  isOpen: boolean
  onClose: () => void
  wishlistId: string
}

type FormValues = {
  name: string
  description: string
}

export default function CreateItemModal({
  isOpen,
  onClose,
  wishlistId,
}: CreateItemModalProps) {
  const [createItem, { loading }] = useCreateWishlistItemMutation({
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
        const result = await createItem({
          variables: {
            input: {
              ...values,
              wishlistId,
            },
          },
        })

        if (result.data?.createWishlistItem.success) {
          toast.success('Item created successfully')
          form.resetForm()
          onClose()
        } else {
          toast.error(
            result.data?.createWishlistItem.message || 'Failed to create item'
          )
        }
      } catch (error) {
        console.error('Error creating item:', error)
        toast.error('Failed to create item')
      }
    },
  })

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Add New Item</h3>

        <FormikProvider value={form}>
          <div className="space-y-4">
            <FormTextField
              name="name"
              label="Name"
              placeholder="Enter item name"
            />

            <FormTextField
              name="description"
              label="Description"
              placeholder="Enter item description (optional)"
            />
          </div>

          <div className="modal-action">
            <button className="btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <FormSubmitButton
              className="btn-primary"
              onClick={() => form.handleSubmit()}
              text="Add Item"
              loadingText="Adding..."
            />
          </div>
        </FormikProvider>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  )
}
