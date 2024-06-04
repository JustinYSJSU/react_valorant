import { auth } from "../config/firebase"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import {useState} from "react"
import HomeCSS from "../css/home.module.css"
import { Placeholder } from "react-bootstrap"

export const Home = () =>{
    const currentUser = auth.currentUser
    const navigate = useNavigate()
    const [modal, setModal] = useState(false)

    const [agent, setAgent] = useState()
    const [map, setMap] = useState()
    const [result, setResult] = useState()
    const [time, setTime] = useState()

    console.log(currentUser)

    const handleSignOut = () =>{
      signOut(auth).then( () =>{
        navigate("/")
      }).catch((error) => {
        console.log(error)
      })
    }
    return(
        <div className={HomeCSS['home-container']}>
            <div className={HomeCSS['home-top']}> 
              <h1> Library </h1>
              <button onClick={handleSignOut}> Logout </button>
            </div>
            
            <div className={HomeCSS['vod-options']}>

              <form>
                <select class="selectpicker" className={HomeCSS['select-option-first']} >
                  <option value="non"> Agent </option>
                  
                </select>

                <select className={HomeCSS['select-option']}>
                  <option value="non"> Map </option>
                </select>

                <select className={HomeCSS['select-option']}>
                  <option className={HomeCSS['select-value']} value="non"> Result </option>
                  <option className={HomeCSS['select-value']} value="non"> Win </option>
                  <option className={HomeCSS['select-value']} value="non"> Loss </option>
                </select>

                <select className={HomeCSS['select-option']}>
                  <option value="non"> Time </option>
                  <option className={HomeCSS['select-value']} value="non"> Newest </option>
                  <option className={HomeCSS['select-value']} value="non"> Oldest </option>
                </select>

               </form>
               <button className={HomeCSS['upload-button']} onClick={() => setModal(true)}> UPLOAD </button>
            </div>
            

            {modal && (
             <div className={HomeCSS['upload-modal']}>
                 <h1 className={HomeCSS['upload-modal-header']}>
                    <p className={HomeCSS['upload-modal-title']}> Upload VOD </p>
                    <button className={HomeCSS['upload-modal-cancel']} onClick={() => setModal(false)}> x </button>

                 </h1>
             </div>
            )}
        </div>

        
    )
}