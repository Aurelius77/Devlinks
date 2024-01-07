'use client'
import { useState } from "react"
import Navbar from "@/app/components/Navbar"
import { sendResetEmail } from "@/app/backend/server"
import { useRouter } from "next/navigation"

import { useGlobalState } from "@/app/globalstate/context"


export default function Password(){
    const {dispatch} = useGlobalState()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent]  = useState(false)
    const [code, setCode] = useState(null)
    const [uniquePin, setUniquePin] = useState(null)

    async function handleSubmit(e){
        e.preventDefault()
        setLoading(true)
        const res = await sendResetEmail(email)
        setLoading(false)
        if(res && res.code){
            setUniquePin(res.code)
        }
        setMsg(res.message)
        if(res.success === true){
            setEmailSent(true)
        }

    }

    function resend(){
        setEmailSent(false)
    }

    function verifyCode(){
        setLoading(true)
       if(uniquePin === code){
         setMsg('Successfully verified')
         setLoading(false)
          dispatch({type:'LOG_IN'})
         router.push(`/login/reset_password/${email}`)
       }
       else{
        setMsg('Incorrect code')
        setLoading(false)
       }
    }

    return(
        <>
          <Navbar/>
          {!emailSent&& <div className="w-full flex items-center justify-center back">
            <main className="lg:w-1/2 flex flex-col bg-black p-4 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <form className="text-white flex flex-col items-center" onSubmit={handleSubmit}>
                    <h1 className="m-2 text-xl text-center">FORGOT PASSWORD</h1>
                    <p className="m-2">Enter your email and a verification code will be sent to you</p>
                    <input  required type='text' value={email} className=" lg:w-1/2 m-2 p-2 rounded-lg border border-white text-black" placeholder="Email" onChange={(e)=>setEmail(e.target.value)}/>
                   
                    <p className="m-2">{msg}</p>
                    <button className=" lg:w-1/2 w-3/4 m-3 p-2 rounded-lg bg-white shadow-md text-black">{loading ? 'Sending' : 'Send reset code'}</button>
                </form>
            </main>
          </div>}



          {emailSent && <div className="w-full flex items-center justify-center back">
            <main className="lg:w-1/2 flex flex-col bg-black p-4 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <form className="text-white flex flex-col items-center" onSubmit={handleSubmit}>
                    <h1 className="m-2 text-xl text-center">FORGOT PASSWORD</h1>
                    <input required type='text' value={code} className=" lg:w-1/2 m-2 p-2 rounded-lg border border-white text-black"onChange={(e)=>setCode(e.target.value)}/>
                    <p className="underline" onClick={resend}>Resend code</p>
                    <p className="m-2">{msg}</p>
                    <button className=" lg:w-1/2 w-3/4 m-3 p-2 rounded-lg bg-white shadow-md text-black" onClick={verifyCode}>{loading ? 'Sending' : 'Enter'}</button>
                </form>
            </main>
          </div>}


          
        </>
    )
}