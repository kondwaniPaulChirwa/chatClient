import axios from 'axios'
import React, { useEffect, useState } from 'react'
import userpic from '../img/user.png'


export const Searched = ({sbody,mid}) => {
    const [user,setuser] = useState(null)
    //console.log(sbody)
    useEffect(()=>{
        const friendid = sbody.members.find((friend) => friend !== mid)
        const getuser = async () => {
            //console.log(friendid)
            try{
                const res = await axios.get("http://localhost:8800/api/user/"+friendid)
                setuser(res.data)
            }catch(err){

            }
            
        }
        getuser()
    },[sbody])
  return (
    <>
            <div className='pFace'><img src={userpic} alt='userface' /></div>
                <div className='userchats'>
                <span className='sender'>{user?.username}</span>
            </div>
    </>
  )
}
