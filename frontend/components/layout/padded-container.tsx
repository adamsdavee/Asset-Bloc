import React from 'react'

interface propTypes {
    children?: React.ReactNode,
    className?: string
}

const PaddedContainer = ({children="", className=""}: propTypes) => {


  return (
    <div className={`px-8 py-8  md:px-16 lg:px-24 w-full ${className}`}>
        {children}
    </div>
  )
}

export default PaddedContainer