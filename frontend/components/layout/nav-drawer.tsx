import Link from 'next/link'
import React, {useState} from 'react'
import {AiOutlineMenu} from "react-icons/ai"

const NAV_ITEMS = [
  {
    text: "home",
    link: "/"
  },
  {
    text: "account",
    link: "/account"
  },
  // {
  //   text: "news",
  //   link: "/news"
  // },
  {
    text: "invest",
    link: "/investments"
  },
  {
    text: "groups",
    link: "/saving-groups"
  },
  {
    text: "PIGGY",
    link: "/piggy"
  },
  {
    text: "about",
    link: "/about"
  },

]

const NavContent = () => {


    return <>

        
        


        <ul className='w-full block'>
          {NAV_ITEMS.map((item, index) => {
            return <Link key={index} href={item.link} >
            <li className={`block px-4 py-2 my-0 mb-4 rounded-lg bg-zinc-100 dark:bg-black capitalize  hover:bg-zinc-200`}>
              {item.text}
              </li>
            </Link>
  
          })}
        
        </ul>
      </>
}


const NavDrawer = () => {
    const [open, setOpen] = useState(false)

    const handleToggleOpen = () => {
        setOpen(prev => !prev)
      }

  return (
    <>
        <button onClick={handleToggleOpen} className='inline-block md:hidden'>
            <AiOutlineMenu />
        </button>

        <div className={`fixed top-0 w-[230px] z-[100] h-screen border-l border-zinc-200 bg-zinc-50 dark:bg-black ${open ? "right-0": "right-[-230px]"} p-4 block md:hidden`}>
        <div className='flex flex-col mb-4'>
        <button className='btn btn-icon self-end bg-zinc-100 dark:bg-stone-900 ' onClick={handleToggleOpen}>
          &times;
        </button>
        </div>
        <NavContent />
        </div>
        
    </>
  )
}

export default NavDrawer