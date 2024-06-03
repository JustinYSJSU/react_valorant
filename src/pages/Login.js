import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import {auth} from "../config/firebase"
import { useNavigate } from "react-router-dom"
export const Login = () =>{
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [feedback, setFeedback] = useState()

    const navigate = useNavigate()

    const handleLogin = async() =>{
       try{
          await signInWithEmailAndPassword(auth, email, password)
          navigate("/home")
       }
       catch(error){
         setFeedback("Invalid username / password combination")
       }
       
    }

    return(
    <div>
        <h1> VALORANT VOD REVIEW APP LOGIN </h1>

        {feedback && <div> {feedback} </div>}
        <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        <button onClick={handleLogin}> LOGIN </button>
    </div>)
}