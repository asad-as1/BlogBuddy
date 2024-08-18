import React from 'react'
import {useNavigate} from 'react-router-dom'


function LogoutBtn() {
    const navigate = useNavigate()
    const logoutHandler = () => {
       
    }
  return (
    <button
    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
    onClick={logoutHandler}
    >Logout</button>
  )
}
         
export default LogoutBtn