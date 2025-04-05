import { useStoreCount } from '../store'

export default function StoreChildren() {
  const increment = useStoreCount(state => state.increment)

  return (
    <>
      <button style={{ border: '1px solid red' }} onClick={() => increment(1)}>Store Children 递增</button>
    </>
  )
}
