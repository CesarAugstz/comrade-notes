import * as Yup from 'yup'
import FormTextField from '../../../shared/components/form/components/form-text-field'
import FormModal from '../../../shared/components/form/form-modal'
import {
  useCreateWishlistItemMutation,
  useUpdateWishlistItemMutation,
  useGetWishlistItemQuery,
} from '../../../generated/graphql'
import toast from 'react-hot-toast'
import { QueryKeysInvalidate } from '../../../shared/graphql/consts/queries.consts'
import FormRatingField from '../../../shared/components/form/components/form-rating-field'
import { useMemo } from 'react'

interface CreateItemModalProps {
  isOpen: boolean
  onClose: () => void
  wishlistId: string
  itemId?: string
}

type FormValues = {
  name: string
  description: string
  rating: number
}

const schema = Yup.object().shape({
  name: Yup.string().min(1, 'Name is required').required(),
  description: Yup.string(),
  rating: Yup.number().min(0).max(5),
})

export default function CreateItemModal({
  isOpen,
  onClose,
  wishlistId,
  itemId,
}: CreateItemModalProps) {
  const { data: itemData, loading: itemLoading } = useGetWishlistItemQuery({
    variables: { id: itemId! },
    skip: !itemId,
  })

  const isEditing = itemData && !itemLoading

  const [createItem, { loading: createLoading }] =
    useCreateWishlistItemMutation({
      refetchQueries: QueryKeysInvalidate.wishlist,
    })

  const [updateItem, { loading: updateLoading }] =
    useUpdateWishlistItemMutation({
      refetchQueries: QueryKeysInvalidate.wishlist,
    })

  const loading = createLoading || updateLoading

  const initalValues = useMemo(() => {
    if (isEditing && itemData?.wishlistItem) {
      const item = itemData.wishlistItem
      return {
        name: item.name,
        description: item.description || '',
        rating: item.rating || 0,
      }
    }
    return { name: '', description: '', rating: 0 }
  }, [itemData, isEditing])

  console.log('initalValues', initalValues)

  const handleSubmit = async (values: FormValues) => {
    try {
      let result

      if (isEditing && itemId) {
        result = await updateItem({
          variables: {
            id: itemId,
            input: {
              ...values,
              rating: values.rating || null,
            },
          },
        })

        if (result.data?.updateWishlistItem.success) {
          toast.success('Item updated successfully')
          onClose()
          return
        }

        toast.error(
          result.data?.updateWishlistItem.message || 'Failed to update item'
        )
      } else {
        result = await createItem({
          variables: {
            input: {
              ...values,
              wishlistId,
              rating: values.rating || null,
            },
          },
        })

        if (result.data?.createWishlistItem.success) {
          toast.success('Item created successfully')
          onClose()
          return
        }

        toast.error(
          result.data?.createWishlistItem.message || 'Failed to create item'
        )
      }
    } catch (error) {
      console.error('Error saving item:', error)
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} item`)
    }
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      isEditing={isEditing}
      title={isEditing ? 'Edit Item' : 'Add New Item'}
      initialValues={initalValues}
      validationSchema={schema}
      onSubmit={handleSubmit}
      loading={loading}
      submitText={isEditing ? 'Update Item' : 'Add Item'}
      loadingText={isEditing ? 'Updating...' : 'Adding...'}
    >
      <FormTextField name="name" label="Name" placeholder="Enter item name" />
      <FormTextField
        name="description"
        label="Description"
        placeholder="Enter item description (optional)"
      />
      <FormRatingField name="rating" label="Rating (Optional)" />
    </FormModal>
  )
}
