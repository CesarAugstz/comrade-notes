import { useState } from 'react'
import {
  useDeleteWishlistItemMutation,
  type WishlistItem,
} from '../../../generated/graphql'
import ConfirmationButton from '../../../shared/components/ui/confirmation-button'
import LinkManager from './links/link-manager'
import { Edit3, Calendar, ChevronDown, Star } from 'lucide-react'
import Button from '../../../shared/components/ui/buttons/button'
import { dayJs } from '../../../shared/utils/dayjs'
import toast from 'react-hot-toast'
import { QueryKeysInvalidate } from '../../../shared/graphql/consts/queries.consts'

interface WishlistItemListProps {
  items?: WishlistItem[]
  onEditItem?: (item: WishlistItem) => void
}

export default function WishlistItemList({
  items,
  onEditItem,
}: WishlistItemListProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const [deleteItem] = useDeleteWishlistItemMutation({
    refetchQueries: QueryKeysInvalidate.wishlist,
  })

  if (!items?.length) {
    return (
      <div className="hero bg-base-200 rounded-box">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <div className="text-base-content/50 text-lg mb-2">
              No items in this wishlist yet.
            </div>
            <div className="text-base-content/70 text-sm">
              Click "Add Item" to get started!
            </div>
          </div>
        </div>
      </div>
    )
  }

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      const result = await deleteItem({
        variables: { id: itemId },
      })

      if (result.data?.deleteWishlistItem.success) {
        toast.success('Item deleted successfully')
      } else {
        toast.error(
          result.data?.deleteWishlistItem.message || 'Failed to delete item'
        )
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Failed to delete item')
    }
  }

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-base-300'
            }`}
          />
        ))}
        <span className="text-sm text-base-content/70 ml-1">{rating}/5</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map(item => {
        const isExpanded = expandedItems.has(item.id)
        const minPrice = item.links?.length
          ? Math.min(
              ...item.links
                .map(l => parseFloat(l.price || '0'))
                .filter(p => p > 0)
            )
          : null

        return (
          <div key={item.id} className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpanded(item.id)}
              >
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
                  <h3 className="card-title text-base-content truncate">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-2 flex-wrap">
                    {item.rating && (
                      <div className="badge badge-warning gap-1 flex-shrink-0">
                        <Star className="w-3 h-3 fill-current" />
                        {item.rating}/5
                      </div>
                    )}

                    {minPrice && minPrice !== Infinity && (
                      <div className="badge badge-success flex-shrink-0">
                        from ${minPrice.toFixed(2)}
                      </div>
                    )}

                    {item.links?.length ? (
                      <div className="badge badge-info flex-shrink-0">
                        {item.links.length} links
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-xs text-base-content/50 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {dayJs(item.createdAt).fromNow()}
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              {isExpanded && <div className="divider my-4"></div>}

              {isExpanded && (
                <div className="space-y-6">
                  {item.description && (
                    <div>
                      <h4 className="font-semibold text-base-content mb-2">
                        Description
                      </h4>
                      <p className="text-base-content/70">{item.description}</p>
                    </div>
                  )}

                  {item.rating && (
                    <div>
                      <h4 className="font-semibold text-base-content mb-2">
                        Rating
                      </h4>
                      {renderRating(item.rating)}
                    </div>
                  )}

                  <LinkManager wishlistItemId={item.id} links={item.links} />

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4 border-t border-base-300">
                    <div className="text-sm text-base-content/50">
                      Created: {dayJs(item.createdAt).fromNow()}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          onEditItem?.(item)
                        }}
                        icon={<Edit3 className="w-4 h-4" />}
                      >
                        Edit
                      </Button>
                      <ConfirmationButton
                        title="Delete Item"
                        description="Are you sure you want to delete this item? This action cannot be undone."
                        confirmLabel="Delete"
                        cancelLabel="Cancel"
                        onConfirm={() => handleDeleteItem(item.id)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
