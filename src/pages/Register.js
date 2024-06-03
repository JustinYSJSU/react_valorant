import { useState } from "react"
import { auth, db, storage} from "../config/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import {ref, uploadBytes, getDownloadURL} from "firebase/storage"
import { addDoc, collection } from "firebase/firestore"
import { updateProfile } from "firebase/auth"

export const Register = () =>{
    
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [username, setUsername] = useState()
    const [profilePicture, setProfilePicture] = useState()
    const [feedback, setFeedback] = useState()

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

    const handleRegister = async () =>{
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
            }
        }
        catch (error){
            handleAuthError(error)
            console.log(error.code)
        }
    }

    
    
    return(<div>
        <h1> VALORANT VOD REVIEW APP REGISTER </h1>

        {feedback && <div> {feedback} </div>}
        <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" />
        <input onChange={(e) => setProfilePicture(e.target.files[0])} type="file" accept="image/png, image/jpg"/>
        <button onClick={handleRegister}> REGISTER </button>
    </div>)
}