import React, { useEffect, useContext } from 'react'
import PaddedContainer from '@/components/layout/padded-container'
import AppContext from '@/context/app-context'

const NFTsListed = () => {
    const appCtx = useContext(AppContext)

  const {provider}= appCtx

    useEffect(() => {
        // get nfts listed
    }, [])
    
  return (
    <div>NFTsListed</div>
  )
}

export default NFTsListed