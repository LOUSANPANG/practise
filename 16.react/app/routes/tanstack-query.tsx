import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

function Main() {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['testData'],
    queryFn: async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos/1',
      )
      return await response.json()
    },
  })

  if (isPending)
    return 'Loading...'
  if (error)
    return `An error has occurred: ${error.message}`

  return (
    <div>
      <div>{isFetching ? 'Updating...' : ''}</div>
      <h1>{data.title}</h1>
    </div>
  )
}

export default function TanstackQuery() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  )
}
