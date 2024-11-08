import { useState } from 'react'
import Landing from './Components/Landing'



function App() {
  const [username, setUsername] = useState("")

  return (
    <>
    <Landing/>
    </>
  )
}

export default App
