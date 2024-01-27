import React, { useContext } from 'react'
import Footer from './layout/footer'
import Header from './layout/header'
import PaddedContainer from './layout/padded-container'
import AppContext from '@/context/app-context'

const NotConnected = () => {
  const appCtx = useContext(AppContext)

  const {setup}= appCtx


  const handleConnect = () => {
    setup()
  }


  return (
    <>
    <Header />

      <main
    className={`flex min-h-screen flex-col items-center justify-between mt-[78px] md:mt-[86px]`}
  >
      <PaddedContainer className='flex flex-col items-center'>
        <h1 className='text-5xl font-semibold text-center mt-8 mb-8'>
          You&apos; not connected :(
        </h1>
        
        <button className='btn btn-contained' onClick={handleConnect}>
          Connect Wallet
        </button>
      </PaddedContainer> 
      
    </main>

    <Footer />
    </>
    
  )
}

export default NotConnected