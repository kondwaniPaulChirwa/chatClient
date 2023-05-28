import axios from 'axios'
import React, { useEffect, useState } from 'react'
import userpic from '../img/user.png'
import { format } from 'timeago.js'


export const Message = ({conversation,cuser}) => {
    const [user,setuser] = useState(null)
    useEffect(()=>{
        const friendid = conversation.members.find((friend) => friend !== cuser._id)
        const getuser = async () => {
            try{
                const res = await axios.get("http://localhost:8800/api/user/"+friendid)
                setuser(res.data)
            }catch(err){

            }
        }
        getuser()
    },[conversation,cuser])
  return (
    <>
    <div className='pFace'><img src={userpic} alt='userface' /></div>
        <div className='userchats'>
            <span className='sender'>{user?.username}</span>
            <span className='cmessage'>{conversation.message}</span>
         </div>
    <div className='eltime'>Today</div>
    </>
  )
}
