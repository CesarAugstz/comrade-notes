import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useGetWishlistsQuery, type Wishlist } from '../../../generated/graphql'
import PageHeader from '../../../shared/components/ui/page-header'
import LoadingSpinner from '../../../shared/components/ui/loading-spinner'
import ErrorMessage from '../../../shared/components/ui/error-message'
import WishlistCard from '../components/wishlist-card'
import CreateWishlistModal from '../components/create-wishlist-modal'
import { Plus } from 'lucide-react'
import Button from '../../../shared/components/ui/buttons/button'

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
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
            variant="primary"
          >
            Create Wishlist
          </Button>
        }
      />

      {data.wishlists.length === 0 ? (
        <div className="hero bg-base-200 rounded-box">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <div className="text-base-content/50 text-lg mb-4">
                No wishlists yet
              </div>
              <div className="text-base-content/70 mb-6">
                Create your first wishlist to get started!
              </div>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                icon={<Plus className="w-4 h-4" />}
              >
                Create Wishlist
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.wishlists.map(wishlist => (
            <WishlistCard
              key={wishlist.id}
              wishlist={wishlist as Wishlist}
              onClick={() => navigate(`/wishlists/${wishlist.id}`)}
            />
          ))}
        </div>
      )}

      <CreateWishlistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}
