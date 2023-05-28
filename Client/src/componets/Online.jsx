import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import userpic from '../img/user.png'

export const Online = ({usersonline,ownerid}) => {
    const [user,setuser] = useState(null)
    //console.log(usersonline)
    useEffect(()=>{
        //const friendid = usersonline.find((friend) => friend.userid !== ownerid)
        const getuser = async () => {
            try{
                const res = await axios.get("http://localhost:8800/api/user/"+usersonline)
                setuser(res.data)
            }catch(err){

            }
            
        }
        getuser()
    },[usersonline])

  return (

    <div className='chatitem'>
        <div className='pFace'><img src={userpic} alt='userface' /></div>
            <div className='userchats'>
                <span className='sender'>{user?.username}</span>
             </div>
            <div className='eltime'>online</div>
    </div>
  )
}
