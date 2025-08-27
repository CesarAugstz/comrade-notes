import { useState } from 'react'
import LinkList from './link-list'
import CreateLinkModal from './create-link-modal'
import type { Link } from '../../../../generated/graphql'
import { Plus, Link as LinkIcon } from 'lucide-react'
import Button from '../../../../shared/components/ui/buttons/button'

interface LinkManagerProps {
  wishlistItemId: string
  links: Link[]
}

export default function LinkManager({
  wishlistItemId,
  links,
}: LinkManagerProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
    setEditingLink(null)
  }

  const handleEditLink = (link: Link) => {
    setEditingLink(link)
    setIsCreateModalOpen(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-base-content/70" />
          <h4 className="font-semibold text-base-content">
            Links ({links.length})
          </h4>
        </div>

        <Button
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
          icon={<Plus className="w-3 h-3" />}
        >
          Add Link
        </Button>
      </div>

      <LinkList links={links} onEdit={handleEditLink} />

      <CreateLinkModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        wishlistItemId={wishlistItemId}
        linkId={editingLink?.id}
      />
    </div>
  )
}
