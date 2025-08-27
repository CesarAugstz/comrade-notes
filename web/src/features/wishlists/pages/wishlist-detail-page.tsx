import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useGetWishlistQuery } from '../../../generated/graphql'
import type { WishlistItem } from '../../../generated/graphql'
import PageHeader from '../../../shared/components/ui/page-header'
import LoadingSpinner from '../../../shared/components/ui/loading-spinner'
import ErrorMessage from '../../../shared/components/ui/error-message'
import WishlistItemList from '../components/wishlist-item-list'
import CreateItemModal from '../components/create-item-modal'
import { ArrowLeft, Plus, SortAsc } from 'lucide-react'
import Button from '../../../shared/components/ui/buttons/button'

type SortOption = 'name' | 'rating' | 'price' | 'createdAt'

export default function WishlistDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isCreateItemModalOpen, setIsCreateItemModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data, loading, error } = useGetWishlistQuery({
    variables: { id: id! },
    skip: !id,
  })

  const wishlist = data?.wishlist

  const sortedItems = useMemo(() => {
    if (!wishlist?.items) return []

    const items = [...wishlist.items]

    return items.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'rating':
          aValue = a.rating || 0
          bValue = b.rating || 0
          break
        case 'price': {
          const aPrice = Math.min(
            ...(a.links?.map(l => parseFloat(l.price || '0')) || [0])
          )
          const bPrice = Math.min(
            ...(b.links?.map(l => parseFloat(l.price || '0')) || [0])
          )
          aValue = aPrice === Infinity ? 0 : aPrice
          bValue = bPrice === Infinity ? 0 : bPrice
          break
        }
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        default:
          return 0
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      }
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
    })
  }, [wishlist?.items, sortBy, sortOrder])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />
  if (!data?.wishlist || !wishlist)
    return <ErrorMessage message="Wishlist not found" />

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(option)
      setSortOrder('desc')
    }
  }

  const handleEditItem = (item: WishlistItem) => {
    setEditingItem(item)
    setIsCreateItemModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsCreateItemModalOpen(false)
    setEditingItem(null)
  }

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title={wishlist.name}
        subtitle={
          wishlist.description ||
          `${wishlist.items.length} items • by ${wishlist.owner.name}`
        }
        backButton={
          <Button
            onClick={() => navigate('/wishlists')}
            icon={<ArrowLeft className="w-4 h-4" />}
            variant="ghost"
            size="sm"
          >
            Back to Wishlists
          </Button>
        }
        action={
          <Button
            onClick={() => setIsCreateItemModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
            variant="primary"
          >
            Add Item
          </Button>
        }
      />

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <h2 className="card-title text-2xl">
              Items ({wishlist.items.length})
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="text-sm text-base-content/70">Sort by:</span>
              <div className="join">
                {[
                  { key: 'name' as const, label: 'Name' },
                  { key: 'rating' as const, label: 'Rating' },
                  { key: 'price' as const, label: 'Price' },
                  { key: 'createdAt' as const, label: 'Created' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => toggleSort(key)}
                    className={`btn btn-sm join-item ${
                      sortBy === key ? 'btn-active' : ''
                    }`}
                  >
                    {label}
                    {sortBy === key && (
                      <SortAsc
                        className={`w-3 h-3 ml-1 transition-transform ${
                          sortOrder === 'desc' ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <WishlistItemList
            items={sortedItems as WishlistItem[]}
            onEditItem={handleEditItem}
          />
        </div>
      </div>

      <CreateItemModal
        isOpen={isCreateItemModalOpen}
        onClose={handleCloseModal}
        wishlistId={id!}
        itemId={editingItem?.id}
      />
    </div>
  )
}
