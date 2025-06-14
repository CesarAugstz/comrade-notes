import type { Wishlist } from '../../../generated/graphql'
import Card from '../../../shared/components/ui/card'

interface WishlistCardProps {
  wishlist?: Wishlist
  onClick: () => void
}

export default function WishlistCard({ wishlist, onClick }: WishlistCardProps) {
  if (!wishlist) return null

  return (
    <Card onClick={onClick} className="h-full">
      <div className="card-body">
        <h2 className="card-title text-base-content">{wishlist.name}</h2>
        {wishlist.description && (
          <p className="text-base-content/70">{wishlist.description}</p>
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
      </div>
    </Card>
  )
}
