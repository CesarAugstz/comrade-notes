import { Field, Input } from '@chakra-ui/react'
import type { useAppForm } from '../hooks/use-app-form'
import { useField } from '@tanstack/react-form'

interface Props<T> {
  label?: string
  helperText?: string
  placeholder?: string
  form: ReturnType<typeof useAppForm>
  name: string
}

export default function TextField<T>({
  label,
  helperText,
  placeholder,
  form,
  name,
}: Props<T>) {
  const field = useField({
    form,
    name,
  })

  return (
    <Field.Root>
      {label && (
        <Field.Label fontWeight="medium" color="primary.800" mb="2">
          {label}
        </Field.Label>
      )}
      <Input
        placeholder={placeholder}
        size="lg"
        borderRadius="lg"
        borderColor="primary.200"
        _hover={{ borderColor: 'primary.300' }}
        _focus={{
          borderColor: 'secondary.500',
          boxShadow: '0 0 0 1px var(--chakra-colors-secondary-500)',
        }}
        bg="white"
      />
      {helperText && (
        <Field.HelperText color="primary.600" fontSize="sm">
          {helperText}
        </Field.HelperText>
      )}
      <Field.ErrorText color="red.500" fontSize="sm">
        {field.state.meta.errors.join(', ')}
      </Field.ErrorText>
    </Field.Root>
  )
}
