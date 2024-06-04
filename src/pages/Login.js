import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import {auth} from "../config/firebase"
import { useNavigate } from "react-router-dom"
import LoginCSS from "../css/login.module.css"

export const Login = () =>{
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [feedback, setFeedback] = useState()

    const navigate = useNavigate()

    const handleLogin = async(e) =>{
      e.preventDefault()
       try{
          await signInWithEmailAndPassword(auth, email, password)
          navigate("/home")
       }
       catch(error){
        console.log("ERROR")
        setFeedback("Invalid username / password combination")
       }
       
    }

    return(
      <div className={LoginCSS['login-container']}>
        <div className={LoginCSS['image-container']}>
          <img src="https://firebasestorage.googleapis.com/v0/b/react-valorant.appspot.com/o/application%2Fezgif-3-4dfcd255d0.jpg?alt=media&token=991440b2-af5e-4a08-862d-c85ebf28fd2b" alt="Description of image" className={LoginCSS['login-image']} />
        </div>
         <div className={LoginCSS['login-form-container']}>
          <h1 className={LoginCSS['website-title']}> VALORANT VOD REVIEW APP </h1>
          <h2 className={LoginCSS['website-desc']}> Upload. Review. Improve. </h2>
    
         <form className={LoginCSS['login-form']} onSubmit={handleLogin}>
           <input className={LoginCSS['login-form-email']} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
           <input className={LoginCSS['login-form-password']} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
           <button className={LoginCSS['login-form-button']} type="submit"> LOGIN </button>
           {feedback && <div className={LoginCSS['feedback']}> {feedback} </div>}
         </form>
         <div className={LoginCSS['link-container']}>
            <a style={{textDecoration: 'underline', cursor: 'pointer'}}
            onClick={() => navigate('/register')}
            >
              Ready to rank up? Click here to register.
            </a>
         </div>
          </div>
      </div>
    
    )
}