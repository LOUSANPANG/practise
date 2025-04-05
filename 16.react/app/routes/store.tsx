import { useStoreCount } from '../store'
import StoreChildren from './store-children'

export default function Store() {
  const count = useStoreCount(state => state.count)
  return (
    <>
      <h1>
        Store
        {count}
      </h1>
      <StoreChildren />
    </>
  )
}
