import { Field, Input } from '@chakra-ui/react'
import { useField } from 'formik'

interface Props {
  name: string
  label?: string
  placeholder?: string
}

export default function FormTextField({ name, label, placeholder }: Props) {
  const [field, meta] = useField(name)
  const invalid = !!(meta?.error && meta?.touched)

  return (
    <Field.Root invalid={invalid}>
      {label && <Field.Label>{label}</Field.Label>}

      <Input {...field} placeholder={placeholder} />

      <Field.ErrorText>{meta.error}</Field.ErrorText>
    </Field.Root>
  )
}
