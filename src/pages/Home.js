import { auth } from "../config/firebase"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
export const Home = () =>{
    const currentUser = auth.currentUser
    const navigate = useNavigate()
    console.log(currentUser)

    const handleSignOut = () =>{
      signOut(auth).then( () =>{
        navigate("/")
      }).catch((error) => {
        console.log(error)
      })
    }
    return(
        <div>
            <h1> VALORANT VOD REVIEW HOME PAGE </h1>
            <h2> Hello, {currentUser.displayName} </h2>
            <img width="100px" height="100px" src={currentUser.photoURL} />
            <button onClick={handleSignOut}> Logout </button>
        </div>
    )
}