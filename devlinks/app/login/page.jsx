'use client'
import Link from "next/link"
import '../globals.css'
import { useState } from "react"
import Navbar from "../components/Navbar"
import { login } from "../backend/server"
import { useRouter } from "next/navigation"
import { useGlobalState } from "../globalstate/context"


export default function Login(){
  const router = useRouter()
  const {dispatch} = useGlobalState()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')

   async function handleSubmit(e){
    e.preventDefault()
    setLoading(!loading)
    const data = await login(email, password)
    if(data.success === false){
      setMsg(data.message)
      setLoading(!loading)
      return
    }
    setLoading(!loading)
    const userName = data.message.username
    dispatch({type:'LOG_IN'})
    router.push( `edit/${userName}`)
   }

    return(
        <>
        <Navbar/>
          <div className="w-full flex items-center justify-center back">
            <main className="lg:w-1/2 flex flex-col bg-black p-4 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <form className="text-white flex flex-col items-center" onSubmit={handleSubmit}>
                    <h1 className="m-2 text-xl text-center">LOGIN</h1>
                    <p className="m-2">Enter your email and password</p>
                    <input required type='text' value={email} className=" lg:w-1/2 m-2 p-2 rounded-lg border border-white text-black" placeholder="Email" onChange={(e)=>setEmail(e.target.value)}/>
                    <input required type='password' value={password} className="lg:w-1/2 m-2 p-2 rounded-lg border border-white text-black" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
                    <p className="m-2">{msg}</p>
                    <Link href='/login/forgot_password' className="underline m-2 p-2">Forgot password</Link>
                    <button className=" lg:w-1/2 w-3/4 m-3 p-2 rounded-lg bg-white shadow-md text-black">{loading ? 'Logging in' : 'Login'}</button>
                </form>
            </main>
          </div>
        </>
    )
}