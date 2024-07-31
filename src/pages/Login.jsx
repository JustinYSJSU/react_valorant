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
        setFeedback("Invalid username / password combination")
       }
       
    }

    return(
      <div className={LoginCSS['login-page']}>
        <div className={LoginCSS['login-container']}>
        <div className={LoginCSS['image-container']}>
          <img src="https://firebasestorage.googleapis.com/v0/b/react-valorant.appspot.com/o/application%2F26799f739d39fa99a7b5847a8f999706.jpg?alt=media&token=e592d27c-8888-4925-b8c9-a2c1062a833d" alt="Description of image" className={LoginCSS['login-image']} />
        </div>
         <div className={LoginCSS['login-form-container']}>
          <h1 className={LoginCSS['website-title']}> VALORANT VOD REVIEW</h1>
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

         <div className={LoginCSS['legal-terms']}>
         VALORANT VOD Review was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games.  Riot Games does not endorse or sponsor this project.
         </div>
          </div>
      </div>
      </div>
      
    
    )
}