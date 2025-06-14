import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useGetWishlistQuery } from '../../../generated/graphql'
import PageHeader from '../../../shared/components/ui/page-header'
import LoadingSpinner from '../../../shared/components/ui/loading-spinner'
import ErrorMessage from '../../../shared/components/ui/error-message'
import WishlistItemList from '../components/wishlist-item-list'
import CreateItemModal from '../components/create-item-modal'

export default function WishlistDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isCreateItemModalOpen, setIsCreateItemModalOpen] = useState(false)
  const { data, loading, error } = useGetWishlistQuery({
    variables: { id: id! },
    skip: !id,
  })

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />
  if (!data?.wishlist) return <ErrorMessage message="Wishlist not found" />

  const wishlist = data.wishlist

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title={wishlist.name}
        subtitle={wishlist.description || undefined}
        action={
          <div className="flex gap-3">
            <button
              className="btn btn-primary"
              onClick={() => setIsCreateItemModalOpen(true)}
            >
              Add Item
            </button>
            <button
              className="btn btn-outline"
              onClick={() => navigate('/wishlists')}
            >
              ← Back to Wishlists
            </button>
          </div>
        }
      />

      <div className="bg-base-100 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-base-content">
            Items ({wishlist.items.length})
          </h2>
          <div className="text-sm text-base-content/50">
            by {wishlist.owner.name}
          </div>
        </div>

        <WishlistItemList items={wishlist.items} />
      </div>

      <CreateItemModal
        isOpen={isCreateItemModalOpen}
        onClose={() => setIsCreateItemModalOpen(false)}
        wishlistId={id!}
      />
    </div>
  )
}
