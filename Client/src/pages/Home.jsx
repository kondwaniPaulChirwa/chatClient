import React, { useContext, useEffect, useRef, useState } from 'react'
import './home.css'
import { Badge } from '@mui/material'
//import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPaperPlane, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
//import logo from '../img/logo.png'
import SendIcon from '@mui/icons-material/SendOutlined';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Message } from '../componets/Message';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { io } from 'socket.io-client';
import { Online } from '../componets/Online';
import userpic from '../img/user.png'
import { format } from 'timeago.js'
import { Searched } from '../componets/Searched';
export const Home = () => {
    
    //navigate
    const navigate = useNavigate()
    //user stored in storange and context
    const {user} = useContext(AuthContext)
    //const to hold convos
    const [convo, setConvo] = useState([])
    //redirect user
    useEffect(()=>{
        if(user){
            
        }else{
            navigate("/user/auth")
        }
    },[user])
    //fetch conversations
    useEffect(()=>{
            const getconvo = async () => {
                try{
                    const res = await axios.get("http://localhost:8800/api/convo/"+user?._id)
                    setConvo(res.data)             
                    
                }catch(err){

                }
            }
            getconvo()
    },[user])

    //i think this is for start page
    const [i, seti] = useState(true)
    const [x,setx] = useState(false)
    //////
    
    // function to handle sign out
    const handleOut = () => {
        localStorage.clear()
        window.location.reload(true)
      }
      //selected user to change border colour
      const [selecteduser, setselecteduser] = useState(null)

      //to change user ingo on top of the chatting page
      const [activechat,setactivechat] = useState(null)
      const [usetemp,settemp] = useState(null)
      
      useEffect(()=>{
        const getuser = async () => {
            const friendid = selecteduser?.members.find((friend) => friend !== user._id)
            try{
  
                const res = await axios.get("http://localhost:8800/api/user/"+friendid)
                setactivechat(res.data)
            }catch(err){

            }
        }
        getuser()
        
      },[selecteduser])
      //console.log(usetemp?.members[0])
      //fetch messages
      const [chatmessages,setchatmessages] = useState([])
      useEffect(()=>{
        const getmessages = async () => {
            try{
                const res = await axios.get("http://localhost:8800/api/message/"+selecteduser?._id)
                setchatmessages(res.data)
            }catch(err){

            }
        }
        getmessages()
      },[selecteduser])
            //scroll down
            const ref = useRef()
            useEffect(()=> {
                ref.current?.scrollIntoView({behavior:"smooth"})
            }, [chatmessages])
      //fuction to controll chat dispaly
      const handleview = (item) => {
        seti(false)
        setx(true)
        setselecteduser(item)
      }

      //new message
      const [newMessage, setnewMessage] = useState("")
        //socketio
        const socket = useRef()
        //arrival message
        const [arrived, setarravide] = useState(null)
        useEffect(()=>{
            socket.current = io("ws://localhost:8800")
            socket.current.on("getMessage", (data)=>{
                //console.log(data)
                setarravide({
                    text:data.text,
                    senderid:data.senderId,
                    createdAt:data.createdAt
                })
            })
        },[])
        //useeffect to update messages
        useEffect(()=>{
            arrived && selecteduser?.members.includes(arrived.senderid) &&
            setchatmessages(prev=>[...prev, arrived])
            //console.log(arrived)
           // console.log(chatmessages)
        },[arrived])
        const [onlineusers, setonlineusers] = useState([])
        useEffect(()=>{
            socket.current.emit("addUser", user?._id)
            socket.current.on("getusers", (users)=>{
                setonlineusers(users)
                //console.log(users)
            })
        }, [user])
        //get users for looping purposes
        const [myloop,setmyloop] = useState(null)
        const [holdloop, setholdloop] = useState(null)
        useEffect(()=>{
            const friendid = onlineusers.filter((friend) => friend.userid !== user._id)
            const getuser =  () => {
                
                setmyloop(friendid)
                setholdloop(friendid)
            }
            getuser()
        },[onlineusers])
        //console.log(myloop)
        // console.log(holdloop)
        //console.log(chatmessages)
        //console.log(onlineusers)
        const [isonline,setisonline] = useState(null)
        useEffect(()=>{
            const getOnline = async () => {
                const friendidon = selecteduser?.members.find((friend) => friend !== user._id)
                const onlineid = onlineusers.find((user) => user.userid === friendidon)
                // console.log(onlineid)
                //console.log(friendidon)
                setisonline(onlineid)
            }
            getOnline()
        },[onlineusers,selecteduser])
       
      //function to send message
      const handleSendMessage = async () => {
        const now = new Date();
        const formattedDate = now.toISOString();
        const message = {
            conversationid: selecteduser?._id,
            text:newMessage,            
            senderid: user._id,
            createdAt: formattedDate
        }
        //receiverid
        const receiverid = selecteduser?.members.find((friend) => friend !== user._id)
        //send message via socketio
        socket.current.emit("sendMessage", {
            senderId: user?._id,
            receiverid,
            text: newMessage,
            createdAt: formattedDate     
        })

        try{
            const res = axios.post("http://localhost:8800/api/message", message)
            setchatmessages([...chatmessages, message])
            setnewMessage("")
           
        }catch(e){

        }
    }

    //handle on type
    const [typing, settyping] = useState(null)
    const handletype = () => {
        const receiverid = selecteduser?.members.find((friend) => friend !== user._id)
        const mytype = "typing..."
        //send message via socketio
        socket.current.emit("typing", {
            senderid: user?._id,
            typing: mytype,
            receiverid,   
        })
    }
    //usereffect for typing
    //handle stop typing
    const handlestoptype = () => {
        setTimeout(() => {
        const receiverid = selecteduser?.members.find((friend) => friend !== user._id)
        const mytype = " "
        //send message via socketio
        socket.current.emit("typing", {
            senderid: user?._id,
            typing: mytype,
            receiverid,   
        })
    },2000)
    }
    //usereffect for typing
    
    const [holdtyping, setholdtyping] = useState(null)
    useEffect(()=>{
        socket.current.on("usertyping", (data)=>{
            //console.log(data)
            setholdtyping(data)
        })
    },[])
    //receiving data typing
    useEffect(()=>{
        holdtyping && selecteduser?.members.includes(holdtyping.senderid) &&
        settyping(holdtyping)
        //console.log(arrived)
        //console.log(chatmessages)
    },[holdtyping])


    // useEffect(()=>{

    // },[])


    // const [socket, setsocket] = useState(null)
    // useEffect(()=>{
    //     setsocket(io("ws://localhost:8800"))
    // },[])

    const [searchterm, setsearchterm] = useState("")
    const [searchedusers, setsearchedusers] = useState(null)
    const [showsearch,setshowsrearch] = useState(false)
    useEffect(()=>{
        const postsearch = async () => {
            try{
                const kres = await axios.get("http://localhost:8800/api/user/live/"+searchterm)
                const truedata = kres.data.filter((friend) => friend._id !== user._id)
                //console.log(res)
                setshowsrearch(true)
                setsearchedusers(truedata)
                //setsearchterm("")
               
            }catch(e){
    
            }
        }
        postsearch()
    },[searchterm])
    //console.log(searchedusers)
    //console.log(searchterm)
    const [id,setid] = useState(null)
    const [nwconnect,setnewconnect] = useState(null)
    useEffect(()=>{
        if(id){
        const handleconvo = async (id) => {
            
                try{
                    const res = await axios.get("http://localhost:8800/api/convo/special/"+id+"/"+user._id)
                    const creditial = {
                        senderid: user._id,
                        receiverid: id,
                        message: "Temp Hello"
                    }
                    if(res.data){
                        setnewconnect(res.data)
                        setid(null)
                        setshowsrearch(false)
                        setsearchterm("")
                        //console.log("alredy exist")
                    }else{
                        const sres = await axios.post("http://localhost:8800/api/convo/", creditial)
                        setnewconnect(sres.data)
                        setid(null)
                        setshowsrearch(false)
                        setsearchterm("")
                        //console.log("created")
                    }
                   
                }catch(e){
        
                }
            
        }
        handleconvo(id)
    }
    },[id])

     

  return (
    <div className='home'>
        <div className='hContainer'>
            <div className='chatSection'>
                <div className='notification'>
                    <div>
                      <Badge badgeContent={8} color='success'>Messages</Badge>  
                    </div>
                    <div>
                      <Badge badgeContent={5} color='success'>Notifications</Badge>  
                    </div>
                    <div>
                      <Badge badgeContent={1} color='success'>Comments</Badge>  
                    </div>
                    <div onClick={handleOut}  className='logout'>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                    </div>
                </div>



                <div className='chatslower'>
                    <div className='lchats'>
                        <div className='searchls'>
                            <input type='text'  placeholder='Search user...' onChange={(e)=>setsearchterm(e.target.value)} value={searchterm}/>
                            <span><FontAwesomeIcon icon={faMagnifyingGlass } /></span>
                            { showsearch && <div className='searchitemslist'>
                                <div className='chatitemconatiner'>

                               { searchedusers?.map((item) => (
                                    <div onClick={()=>setid(item._id)} key={item?._id} className='chatitem'>
                                    <div className='pFaces'><img src={userpic} alt='userface' /></div>
                                        <div className='userchats'>
                                            <span className='sender'>{item.username}</span>
                                        </div>
                                </div>
                                )) }
                               
                                </div>     
                            </div>}
                        </div>

                        <div className='chatitemconatiner'>
                            {nwconnect && <>
                                        <div onClick={()=>handleview(nwconnect)}  className='chatitem'>
                                            <Searched sbody={nwconnect} mid={user._id}/>
                                        </div>
                            </>}

                            { convo.map(item => (<div key={item._id} onClick={()=>handleview(item)} className={ (selecteduser?._id == item._id ? 'Selectedchatitem' : 'chatitem')}>
                                <Message conversation={item} cuser={user}/>
                            </div>))}


                        </div>
                    </div>
                    {i && <div className='lmessages'>Tap user to chat</div>}
                    {x && <div className='llmessages'>
                        <div className='chatitem'>
                                <div className='pFace'><img src={userpic} alt='userface' /></div>
                                <div className='userchats'>
                                    <span className='sender'>{activechat?.username}<div className={ (isonline ? 'success' : 'secondary')}></div></span>
                                    <span className='cmessage online'>{typing?.typing}</span>
                                </div>
                         </div>
                         <div className='messagearea'>
                           

                           { chatmessages.map(item => ( <div key={item?._id} ref={ref} className={ (user?._id === item?.senderid ? 'owner' : 'senderpart')}>
                                <div className={ (user?._id === item?.senderid ? 'actualtext' : 'senderactualtext')}>{item?.text}</div>
                                <div className='timestamp'>{format(item.createdAt)}</div>
                            </div>))}

                         </div>
                         <div className='messagesend'>
                                <input type='text' onKeyUp={handlestoptype} onKeyDown={handletype} placeholder='Enter message...' onChange={(e)=>setnewMessage(e.target.value)} value={newMessage} />
                                <span onClick={handleSendMessage} className='sendicon'><SendIcon className='iconcou'/></span>
                         </div>
                    </div>}
                    
                </div>
            </div>
            <div className='onlineUsers'>
                <div>Online users</div>
                <div className='chatitemconatiner'>
                    { holdloop &&
                    <>
                        {myloop.map((item) => (
                        <Online key={item?.userid} usersonline={item?.userid} ownerid={user?._id} />
                      ))}  
                    
                    </>}
                </div>
            </div>
        </div>
    </div>
  )
}
