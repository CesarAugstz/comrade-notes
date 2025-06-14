import { useFormikContext } from 'formik'

interface Props {
  text?: string
  onClick?: (e?: React.MouseEvent) => void
  className?: string
}

export default function FormSubmitButton({ text, onClick, className }: Props) {
  const { isSubmitting, errors } = useFormikContext()
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={isSubmitting && !Object.keys(errors).length}
      className={`btn ${className} ${
        isSubmitting && !Object.keys(errors).length ? 'loading' : ''
      }`}
    >
      {isSubmitting && !Object.keys(errors).length ? (
        <span className="loading loading-spinner"></span>
      ) : null}
      {text ?? 'Submit'}
    </button>
  )
}
