import * as Yup from 'yup'
import FormTextField from '../../../../shared/components/form/components/form-text-field'
import FormModal from '../../../../shared/components/form/form-modal'
import {
  useCreateLinkMutation,
  useGetLinkQuery,
  useUpdateLinkMutation,
} from '../../../../generated/graphql'
import toast from 'react-hot-toast'
import { QueryKeysInvalidate } from '../../../../shared/graphql/consts/queries.consts'
import { useMemo } from 'react'

interface CreateLinkModalProps {
  isOpen: boolean
  onClose: () => void
  wishlistItemId: string
  linkId?: string
}

type FormValues = {
  url: string
  title: string
  price: string
}

const schema = Yup.object().shape({
  url: Yup.string().url('Please enter a valid URL').required('URL is required'),
  title: Yup.string(),
  price: Yup.string().matches(/^\d*\.?\d*$/, 'Please enter a valid price'),
})

export default function CreateLinkModal({
  isOpen,
  onClose,
  wishlistItemId,
  linkId,
}: CreateLinkModalProps) {
  const { data: linkData, loading: linkLoading } = useGetLinkQuery({
    variables: { id: linkId! },
    skip: !linkId,
  })

  const isEditing = linkData && !linkLoading

  console.log('linkData', linkData)
  console.log('isEditing', isEditing)

  const [createLink, { loading: createLoading }] = useCreateLinkMutation({
    refetchQueries: QueryKeysInvalidate.wishlist,
  })

  const [updateLink, { loading: updateLoading }] = useUpdateLinkMutation({
    refetchQueries: QueryKeysInvalidate.wishlist,
  })

  const loading = createLoading || updateLoading

  const initialValues = useMemo(() => {
    if (isEditing && linkData?.link) {
      const link = linkData.link
      return {
        url: link.url,
        title: link.title || '',
        price: link.price || '',
      }
    }
    return { url: '', title: '', price: '' }
  }, [linkData, isEditing])

  const handleSubmit = async (values: FormValues) => {
    try {
      let result

      if (isEditing && linkId) {
        result = await updateLink({
          variables: {
            id: linkId,
            input: {
              url: values.url,
              title: values.title || null,
              price: values.price || null,
            },
          },
        })

        if (result.data?.updateLink.success) {
          toast.success('Link updated successfully')
          onClose()
          return
        }

        toast.error(result.data?.updateLink.message || 'Failed to update link')
      } else {
        result = await createLink({
          variables: {
            input: {
              wishlistItemId,
              url: values.url,
              title: values.title || null,
              price: values.price || null,
            },
          },
        })

        if (result.data?.createLink.success) {
          toast.success('Link created successfully')
          onClose()
          return
        }

        toast.error(result.data?.createLink.message || 'Failed to create link')
      }
    } catch (error) {
      console.error('Error saving link:', error)
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} link`)
    }
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Link' : 'Add New Link'}
      isEditing={isEditing}
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={handleSubmit}
      loading={loading}
      submitText={isEditing ? 'Update Link' : 'Add Link'}
      loadingText={isEditing ? 'Updating...' : 'Adding...'}
    >
      <FormTextField name="url" label="URL" placeholder="https://example.com" />
      <FormTextField
        name="title"
        label="Title"
        placeholder="Enter link title (optional)"
      />
      <FormTextField
        name="price"
        label="Price"
        placeholder="Enter price (optional)"
      />
    </FormModal>
  )
}
