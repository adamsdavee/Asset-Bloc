import Link from 'next/link'
import React, { useContext } from 'react'
import { useRouter } from "next/router";
import AppContext from '@/context/app-context';


const Nav = () => {
  const router = useRouter()
  const appCtx = useContext(AppContext)

  const {connected} = appCtx



  return (
    <ul className=' items-center hidden md:flex'>
      <Link href={`/`} className={`px-4 hover:text-red-600 ${router.pathname === "/" ? "text-red-600" : ""} `}>
      <li className={`
      `}>Home</li>
      </Link>

      {/* <Link href={`/account`} className={`px-4 hover:text-red-600 ${router.pathname === "/" ? "text-red-600" : ""} `}>
      <li className={`
      `}>Account</li>
      </Link> */}

      {/* <Link href={`/news`} className={`px-4 hover:text-red-600 ${router.pathname === "/news" ? "text-red-600" : ""} `}>
      <li className={`
      `}>News</li>
      </Link> */}
      
      <Link href={`/saving-groups`} className={`px-4 hover:text-red-600 ${router.pathname === "/saving-groups" ? "text-red-600" : ""} `}>
      <li className={`
      `}>Groups</li>
      </Link>

      <Link href={`/investments`} className={`px-4 hover:text-red-600 ${router.pathname === "/investments" ? "text-red-600" : ""} `}>
      <li className={`
      `}>Invest</li>
      </Link>

      <Link href={`/about`} className={`px-4 hover:text-red-600 ${router.pathname === "/about" ? "text-red-600" : ""} `}>
      <li className={`
      `}>About</li>
      </Link>

      <Link href={`/piggy`} className={`px-4 hover:text-red-600 ${router.pathname === "/piggy" ? "text-red-600" : ""} `}>
      <li className={`
      `}>PIGGY</li>
      </Link>

      <Link href={`/account`} className={`px-4 hover:text-red-600 ${router.pathname === "/account" ? "text-red-600" : ""} `}>
      <li className={`
      `}>Account</li>
      </Link>
    </ul>
  )
}

export default Nav