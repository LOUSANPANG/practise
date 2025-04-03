import { useStoreCount } from '../store'

export default function Store() {
  const count = useStoreCount(state => state.count)
  const increment = useStoreCount(state => state.increment)
  return (
    <>
      <h1>Store</h1>
      <h2>{count}</h2>
      <button style={{ border: '1px solid red' }} onClick={() => increment(1)}>递增</button>
    </>
  )
}
