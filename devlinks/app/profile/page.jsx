'use client'
import { useState } from "react"
import Navbar from "../components/Navbar"
import Image from "next/image"
import phone from '../../public/assets/phone.png'
import { useGlobalState } from "../globalstate/context"
import Link from "next/link"



export default function Profile() {
    const [selectedImage, setSelectedImage] = useState()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setuserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const {dispatch, state} = useGlobalState()
    const userData = state.data || {}
    const {userEmail, userFirstName, userLastName, userImage, userLinks, userName} =  userData || {}

    function handleChange(e) {
        const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
    }

    function handleSubmit() {
  setLoading(true); // Set loading state to true at the start of the action
  
  setTimeout(async () => {
    setLoading(false); // Set loading state back to false after a brief delay

    try {
      await dispatch({
        type: 'SET_DATA',
        payload: {
          userImage: selectedImage,
          userFirstName: firstName,
          userLastName: lastName,
          userEmail: email,
          userLinks: userLinks,
          userPassword : password,
          userName : username
        },
      });
    } catch (error) {
      console.error(error);
    }
  }, 500); // 100 milliseconds delay (adjust as needed)
}

function redirectToLink(url){
  if(url.startsWith('http')){
    window.location.href = url
  }
  else{
    window.location.href = 'https://' + url
  }
}

  return (
    <>
    <Navbar/>
      <main className="flex flex-col lg:flex-row mt-7">
        <div className="mr-3 hidden lg:flex container w-3/4 h-1/2 relative flex-col justify-center items-center">
  <div className="relative w-3/4">
    <Image src={phone} alt="phone" className="w-full" />
    <div className="details flex flex-col items-center">
      <div className="img-cont w-1/2">
        <Image src={userImage ? userImage : selectedImage} alt='pfp' width='200' height='200' className=" border rounded-full"/>
      </div>
      <h1 className="m-2 text-xl">{userFirstName || firstName} {userLastName || lastName}</h1>
      <p className="m-2">{userEmail || email}</p>

      <div className="links w-full">
        {userLinks && userLinks.length > 0 ? userLinks.map((link, index)=>{
          return <div key={index} className="w-full bg-red-500 rounded-md m-2 p-2 box-border" onClick={()=>redirectToLink(link.link)}>{link.name}</div>
        }) : ''}
      </div>
    </div>
  </div>
</div>


        <div className="container w-full lg:w-1/2 flex flex-col">
            <h1 className="text-xl font-bold p-2">Profile Details</h1>
            <p className="p-2">Add your details to add a personal touch to your profile</p>
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
                 <input type="text" className="md:w-3/4 w-full border rounded-md p-2" onChange={(e)=>setuserName(e.target.value)} value={username}/>
               </div>

               <div className=" p-2 block lg:w-3/4 lg:flex items-center mt-7 justify-between">
                <p>Password</p>
                 <input type="password" className="lg:w-3/4 w-full border rounded-md p-2" onChange={(e)=>setPassword(e.target.value)} value={password}/>
               </div>
               <button onClick={handleSubmit} className={`mt-3 lg:w-1/4 p-2 m-2 bg-black text-white ${loading ? 'cursor-not-allowed' : ''}`}>{loading === true ? 'Saving' : 'Save'}</button>
        </div>

          
      </main>
    </>
  );
}
