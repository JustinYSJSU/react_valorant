import VodCSS from "../css/vod.module.css"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { collection, getDocs, query, where, doc } from "firebase/firestore"
import { db } from "../config/firebase"

export const Vod = () =>{
    const {vodID} = useParams()
    const [vod, setVod] = useState()

    const convertTimestamp = (timestamp) =>{
        const ms = (timestamp.seconds) * 1000 + (timestamp.nanoseconds / 1000000)
        return new Date(ms)
    }

    useEffect( () =>{
        const getVod = async () =>{
           const q = query(collection(db, "videos"), where ("", "==", vodID))
           
           const querySnapshot = await getDocs(q)
           querySnapshot.forEach( (doc) =>{
            console.log(doc)
           })
           /*
           const vod_info = {
            agent: doc.data().agent, 
            map: doc.data().map, 
            timestamp: readableTimestamp, 
            vod_url: doc.data().video_url, 
            vod_title: doc.data().title, 
            result: doc.data().result, 
            vod_id: doc.id
           }
           setVod(vod_info)
           */
        }
        getVod()
    },[])

    return(
        <div className={VodCSS['vod-page-container']}>
            <div className={VodCSS['vod-page-top']}> 
              <h1> Review VOD </h1>
            </div>

            <div className={VodCSS['vod-and-notes']}>
              <div className={VodCSS['vod-display']}>
                PUT THE VOD HERE
              </div>

              <textarea placeholder="PUT THE NOTES HERE" className={VodCSS['notes-display']}>

              </textarea>
            </div>
            
        </div>
    )
}