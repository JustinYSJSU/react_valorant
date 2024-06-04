import { useState } from "react"
import { auth, db, storage} from "../config/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import {ref, uploadBytes, getDownloadURL} from "firebase/storage"
import { addDoc, collection } from "firebase/firestore"
import { updateProfile } from "firebase/auth"
import RegisterCSS from "../css/register.module.css"
import { useNavigate } from "react-router-dom"

export const Register = () =>{
    
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [username, setUsername] = useState()
    const [profilePicture, setProfilePicture] = useState()
    const [feedback, setFeedback] = useState()

    const navigate = useNavigate()

    const handleAuthError = (error) => {
      switch (error.code) {
        case 'auth/email-already-exists':
          setFeedback('The email address is already in use by another account.');
          break;
        case 'auth/invalid-email':
          setFeedback('The email address is not valid.');
          break;
        case 'auth/weak-password':
          setFeedback('The password must be at least 6 characters.');
          break;
        default:
          setFeedback('An unknown error occurred.');
      }
    };

    const handleRegister = async (e) =>{
        e.preventDefault()
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log(user)
            const usersRef = collection(db, "users")

            //Upload to storage reference based off of the user id
            if (profilePicture){
              const profilePicRef = ref(storage, `profilePictures/${user.uid}`);
              uploadBytes(profilePicRef, profilePicture).then( async () =>{
                await getDownloadURL(profilePicRef).then(async (url) =>{
                    await addDoc(usersRef, {
                      email: email, 
                      profile_picture: url,
                      username: username
                    })
                    await updateProfile(user, {displayName: username, photoURL: url})
                    setFeedback("Account created successfully")
                })
                
              })
            }
            else{
                await addDoc(usersRef, {
                    email: email, 
                    profile_picture: '',
                    username: username
                  })
                  await updateProfile(user, {displayName: username, photoURL: ''})
                  setFeedback("Account created successfully")
            }
        }
        catch (error){
            handleAuthError(error)
            console.log(error.code)
        }
    }

    
    
    return(
    <div className={RegisterCSS['register-container']}>
      <div className={RegisterCSS['image-container']}>
          <img src="https://firebasestorage.googleapis.com/v0/b/react-valorant.appspot.com/o/application%2Fvalorant-jett-player-card.jpg?alt=media&token=1d116126-3476-43a6-9f51-a5881e7bebdf" alt="Description of image" className={RegisterCSS['register-image']} />
      </div>

      <div className={RegisterCSS['register-form-container']}>
        <h1> REGISTER HERE </h1>

        <form className={RegisterCSS['register-form']}onSubmit={handleRegister}>
          
          <input className={RegisterCSS['register-form-username']} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" />
          <input className={RegisterCSS['register-form-email']} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
          <input className={RegisterCSS['register-form-password']} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          
          <label className={RegisterCSS['register-form-username']}> Profile Picture <input placeholder="Profile Picture" onChange={(e) => setProfilePicture(e.target.files[0])} type="file" accept="image/png, image/jpg"/> </label>
          <button className={RegisterCSS['register-form-button']} type="submit"> REGISTER </button>

          {feedback && <p className={RegisterCSS['feedback']}> {feedback} </p> }
        </form>

        <div className={RegisterCSS['link-container']}>
            <a style={{textDecoration: 'underline', cursor: 'pointer'}}
            onClick={() => navigate('/')}
            >
              Already have an account? Click here to login.
            </a>
         </div>
        
      </div>
    </div>)
}