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
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}

      <input
        {...field}
        placeholder={placeholder}
        className={`input input-bordered w-full ${
          invalid ? 'input-error' : ''
        }`}
      />

      {meta.error && meta.touched && (
        <label className="label">
          <span className="label-text-alt text-error">{meta.error}</span>
        </label>
      )}
    </div>
  )
}
