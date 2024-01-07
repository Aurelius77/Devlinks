'use client'
import { useState, useEffect} from "react"
import Navbar from "@/app/components/Navbar"
import { resetPassword } from "@/app/backend/server"
import { useRouter } from "next/navigation"
import { useGlobalState } from "@/app/globalstate/context"

export default function Password({params}){
   const {state, dispatch} = useGlobalState()

    useEffect(()=>{
        if(state.isAuthenticated === false){
        router.push('/login/forgot_password')
    }
    }, [])

    
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const email = decodeURIComponent(params.email)

    async function handleSubmit(e){
        e.preventDefault()
        setLoading(true)
        let res = await resetPassword(email, password)
        setMsg(res.message)
        if(res.success === true){
        dispatch({type:'LOG_OUT'})
        router.push('/login')
        }
        setLoading(false)
    }

    return(
        <>
          <Navbar/>
          <div className="w-full flex items-center justify-center back">
            <main className="lg:w-1/2 flex flex-col bg-black p-4 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <form className="text-white flex flex-col items-center" onSubmit={handleSubmit}>
                    <h1 className="m-2 text-xl text-center">RESET PASSWORD</h1>
                    <p className="m-2">Enter your new password.</p>
                    <input  required type='password' value={password} className=" lg:w-1/2 m-2 p-2 rounded-lg border border-white text-black" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
                    <p className="m-2">{msg}</p>
                    <button className="lg:w-1/2 w-3/4 m-3 p-2 rounded-lg bg-white shadow-md text-black">{loading ? 'Resetting' : 'Reset Password'}</button>
                </form>
            </main>
          </div>
        </>
    )
}