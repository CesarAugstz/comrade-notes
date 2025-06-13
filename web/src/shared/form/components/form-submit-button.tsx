import { Button } from '@chakra-ui/react'
import { useFormikContext } from 'formik'

interface Props {
  text?: string
}

export default function FormSubmitButton({ text }: Props) {
  const { isSubmitting, errors } = useFormikContext()
  return (
    <Button
      type="submit"
      loading={isSubmitting && !errors}
      loadingText="Loading..."
    >
      {text ?? 'Submit'}
    </Button>
  )
}
