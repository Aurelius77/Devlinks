'use client'
import {useEffect, useState} from 'react'
import { getUser } from '@/app/backend/server'
import { useGlobalState } from '@/app/globalstate/context'
import {useRouter} from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import { updateUserInfo } from '@/app/backend/server'


export default function Edit({params}){
    const {state, dispatch} = useGlobalState()
    const router = useRouter()

    if(state.isAuthenticated===false){
        router.push('/login')
    }

    const userData = decodeURIComponent(params.userEmail)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [img, setImg] = useState(null)
    const [links, setLinks] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
    async function getData(){
         const data = await getUser(userData)

       setFirstName(data.name)
       setLastName(data.lastname)
       setEmail(data.email)
       setImg(data.image)
       setLinks(data.links)
       setUserName(data.username)
    }

    getData()
       
    }, [])


   function handleChange(e) {
        const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImg(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
    }

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


   async function saveChanges(){
    setLoading(true)
      const res = await updateUserInfo(email, firstName, lastName, img, links, userName)
      setLoading(false)
      if(res.success === true){
        router.push(`/user/${userName}`)
      }
   }

    return(
        <>
        <Navbar/>
        <main className='flex flex-col lg:flex-row mt-6 lg:p-3'>
            <div className="container w-full lg:w-1/2 flex flex-col p-2">
            <h1 className="text-xl font-bold p-2">Profile Details</h1>
            <p className="p-2">Edit your details to add a personal touch to your profile</p>
            <div className="p-2 block lg:flex items-center justify-between mt-3">
               <h1>Upload Image</h1>
               <input type='file' placeholder="Upload Image" onChange={handleChange}></input>
            </div>
            <div className=" p-2 block lg:w-3/4 lg:flex items-center mt-7 justify-between">
                 <p>First Name</p>
                 <input type="text" className="md:w-3/4 w-full border rounded-md p-2" onChange={(e)=>setFirstName(e.target.value)} value={firstName}/>
            </div>
               <div className=" p-2 block lg:w-3/4 lg:flex items-center mt-7 justify-between">
                <p>Last Name</p>
                 <input type="text" className="md:w-3/4 w-full border rounded-md p-2" onChange={(e)=>setLastName(e.target.value)} value={lastName} />
               </div>
               <div className="p-2 block lg:w-3/4 lg:flex items-center mt-7 justify-between">
                <p>Email</p>
                 <input type="email" className="md:w-3/4 w-full border rounded-md p-2" onChange={(e)=>setEmail(e.target.value)} value={email}/>
               </div>

               <div className="p-2 block lg:w-3/4 lg:flex items-center mt-7 justify-between">
                <p>Username</p>
                 <input type="email" className="md:w-3/4 w-full border rounded-md p-2" onChange={(e)=>setUserName(e.target.value)} value={userName}/>
               </div>

        </div>


        <div className='right p-2'>
    <h1 className="text-xl font-bold lg:mt-5 mb-2">Customise your links</h1>
    <p>Add/remove links to your profile below and then share</p>
    <button className="p-3 mt-5 w-full border border-black text-purple-500" onClick={()=>newLink()}>Add new link</button>

    {links && links.length > 0 && links.map((link, index)=>{
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
          value={link.name}
          onChange={(e)=>updateLinks(index, e.target.value, link.link)}
        />
        <input
        value={link.link}
          className="border border-gray-300 rounded-md px-3 py-2"
          placeholder={link.link || 'Link'}
          onChange={(e)=>updateLinks(index, link.name, e.target.value)}
        />
      </div>
    </div>
    })}

    <div className="w-full flex justify-end">
    <button className="mr-2 bg-blue-500 text-white px-3 py-1 rounded-md mt-3 " onClick={saveChanges}>{loading ? 'Saving' : 'Save'}</button>
    </div>
  </div>
        </main>
        </>
    )
}