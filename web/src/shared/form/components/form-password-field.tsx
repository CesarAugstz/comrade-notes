import { Field, Input, IconButton } from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { BsEye } from 'react-icons/bs'
import { FiEyeOff } from 'react-icons/fi'
import { useField } from 'formik'

interface Props {
  name: string
  label?: string
  placeholder?: string
}

type InputType = 'password' | 'text'

export default function FormPasswordField({ name, label, placeholder }: Props) {
  const [field, meta] = useField(name)
  const [inputType, setInputType] = useState<InputType>('password')
  const invalid = !!(meta?.error && meta?.touched)

  const toggleInput = useCallback(() => {
    setInputType(inputType === 'password' ? 'text' : 'password')
  }, [inputType])

  return (
    <Field.Root invalid={invalid}>
      {label && <Field.Label>{label}</Field.Label>}

      <div className="relative">
        <Input {...field} placeholder={placeholder} type={inputType} pr="12" />
        <IconButton
          aria-label={
            inputType === 'password' ? 'Show password' : 'Hide password'
          }
          onClick={toggleInput}
          variant="ghost"
          size="sm"
          position="absolute"
          right="3"
          top="50%"
          transform="translateY(-50%)"
          color="primary.500"
          _hover={{ color: 'primary.700' }}
        >
          {inputType === 'text' ? <BsEye /> : <FiEyeOff />}
        </IconButton>
      </div>

      <Field.ErrorText>{meta.error}</Field.ErrorText>
    </Field.Root>
  )
}
