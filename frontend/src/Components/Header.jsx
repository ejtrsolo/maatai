import React from 'react'
import { IoLogoLinkedin } from "react-icons/io5";
import logo from './../assets/images/logo.png'
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    return (
        <div className='flex justify-between items-center p-[16px]'>
            <img src={logo} className='w-[180px]'/>
            <ul className='flex gap-4 md:gap-14'>
                <li className='hover:font-bold cursor-pointer' onClick={() => navigate('/')}>Inicio</li>
            </ul>
            <a href="https://www.linkedin.com/in/ernesto-jacobo-troncoso-de-la-riva-977182219/" target="_blank" rel="noreferrer">
                <button className='bg-teal-600 rounded-full text-white flex items-center'>
                    <IoLogoLinkedin className='ml-3 text-[20px]'/> &nbsp;Ir a Linkedin
                </button>
            </a>
        </div>
    )
}

export default Header