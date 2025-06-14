import type { WishlistItem } from '../../../generated/graphql'
import Accordion from '../../../shared/components/ui/accordion'
import ConfirmationButton from '../../../shared/components/ui/confirmation-button'

interface WishlistItemListProps {
  items?: WishlistItem[]
}

export default function WishlistItemList({ items }: WishlistItemListProps) {
  if (!items?.length) {
    return (
      <div className="text-center py-12">
        <div className="text-base-content/50 text-lg">
          No items in this wishlist yet.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map(item => (
        <Accordion key={item.id} title={item.name}>
          <div className="space-y-4">
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
                <h4 className="font-semibold text-base-content mb-2">Rating</h4>
                <div className="flex items-center">
                  <div className="rating rating-sm">
                    {[1, 2, 3, 4, 5].map(star => (
                      <div
                        key={star}
                        className={`mask mask-star-2 ${
                          star <= item.rating! ? 'bg-orange-400' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-base-content/70">
                    {item.rating}/5
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-base-300">
              <div className="text-sm text-base-content/50">
                Created: {new Date(item.createdAt).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm btn-outline">Edit</button>
                <ConfirmationButton
                  title="Delete Item"
                  description="Are you sure you want to delete this item?"
                  confirmLabel="Delete"
                  cancelLabel="Cancel"
                  onConfirm={() => {}}
                />
              </div>
            </div>
          </div>
        </Accordion>
      ))}
    </div>
  )
}
