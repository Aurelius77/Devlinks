'use client'
import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { useGlobalState } from "../globalstate/context"
import phone from '../../public/assets/phone.png'
import Image from "next/image"
import Link from "next/link"


export default function Links(){
    const {state, dispatch} = useGlobalState()
    const [loading, setLoading] = useState(false)
    const userData = state.data || {}
    const {userEmail, userFirstName, userLastName, userImage, userLinks, userPassword} =  userData || {}
    const [links, setLinks] = useState(userLinks ? userLinks :[
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

    function handleRemoval(index){
      const newLinks = links.filter((link, i)=> i !== index)
      setLinks(newLinks)
    }
    
function saveLinks(){
  setLoading(true); // Set loading state to true at the start of the action
  
  setTimeout(async () => {
    setLoading(false); // Set loading state back to false after a brief delay
    try {
      await dispatch({
        type: 'SET_DATA',
        payload: {
          userLinks : links,
          userImage: userImage,
          userFirstName: userFirstName,
          userLastName: userLastName,
          userEmail: userEmail,
          userPassword : userPassword
        },
      });
      
      
    } catch (error) {
      console.error(error);
    }
  }, 1000); // 100 milliseconds delay (adjust as needed)
      console.log(userLinks)
    }

    function redirectToLink(url){
  if(url.startsWith('http')){
    window.location.href = url
  }
  else{
    window.location.href = 'https://' + url
  }
}

    const devLinks = userLinks && userLinks.length > 0 ? userLinks : links
    
    return(
        <>
        <Navbar/>
        <main className="lg:flex mt-8">
         <div className=" hidden lg:block relative w-1/2">
    <Image src={phone} alt="phone" className="w-full" />
    <div className="details flex flex-col items-center">
      <div className="img-cont w-1/2">
        <Image src={userImage} alt='pfp' width='200' height='200' className=" border rounded-full"/>
      </div>
      <h1 className="m-2 text-xl">{userFirstName} {userLastName}</h1>
      <p className="m-2">{userEmail}</p>

      <div className="links w-full">
        {devLinks.map((link, index)=>{
         return <div key={index} className="w-full bg-red-500 rounded-md m-2 p-2 box-border" onClick={()=>redirectToLink(link.link)}>{link.name}</div>
        })}
      </div>
    </div>
  </div>


  <div className='right'>
    <h1 className="text-xl font-bold lg:mt-5 mb-2">Customise your links</h1>
    <p>Add/remove links to your profile below and then share</p>
    <button className="p-3 mt-5 w-full border border-black text-purple-500" onClick={()=>newLink()}>Add new link</button>

    {devLinks.map((link, index)=>{
      return <div className="border border-gray-300 rounded-md p-4 mb-4 mt-3" key={index}>
      <div className="flex justify-between mb-4">
        <span>Link</span>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded-md"
          onClick={()=>handleRemoval(index)}
        >
          Remove
        </button>
      </div>
      <div className="flex flex-col">
        <input
          className="border border-gray-300 rounded-md px-3 py-2 mb-2"
          placeholder={link.name || 'Name'}
          onChange={(e)=>updateLinks(index, e.target.value, link.link)}
        />
        <input
          className="border border-gray-300 rounded-md px-3 py-2"
          placeholder={link.link || 'Link'}
          onChange={(e)=>updateLinks(index, link.name, e.target.value)}
        />
      </div>
    </div>
    })}

    <div className="w-full flex justify-end">
    <button className="mr-2 bg-blue-500 text-white px-3 py-1 rounded-md mt-3 " onClick={saveLinks}>{loading ? 'Saving' : 'Save'}</button>
    </div>
  </div>
        </main>
        </>
    )
}