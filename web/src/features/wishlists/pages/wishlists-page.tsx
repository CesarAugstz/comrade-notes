import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useGetWishlistsQuery } from '../../../generated/graphql'
import PageHeader from '../../../shared/components/ui/page-header'
import LoadingSpinner from '../../../shared/components/ui/loading-spinner'
import ErrorMessage from '../../../shared/components/ui/error-message'
import WishlistCard from '../components/wishlist-card'
import CreateWishlistModal from '../components/create-wishlist-modal'

export default function WishlistsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const navigate = useNavigate()
  const { data, loading, error } = useGetWishlistsQuery()

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />
  if (!data?.wishlists) return <ErrorMessage message="No wishlists found" />

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="My Wishlists"
        subtitle="Organize your ideas and plans"
        action={
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Wishlist
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.wishlists.map(wishlist => (
          <WishlistCard
            key={wishlist.id}
            wishlist={wishlist}
            onClick={() => navigate(`/wishlists/${wishlist.id}`)}
          />
        ))}
      </div>

      {data.wishlists.length === 0 && (
        <div className="text-center py-12">
          <div className="text-base-content/50 text-lg">
            No wishlists yet. Create your first one!
          </div>
        </div>
      )}

      <CreateWishlistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}
