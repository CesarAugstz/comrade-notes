import { Button } from '@chakra-ui/react'
import { useFormikContext } from 'formik'

interface Props {
  text?: string
  onClick?: (e?: React.MouseEvent) => void
  className?: string
}

export default function FormSubmitButton({ text, onClick, className }: Props) {
  const { isSubmitting, errors } = useFormikContext()
  return (
    <Button
      type="submit"
      loading={isSubmitting && !errors}
      loadingText="Loading..."
      onClick={onClick}
      className={className}
    >
      {text ?? 'Submit'}
    </Button>
  )
}
