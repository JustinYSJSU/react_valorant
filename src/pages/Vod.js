import VodCSS from "../css/vod.module.css"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { collection, getDocs, query, where, doc } from "firebase/firestore"
import { db } from "../config/firebase"
import { format } from "date-fns"
export const Vod = () =>{
    const {vodID} = useParams()
    const [vod, setVod] = useState()
    const[notes, setNotes] = useState("notes here")

    const convertTimestamp = (timestamp) =>{
        const ms = (timestamp.seconds) * 1000 + (timestamp.nanoseconds / 1000000)
        return format(new Date(ms), "MMMM dd, yyyy hh:mm a")
    }

    useEffect( () =>{
        const getVod = async () =>{
           const q = query(collection(db, "videos"), where ("vod_id", "==", vodID))
           
           const querySnapshot = await getDocs(q)
           querySnapshot.forEach( (doc) =>{
            setVod(doc.data())
            console.log(doc.data().timestamp)
           })
        }
        getVod()
    },[])

    return(
        <div className={VodCSS['vod-page-container']}>
            <div className={VodCSS['vod-page-top']}> 
              <h1> Review VOD </h1>
            </div>

            <div className={VodCSS['vod-and-notes']}>
              {!vod && <div> Loading VOD... </div>}
              {vod && 
              <div className={VodCSS['vod-display']}>
                <video className={VodCSS['vod']} width="60%" height="60%" controls preload="metadata"> 
                      <source src={vod.video_url + "#t=0.1"}  type="video/mp4"/>
                </video>

                <div className={VodCSS['vod-title-time']}>
                      <p style={{marginLeft: "15px"}}>
                    
                      {vod.title} ◦ {convertTimestamp(vod.timestamp)}
                      </p>
                </div>

                <div className={VodCSS['vod-desc']}>
                      <p style={{marginLeft: "15px"}}> Agent: {vod.agent} </p>
                      <p style={{marginLeft: "10px"}}> Map: {vod.map} </p>
                      <p style={{marginLeft: "10px"}}> Result: {vod.result} </p>
                </div>
              </div>}
              

              {!notes && <div> Loading notes... </div>}
              <textarea placeholder="NOTES ARE IN PROGRESS" className={VodCSS['notes-display']}>

              </textarea>
            </div>
            
        </div>
    )
}