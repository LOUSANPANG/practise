import { Route, Routes } from 'react-router'

export default function RenderComponent() {
  return (
    <>
      <h1>Render Component</h1>

      <Routes>
        <Route index element={<h1>1</h1>} />
        <Route path="/step-2" element={<h1>2</h1>} />
        <Route path="/step-3" element={<h1>3</h1>} />
      </Routes>
    </>
  )
}
