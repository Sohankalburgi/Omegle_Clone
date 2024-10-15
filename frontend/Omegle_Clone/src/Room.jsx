import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const Room = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get('name');

  useEffect(() => {
    // logic to init user
    console.log(name)
  }, [name])
  
  
    return (
    <div>Room</div>
  )
}

export default Room