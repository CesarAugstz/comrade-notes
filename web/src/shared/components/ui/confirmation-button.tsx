import { useCallback, useRef } from 'react'

interface Props {
  onConfirm: () => void
  onCancel?: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  buttonLabel?: string
}

export default function ConfirmationButton({
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  buttonLabel = 'Delete',
}: Props) {
  const modalRef = useRef<HTMLDialogElement>(null)

  const toggleModal = useCallback((open: boolean) => {
    if (open === false) {
      modalRef?.current?.close()
      return
    }
    modalRef?.current?.showModal()
  }, [])

  return (
    <>
      <button
        className="btn btn-sm btn-error btn-outline"
        onClick={() => toggleModal(true)}
      >
        {buttonLabel}
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{description}</p>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => {
                toggleModal(false)
                onCancel?.()
              }}
            >
              {cancelLabel}
            </button>
            <button
              className="btn btn-warning"
              onClick={() => {
                toggleModal(false)
                onConfirm()
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}
