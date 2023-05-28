import React, { useContext, useState } from 'react'
import './login.css'
import logo from '../img/logo.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { Backdrop, CircularProgress } from '@mui/material'

export const Login = () => {
    const [sl, setSl] = useState(true)
    const [ss, setSs] = useState(false)
    

    const handles = () => {
        setSl(false)
        setSs(true)
    }
    const handlel = () => {
        setSl(true)
        setSs(false)
    }
    //storing user in context
    const {user,loading, error, dispatch} = useContext(AuthContext)
    //creditials for sign up
    const [creditials, setCreditials] = useState({
        email: undefined,
        username: undefined,
        password: undefined
    })
    //creditials for sign in
    const [sCreditials, setSCreditials] = useState({
        email: undefined,
        password: undefined
    })
    //handle sign up input change
    const handlesuchange = (e) => {
        setCreditials((prev) => ({...prev, [e.target.id]: e.target.value}))
    }
    //handle sign in input change
    const handlesichange = (e) => {
        setSCreditials((prev) => ({...prev, [e.target.id]: e.target.value})) 
    }
    //import navigate
    const navigate = useNavigate()
    //register and login in user at the same time
    const handleClicksignup = async (e) =>{
        e.preventDefault()
        setLoad(true)
        dispatch({type:"LOGIN_START"})

        try{
            const res = await axios.post("http://localhost:8800/api/auth/register",creditials)
            dispatch({type:"LOGIN_SUCCESS", payload: res.data})
            setLoad(false)
            navigate("/")
        }catch(err){
            dispatch({type:"LOGIN_FAILURE", payload:err.response.data})
            setLoad(false)
        }
    }
    //register and login in user at the same time
    const handleClicksignin = async (e) =>{
        e.preventDefault()
        setLoad(true)
        dispatch({type:"LOGIN_START"})

        try{
            const res = await axios.post("http://localhost:8800/api/auth/login",sCreditials)
            dispatch({type:"LOGIN_SUCCESS", payload: res.data})
            setLoad(false)
            navigate("/")
        }catch(err){
            dispatch({type:"LOGIN_FAILURE", payload:err.response.data})
            setLoad(false)
        }
    } 
    //set loading state
    const [load, setLoad] = useState(false)    

 
  return (
    <>
    { load && <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open>
        <CircularProgress color="success" />
      </Backdrop>}

    <div className='login'>
        <div className='lContainer'>
            <div className='heading'>
                <img className='logo' src={logo} alt='logo'/>
                
            </div>
            <div className='selection'>
                <span onClick={handlel} className={(sl ? 'sactive' : 'sLogin' )}>Login</span>
                <span onClick={handles} className={(ss ? 'sactive' : 'sSign' )}>Sign up</span>
            </div>
{ sl && <>
            <div className='useremail'>
                <span>User Email</span>
                <input type='email' id='email' onChange={handlesichange} placeholder='Enter your email address' />
            </div>
            <div className='useremail'>
                <span>Password</span>
                <input type='password' id='password' onChange={handlesichange} placeholder='Enter your password' />
            </div>
            <button onClick={handleClicksignin} className='lBtn'>
                Login
            </button>
            
 </>  }
{ ss && <>
            <div className='useremail'>
                <span>User Email</span>
                <input type='email' id='email' onChange={handlesuchange} placeholder='Enter your email address' />
            </div>
            <div className='useremail'>
                <span>Username</span>
                <input type='text' id='username' onChange={handlesuchange} placeholder='Enter username' />
            </div>
            <div className='useremail'>
                <span>Password</span>
                <input type='password' id='password' onChange={handlesuchange} placeholder='Enter your password' />
            </div>
            <button onClick={handleClicksignup} className='lBtn'>
                Sign up
            </button>
 </> }         
            <p className='quopotec'>
                Powered by QuoPoTec
            </p>

        </div>
    </div>
    </>
  )
}
