'use client'
import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { useGlobalState } from "../globalstate/context"
import phone from '../../public/assets/phone.png'
import Image from "next/image"
import Link from "next/link"


export default function Links(){
    const {state} = useGlobalState()
    const userData = state.data || {}
    const {email, firstName, lastName, image} =  userData || {}
    const [links, setLinks] = useState([
      {name: 'Github', link: 'https://yourgithub.com'},
      {name : 'Portfolio', link:'https://yourportfolio.com'}
    ])

    function updateLinks(index, newName, newLink){
      const newData = [...links]
      newData[index] = {...newData[index], name:newName, link:newLink}
      setLinks(newData)

    }
    
    function newLink(){
       setLinks([...links, {name:'', link:''}])
    }
    
    
    return(
        <>
        <Navbar/>
        <main className="flex mt-8">
         <div className="relative w-1/2">
    <Image src={phone} alt="phone" className="w-full" />
    <div className="details flex flex-col items-center">
      <div className="img-cont w-1/2">
        <Image src={image} alt='pfp' width='200' height='200' className=" border rounded-full"/>
      </div>
      <h1 className="m-2 text-xl">{firstName} {lastName}</h1>
      <p className="m-2">{email}</p>

      <div className="links w-full">
        {links.map((link, index)=>{
         return <Link href={link.link} key={index}><div className="w-full bg-red-500 rounded-md m-2 p-2 box-border">{link.name}</div></Link>
        })}
      </div>
    </div>
  </div>


  <div className='right'>
    <h1 className="text-xl font-bold lg:mt-5 mb-2">Customise your links</h1>
    <p>Add/remove links to your profile below and then share</p>
    <button className="p-3 mt-5 w-full border border-black text-purple-500">Add new link</button>

    <div className="border border-gray-300 rounded-md p-4 mb-4">
      <div className="flex justify-between mb-4">
        <span>Link</span>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded-md"
        >
          Remove
        </button>
      </div>
      <div className="flex flex-col">
        <input
          className="border border-gray-300 rounded-md px-3 py-2 mb-2"
          placeholder="Name"
        />
        <input
          className="border border-gray-300 rounded-md px-3 py-2"
          placeholder="Link"
        />
      </div>
    </div>
  </div>
        </main>
        </>
    )
}