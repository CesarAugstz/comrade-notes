import { useGetWishlistsQuery } from '../../generated/graphql'

export default function Home() {
  const { data, loading, error } = useGetWishlistsQuery()

  console.log(data, loading, error)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Home</h1>
    </div>
  )
}
