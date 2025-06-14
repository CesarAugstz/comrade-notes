import { useCallback, useState } from 'react'
import { BsEye } from 'react-icons/bs'
import { FiEyeOff } from 'react-icons/fi'
import { useField } from 'formik'

interface Props {
  name: string
  label?: string
  placeholder?: string
  onKeyDown?: (e?: React.KeyboardEvent<HTMLInputElement>) => void
}

type InputType = 'password' | 'text'

export default function FormPasswordField({
  name,
  label,
  placeholder,
  onKeyDown,
}: Props) {
  const [field, meta] = useField(name)
  const [inputType, setInputType] = useState<InputType>('password')
  const invalid = !!(meta?.error && meta?.touched)

  const toggleInput = useCallback(() => {
    setInputType(inputType === 'password' ? 'text' : 'password')
  }, [inputType])

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}

      <div className="relative">
        <input
          {...field}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          type={inputType}
          className={`input input-bordered w-full pr-12 ${
            invalid ? 'input-error' : ''
          }`}
        />
        <button
          type="button"
          onClick={toggleInput}
          className="btn btn-ghost btn-sm absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content/70"
          aria-label={
            inputType === 'password' ? 'Show password' : 'Hide password'
          }
        >
          {inputType === 'text' ? <BsEye /> : <FiEyeOff />}
        </button>
      </div>

      {meta.error && meta.touched && (
        <label className="label">
          <span className="label-text-alt text-error">{meta.error}</span>
        </label>
      )}
    </div>
  )
}
