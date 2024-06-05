import { auth } from "../config/firebase"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import {useState, useEffect} from "react"
import HomeCSS from "../css/home.module.css"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "../config/firebase"

export const Home = () =>{
    const navigate = useNavigate()

    const [agent, setAgent] = useState()
    const [map, setMap] = useState()
    const [result, setResult] = useState()
    const [time, setTime] = useState()

    const [username, setUsername] = useState()
    const [userID, setUserID] = useState()
    const [userVods, setUserVods] = useState([])
    const [loading, setLoading] = useState(true)

    const handleSignOut = () =>{
      signOut(auth).then( () =>{
        navigate("/")
      }).catch((error) => {
        console.log(error)
      })
    }

    useEffect( () =>{
      const getUserInfo = async () =>{
        auth.onAuthStateChanged( (user) =>{
          if(user){
            setUsername(user.displayName)
            setUserID(user.uid)
          }
        })
      }
      getUserInfo()
    }, [])

    
    useEffect( () => {
      const getUserVods = async () =>{
        const copyOfVods = []
         if(!userID){
          return;
         }
         
         try{
           
           setLoading(true)
           const q = query(collection(db, "videos"), where ("user_id", "==", userID))
           const querySnapshot = await getDocs(q)
           querySnapshot.forEach((doc) =>{
             console.log(doc.data())
             const vod_info = {
              agent: doc.data().agent, 
              map: doc.data().map, 
              timestamp: doc.data().timestamp, 
              vod_url: doc.data().video_url, 
              vod_title: doc.data().title, 
              result: doc.data().result, 
              vod_id: doc.id
             }
            copyOfVods.push(vod_info)
           })
        }
        catch(error){
          console.log(error)
        }
        finally{
          setUserVods(copyOfVods)
          setLoading(false)
        }
         
      }
      getUserVods()
    }, [userID])
    

    return(
        <div className={HomeCSS['home-container']}>
            <div className={HomeCSS['home-top']}> 
              <h1> Library </h1>
              <button onClick={handleSignOut}> Logout </button>

              {username && <div> Hi, {username} </div>}
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
               {!loading && userVods.length === 0 && <h2> No VODS to review. Upload one! </h2>}
               {!loading && userVods.length !== 0 && userVods.map(vod => (
                  <div className={HomeCSS['vod-display']}>
                    <video  onClick={() => navigate(`/vod/${vod.vod_id}`)} className={HomeCSS['vod']} width="60%" height="60%" controls preload="metadata"> 
                      <source src={vod.vod_url + "#t=0.1"}  type="video/mp4" />
                    </video>
                    <div className={HomeCSS['vod-title-time']}>
                      <p style={{marginLeft: "15px"}}>
                        {vod.vod_title} ◦ {new Date(vod.timestamp).toLocaleString()}
                      </p>
                    </div>

                    <div className={HomeCSS['vod-desc']}>
                      <p style={{marginLeft: "15px"}}> Agent: {vod.agent} </p>
                      <p style={{marginLeft: "10px"}}> Map: {vod.map} </p>
                      <p style={{marginLeft: "10px"}}> Result: {vod.result} </p>
                    </div>
                  </div>
               ))}
            </div>
        </div>

        
    )
}