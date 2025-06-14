import type { InternalRefetchQueriesInclude } from '@apollo/client'

export const QueryKeysInvalidate = {
  wishlist: ['GetWishlists', 'GetWishlist'],
} satisfies Record<string, InternalRefetchQueriesInclude>
