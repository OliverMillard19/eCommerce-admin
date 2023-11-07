import Image from 'next/image'
import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "@/components/Nav"
import Layout from "@/components/layout";
export default function Home() {
    const {data: session} = useSession();
 return <Layout>
     <div className="text-blur-900 flex justify-between">
         <h2>
             Hello,<b>{session?.user?.name}</b>
         </h2>
         <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">

            <img scr={session?.user?.image} alt="" className="w-6 h-6"/>
             <span className=" px-2">
                 {session?.user?.name}
             </span>

         </div>
     </div>


 </Layout>
}
