'use client'
import Link from "next/link"
import {usePathname} from 'next/navigation'

export default function Navbar(){
   const currrentPath = usePathname()
    const routes = [
        {
            name : "Links",
            link : "/links"
        },
        {
            name : 'Profile',
            link : "/profile"
        }
    ]

    return(
        <nav className="flex items-center justify-between">
        <h1 className='text-xl p-3'>DevLinks</h1>
        <ul className="flex items-center p-3">
            {routes.map((route, key)=>{
                return <Link href={route.link} key={key}><li className={currrentPath === route.link ? 'bg-green-500 p-2 m-3' : 'm-3'}>{route.name}</li></Link>
            })}
        </ul>

        <button className="m-3">Preview</button>
        </nav>
    )
}