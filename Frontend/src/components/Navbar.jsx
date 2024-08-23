import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
      <div className='w-full bg-zinc-700 h-[9vh] flex items-center justify-between text-white'>
        <div className='pl-4' >
          <img className='w-20' src="\src\assets\Qodeit.png" alt="" />
          
        </div>

    <div className='flex items-center justify-center w-full h-full gap-5' >
    <Link className='hover:text-zinc-300 hover:scale-105' to={"/LoginIntern"}>Intern Login</Link>
    <Link className='hover:text-zinc-300 hover:scale-105' to={"/"}>HR Login</Link>
    </div>    

      </div>
    </>
  )
}

export default Navbar
