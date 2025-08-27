import type { Wishlist } from '../../../generated/graphql'
import { dayJs } from '../../../shared/utils/dayjs'

interface WishlistCardProps {
  wishlist?: Wishlist
  onClick: () => void
}

export default function WishlistCard({ wishlist, onClick }: WishlistCardProps) {
  if (!wishlist) return null

  return (
    <div
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="card-body">
        <h2 className="card-title text-base-content">{wishlist.name}</h2>
        {wishlist.description && (
          <p className="text-base-content/70 line-clamp-3">
            {wishlist.description}
          </p>
        )}
        <div className="flex justify-between items-center mt-4">
          <div className="badge badge-primary">
            {wishlist.items.length}{' '}
            {wishlist.items.length === 1 ? 'item' : 'items'}
          </div>
          <div className="text-sm text-base-content/50">
            by {wishlist.owner.name}
          </div>
        </div>
        <div className="text-xs text-base-content/50 mt-2">
          Created {dayJs(wishlist.createdAt).fromNow()}
        </div>
      </div>
    </div>
  )
}
