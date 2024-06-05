import { auth } from "../config/firebase"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import {useState, useEffect} from "react"
import HomeCSS from "../css/home.module.css"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "../config/firebase"

export const Home = () =>{
    const currentUser = auth.currentUser
    const navigate = useNavigate()

    const [agent, setAgent] = useState()
    const [map, setMap] = useState()
    const [result, setResult] = useState()
    const [time, setTime] = useState()

    const [userVods, setUserVods] = useState([])

    const handleSignOut = () =>{
      signOut(auth).then( () =>{
        navigate("/")
      }).catch((error) => {
        console.log(error)
      })
    }

    useEffect( () => {
      const getUserVods = async () =>{
         const q = query(collection(db, "videos"), where ("user_id", "==", currentUser.uid))
         const querySnapshot = await getDocs(q)
         querySnapshot.forEach( (doc) => {
          userVods.push(doc)
         })
      }
      getUserVods()
    }, [])

    return(
        <div className={HomeCSS['home-container']}>
            <div className={HomeCSS['home-top']}> 
              <h1> Library </h1>
              <button onClick={handleSignOut}> Logout </button>
            </div>
            
            <div className={HomeCSS['vod-options']}>
              <form>
                <select className={HomeCSS['select-option-first']} >
                  <option value="non"> Agent </option>
                  <option value="Astra"> Astra </option>
                  <option value="Breach"> Breach </option>
                  <option value="Brimstone"> Brimstone </option>
                  <option value="Chamber"> Chamber </option>
                  <option value="Clove"> Clove </option>
                  <option value="Cypher"> Cypher </option>
                  <option value="Deadlock"> Deadlock</option>
                  <option value="Fade"> Fade </option>
                  <option value="Gekko"> Gekko </option>
                  <option value="Harbor"> Harbor </option>
                  <option value="Iso"> Iso </option>
                  <option value="Jett"> Jett </option>
                  <option value="KAY/O"> KAY/O </option>
                  <option value="Killjoy"> Killjoy </option>
                  <option value="Neon"> Neon </option>
                  <option value="Omen"> Omen </option>
                  <option value="Phoenix"> Phoenix </option>
                  <option value="Raze"> Raze </option>
                  <option value="Reyna"> Reyna</option>
                  <option value="Sage"> Sage </option>
                  <option value="Skye"> Skye </option>
                  <option value="Sova"> Sova </option>
                  <option value="Viper"> Viper </option>
                  <option value="Yoru"> Yoru </option>
                </select>

                <select className={HomeCSS['select-option']}>
                  <option value="non"> Map </option>
                  <option value="Ascent"> Ascent </option>
                  <option value="Bind"> Bind </option>
                  <option value="Breeze"> Breeze </option>
                  <option value="Fracture"> Fracture </option>
                  <option value="Haven"> Haven </option>
                  <option value="Icebox"> Icebox </option>
                  <option value="Lotus"> Lotus </option>
                  <option value="Pearl"> Pearl </option>
                  <option value="Split"> Split </option>
                  <option value="Sunset"> Sunset </option>
                </select>

                <select className={HomeCSS['select-option']}>
                  <option className={HomeCSS['select-value']} value="non"> Result </option>
                  <option className={HomeCSS['select-value']} value="non"> Win </option>
                  <option className={HomeCSS['select-value']} value="non"> Loss </option>
                  <option className={HomeCSS['select-value']} value="non"> Draw </option>
                </select>

                <select className={HomeCSS['select-option']}>
                  <option value="non"> Time </option>
                  <option className={HomeCSS['select-value']} value="non"> Newest </option>
                  <option className={HomeCSS['select-value']} value="non"> Oldest </option>
                </select>
               </form>
               <button className={HomeCSS['upload-button']} onClick={() => navigate("/upload")}> UPLOAD </button>
            </div>
            
            <div className={HomeCSS['vod-feed']}>
               {userVods.length === 0 ? <h2> You have no VODS to review. Upload some! </h2> : <div> </div>}
            </div>
        </div>

        
    )
}