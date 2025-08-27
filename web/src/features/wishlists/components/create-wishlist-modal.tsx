import * as Yup from 'yup'
import FormTextField from '../../../shared/components/form/components/form-text-field'
import FormModal from '../../../shared/components/form/form-modal'
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

const schema = Yup.object().shape({
  name: Yup.string().min(1, 'Name is required').required(),
  description: Yup.string(),
})

export default function CreateWishlistModal({
  isOpen,
  onClose,
}: CreateWishlistModalProps) {
  const [createWishlist, { loading }] = useCreateWishlistMutation({
    refetchQueries: QueryKeysInvalidate.wishlist,
  })

  const handleSubmit = async (values: FormValues) => {
    try {
      const result = await createWishlist({
        variables: {
          input: values,
        },
      })

      if (result.data?.createWishlist.success) {
        toast.success('Wishlist created successfully')
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
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Wishlist"
      initialValues={{ name: '', description: '' }}
      validationSchema={schema}
      onSubmit={handleSubmit}
      loading={loading}
      submitText="Create"
      loadingText="Creating..."
    >
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
    </FormModal>
  )
}
