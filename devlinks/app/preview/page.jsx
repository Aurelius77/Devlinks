'use client'
import Link from "next/link";
import Image from "next/image";
import { useGlobalState } from "../globalstate/context";
import { useRouter } from "next/navigation";
import { run } from "../backend/server";
import { useState } from "react";

export default function Preview(){
  const [response, setResponse] = useState('')
  const router = useRouter()
   const [showPopup, setShowPopup] = useState(false)
   const [loading, setLoading] = useState(false)
    const {state} = useGlobalState()
    const userData = state.data || {}
    const {userFirstName, userLastName, userEmail, userImage, userLinks, userPassword} = userData
 
    function closePopup(){
        setShowPopup(!showPopup)
     }

     async function Run(){
      setLoading(!loading)
    const result = await run(userFirstName, userLastName, userImage, userEmail, userPassword, userLinks)
    setResponse(result.message)
    setLoading(!loading)
    setShowPopup(!showPopup)
    setInterval(() => {
      router.push(`/user/${userEmail}`)
    }, 1000);
  }

     function redirectToLink(url){
  if(url.startsWith('http')){
    window.location.href = url
  }
  else{
    window.location.href = 'https://' + url
  }
}
 
    return(
    <>
    <div className="bg-purple-600 w-full rounded-b-md box-border p-12">
     <nav className="bg-white p-2 m-3 rounded-md flex justify-between items-center">
       <p className="text-purple-600 border border-purple-600 p-2 m-1" onClick={()=>router.push('/profile')}>Back to Editor</p>
       <p className={`${loading ? 'cursor-not-allowed bg-purple-600 text-white rounded-md p-2 m-1' : 'bg-purple-600 text-white rounded-md p-2 m-1 cursor-pointer'}`} onClick={()=>Run()}>{loading ? 'Please Wait' : 'Share Link'}</p>
     </nav>

    </div>

    <div className="container w-full flex justify-center items-center mt-2">
       <div className="card p-5 bg-white flex flex-col items-center shadow-md rounded-md">
         <Image src={userImage || ''} className="rounded-full" alt='profile' width='200' height='200'/>
         <h1 className="p-2 m-2 text-xl font-bold">{userFirstName || ''} {userLastName || ''}</h1>
         <p className="p-2 m-2">{userEmail || ''}</p>
         <div className="links w-full">
        {userLinks && userLinks.length>0 ?userLinks.map((link, index)=>{
         return <div className="w-full bg-red-500 rounded-md m-2 p-2" key={index} onClick={()=>redirectToLink(link.link)}>{link.name}</div>
        }): ''}
      </div>
       </div>
     </div>


{showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <div className="bg-green-500 p-5 rounded-md shadow-lg">
            <p className='text'>{response}</p>
            <button onClick={closePopup} className="mt-3 bg-white text-green-500 p-2 rounded-md">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}