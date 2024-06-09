import VodCSS from "../css/vod.module.css"
import { useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { collection, getDocs, query, where, doc } from "firebase/firestore"
import { db } from "../config/firebase"
import { format, intervalToDuration } from "date-fns"
import { NoteSection} from "../components/NoteSection"

export const Vod = () =>{
    const {vodID} = useParams()
    const [vod, setVod] = useState()
    const[notes, setNotes] = useState("notes here")

    const vodRef = useRef(0)
    const [vodTimestamp, setVodTimestamp] = useState()
    
    const convertTimestamp = (timestamp) =>{
        const ms = (timestamp.seconds) * 1000 + (timestamp.nanoseconds / 1000000)
        return format(new Date(ms), "MMMM dd, yyyy hh:mm a")
    }

    const convertPausedTimestamp = (timestamp) =>{
      const minutes = Math.floor(timestamp / 60);
      const seconds = Math.floor(timestamp % 60);
      const zeroPad = (num) => String(num).padStart(2, '0');
      return `${zeroPad(minutes)}:${zeroPad(seconds)}`;
    }

    const handlePause = () =>{
       if(vodRef.current){
        setVodTimestamp(vodRef.current.currentTime)
       }
    }

    const goToTimestamp = (time) => {
      if (vodRef.current) {
        vodRef.current.currentTime = time;
      }
    };

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
                <video ref={vodRef} onPause={handlePause} onPlay={() => setVodTimestamp(null)}className={VodCSS['vod']} width="60%" height="60%" controls preload="metadata"> 
                      <source src={vod.video_url + "#t=0.1"} type="video/mp4"/>
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

                
                {vodTimestamp && <div onClick={goToTimestamp(vodTimestamp)}> {convertPausedTimestamp(vodTimestamp)} </div>}
              </div>}
              

              {!notes && <div> Loading notes... </div>}
              <NoteSection />
            </div>
            
        </div>
    )
}