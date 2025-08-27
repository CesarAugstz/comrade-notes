import { useField } from 'formik'

interface Props {
  name: string
  label?: string
  max?: number
}

export default function FormRatingField({ name, label, max = 5 }: Props) {
  const [field, meta, helpers] = useField(name)
  const invalid = !!(meta?.error && meta?.touched)

  const handleRatingChange = (rating: number) => {
    helpers.setValue(rating)
  }

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}

      <div className="flex items-center gap-2">
        <div className="rating rating-md">
          {Array.from({ length: max }, (_, i) => i + 1).map(star => (
            <input
              key={star}
              type="radio"
              name={`${name}-radio`}
              className="mask mask-star-2 bg-orange-400"
              checked={field.value === star}
              onChange={() => handleRatingChange(star)}
            />
          ))}
        </div>
        <span className="text-sm text-base-content/70">
          {field.value ? `${field.value}/${max}` : 'No rating'}
        </span>
        {field.value && (
          <button
            type="button"
            className="btn btn-xs btn-ghost"
            onClick={() => handleRatingChange(0)}
          >
            Clear
          </button>
        )}
      </div>

      {invalid && (
        <label className="label">
          <span className="label-text-alt text-error">{meta.error}</span>
        </label>
      )}
    </div>
  )
}
