import { Field, Input, IconButton } from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { BsEye } from 'react-icons/bs'
import { FiEyeOff } from 'react-icons/fi'

interface Props {
  label?: string
  helperText?: string
  placeholder?: string
}

type InputType = 'password' | 'text'

export default function PasswordField({
  label,
  helperText,
  placeholder,
}: Props) {
  const [inputType, setInputType] = useState<InputType>('password')

  const toggleInput = useCallback(() => {
    setInputType(inputType === 'password' ? 'text' : 'password')
  }, [inputType])

  return (
    <Field.Root>
      {label && (
        <Field.Label fontWeight="medium" color="primary.800" mb="2">
          {label}
        </Field.Label>
      )}
      <div className="relative">
        <Input
          placeholder={placeholder}
          type={inputType}
          size="lg"
          borderRadius="lg"
          borderColor="primary.200"
          _hover={{ borderColor: 'primary.300' }}
          _focus={{
            borderColor: 'secondary.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-secondary-500)',
          }}
          bg="white"
          pr="12"
        />
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
      {helperText && (
        <Field.HelperText color="primary.600" fontSize="sm">
          {helperText}
        </Field.HelperText>
      )}
      <Field.ErrorText color="red.500" fontSize="sm" />
    </Field.Root>
  )
}
