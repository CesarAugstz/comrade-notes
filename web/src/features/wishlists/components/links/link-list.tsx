import type { Link } from '../../../../generated/graphql'
import { useDeleteLinkMutation } from '../../../../generated/graphql'
import { ExternalLink, Edit } from 'lucide-react'
import Button from '../../../../shared/components/ui/buttons/button'
import ConfirmationButton from '../../../../shared/components/ui/confirmation-button'
import toast from 'react-hot-toast'
import { QueryKeysInvalidate } from '../../../../shared/graphql/consts/queries.consts'

interface LinkListProps {
  links: Link[]
  onEdit?: (link: Link) => void
}

export default function LinkList({ links, onEdit }: LinkListProps) {
  const [deleteLink] = useDeleteLinkMutation({
    refetchQueries: QueryKeysInvalidate.wishlist,
  })

  const handleDeleteLink = async (linkId: string) => {
    try {
      const result = await deleteLink({
        variables: { id: linkId },
      })

      if (result.data?.deleteLink.success) {
        toast.success('Link deleted successfully')
      } else {
        toast.error(result.data?.deleteLink.message || 'Failed to delete link')
      }
    } catch (error) {
      console.error('Error deleting link:', error)
      toast.error('Failed to delete link')
    }
  }

  if (!links?.length) {
    return (
      <div className="alert">
        <div className="text-base-content/50">No links added yet.</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {links.map(link => (
        <div key={link.id} className="card card-compact bg-base-300">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary font-medium text-sm truncate flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    {link.title || link.url}
                  </a>

                  {link.price && (
                    <div className="badge badge-success badge-sm">
                      ${link.price}
                    </div>
                  )}
                </div>

                <div className="text-xs text-base-content/50 truncate">
                  {link.url}
                </div>
              </div>

              <div className="flex gap-1">
                {onEdit && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(link)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                )}
                <ConfirmationButton
                  title="Delete Link"
                  description="Are you sure you want to delete this link?"
                  confirmLabel="Delete"
                  cancelLabel="Cancel"
                  onConfirm={() => handleDeleteLink(link.id)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
