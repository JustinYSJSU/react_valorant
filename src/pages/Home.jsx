import { auth } from "../config/firebase"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import {useState, useEffect} from "react"
import HomeCSS from "../css/home.module.css"
import { collection, getDocs, query, where, orderBy, getDoc } from "firebase/firestore"
import { db } from "../config/firebase"
import { formatDistanceToNow } from "date-fns"
import ResponsiveAppBar from "../components/Navigation";

export const Home = () =>{
    const navigate = useNavigate()

    const [filterSettings, setFilterSettings] = useState({
      agent: "none",
      map: "none", 
      result: "none", 
      time: "none"
    })

    const [username, setUsername] = useState()
    const [userID, setUserID] = useState()
    const [userVods, setUserVods] = useState([])
    const [vodsToShow, setVodsToShow] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() =>{
      const handleUpdate = async () =>{
        let copyOfUserVods = [...userVods]
        const filteredSettings = Object.fromEntries(
          Object.entries(filterSettings).filter(([key, value]) => value !== 'none')
        );
        console.log(filteredSettings)
        for(const [key, value] of Object.entries(filteredSettings)){
          if(key !== "time"){
             console.log(copyOfUserVods)
             console.log("FILTER BY: " +  key + "=" + value)
             copyOfUserVods = copyOfUserVods.filter( vod => vod[key] === value)
             
          }
        }
        setVodsToShow(copyOfUserVods)
      }
      handleUpdate()
    }, [filterSettings])

    const convertTimestamp = (timestamp) =>{
      const ms = (timestamp.seconds) * 1000 + (timestamp.nanoseconds / 1000000)
      return new Date(ms)
    }

    const fromNow = (timestamp) =>{
      return formatDistanceToNow(timestamp, {addSuffix: true})
    }

    const handleAgentChange = async (e) =>{
      const copyOfFilterSettings = {...filterSettings, agent: e.target.value}
      setFilterSettings(copyOfFilterSettings)
    }

    const handleMapChange = (e) =>{
      const copyOfFilterSettings = {...filterSettings, map: e.target.value}
      setFilterSettings(copyOfFilterSettings)
    }

    const handleResultChange =(e) =>{
      const copyOfFilterSettings = {...filterSettings, result: e.target.value}
      setFilterSettings(copyOfFilterSettings)
    }

    const handleTimeChange = (e) =>{
      const copyOfFilterSettings = {...filterSettings, time: e.target.value}
      setFilterSettings(copyOfFilterSettings)
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
           const q = query(collection(db, "videos"), where ("user_id", "==", userID), orderBy("timestamp", "desc"))
           const querySnapshot = await getDocs(q)
           querySnapshot.forEach((doc) =>{
             console.log(doc.data())
             const readableTimestamp = convertTimestamp(doc.data().timestamp)
             console.log(readableTimestamp)
             const vod_info = {
              agent: doc.data().agent, 
              map: doc.data().map, 
              timestamp: readableTimestamp, 
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
          setVodsToShow(copyOfVods)
          setLoading(false)
        }
         
      }
      getUserVods()
    }, [userID])
    

    return(
        
        <div className={HomeCSS['home-container']}>
          <ResponsiveAppBar />
           
            
            <div className={HomeCSS['vod-options']}>
              <form>
                <select onChange={(e) => {handleAgentChange(e)}} className={HomeCSS['select-option-first']} >
                  <option value="none"> Agent </option>
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

                <select onChange={(e) => {handleMapChange(e)}} className={HomeCSS['select-option']}>
                  <option value="none"> Map </option>
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

                <select onChange={(e) => {handleResultChange(e)}} className={HomeCSS['select-option']}>
                  <option className={HomeCSS['select-value']} value="none"> Result </option>
                  <option className={HomeCSS['select-value']} value="Win"> Win </option>
                  <option className={HomeCSS['select-value']} value="Loss"> Loss </option>
                  <option className={HomeCSS['select-value']} value="Draw"> Draw </option>
                </select>

                <select onChange={(e) => {handleTimeChange(e)}} className={HomeCSS['select-option']}>
                  <option value="none"> Time </option>
                  <option className={HomeCSS['select-value']} value="Newest"> Newest </option>
                  <option className={HomeCSS['select-value']} value="Oldest"> Oldest </option>
                </select>
               </form>

               <button className={HomeCSS['upload-button']} onClick={() => navigate("/upload")}> UPLOAD </button>
            </div>
            
            <div className={HomeCSS['vod-feed']}>
               {!loading && vodsToShow.length === 0 && <h2 style={{marginLeft: "15px"}}> No VODS to review.</h2>}
               {!loading && vodsToShow.length !== 0 && vodsToShow.map(vod => (
                  <div className={HomeCSS['vod-display']} key={vod.vod_id}>
                    <video className={HomeCSS['vod']} width="60%" height="60%" controls preload="metadata"> 
                      <source src={vod.vod_url + "#t=0.1"}  type="video/mp4"/>
                    </video>
                    <div className={HomeCSS['vod-title-time']} onClick={() => navigate(`/vod/${vod.vod_id}`)}>
                      <p style={{marginLeft: "15px"}}>
                      <a className={HomeCSS['vod-title']}
                        onClick={() => navigate(`/vod/${vod.vod_id}`)}
                      >
                      {vod.vod_title} </a> ◦ {fromNow(vod.timestamp)}
                      </p>
                    </div>

                    <div className={HomeCSS['vod-desc']} onClick={() => navigate(`/vod/${vod.vod_id}`)}>
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