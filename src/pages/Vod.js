import VodCSS from "../css/vod.module.css"
import { useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { collection, getDocs, query, where, addDoc} from "firebase/firestore"
import { db,auth } from "../config/firebase"
import { format, intervalToDuration } from "date-fns"
import { NoteSection} from "../components/NoteSection"

export const Vod = () =>{
    const {vodID} = useParams()
    const [vod, setVod] = useState()
    const [notes, setNotes] = useState([])

    const [addingNote, setAddingNote] = useState(false)
    const [addNoteButton, setAddNoteButton] = useState(false)
    const [comment, setComment] = useState()

    const vodRef = useRef(0)
    const [vodTimestamp, setVodTimestamp] = useState()
    
    const [tagFilter, setTagFilter] = useState()
    const [tag, setTag] = useState()

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

    const handleNote = async (e) => {
      e.preventDefault();
      const notesRef = collection(db, "notes");
      try {
        const currentUser = auth.currentUser;
        await addDoc(notesRef, {
          comment: comment,
          tag: tag,
          timestampConverted: convertPausedTimestamp(vodTimestamp),
          timestamp: vodTimestamp,
          vod_id: vodID,
          uid: currentUser.uid,
        });
        console.log("NOTE ADDED");
  
        const copyOfNotes = [];
        const q = query(collection(db, "notes"), where("vod_id", "==", vodID));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          copyOfNotes.push(doc.data());
        });
        setNotes(copyOfNotes);
        setAddingNote(false);
      } catch (error) {
        console.log(error);
      }
    }

    const handlePlay = () =>{
       setVodTimestamp(null)
       setAddingNote(false)
    }

    const handlePause = () =>{
       if(vodRef.current){
        setVodTimestamp(vodRef.current.currentTime)
        setAddNoteButton(true)
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

    useEffect(() => {
      const getNotes = async () => {
        const copyOfNotes = [];
        try {
          const q = query(collection(db, "notes"), where("vod_id", "==", vodID));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            copyOfNotes.push(doc.data());
          });
        } catch (error) {
          console.log(error);
        } finally {
          setNotes(copyOfNotes);
        }
      };
  
      getNotes();
    }, [vodID]);

    console.log(notes)
    console.log(notes.length)
    return(
        <div className={VodCSS['vod-page-container']}>
            <div className={VodCSS['vod-page-top']}> 
              <h1> Review VOD </h1>
            </div>

            <div className={VodCSS['vod-and-notes']}>
              {!vod && <div> Loading VOD... </div>}
              {vod && 
              <div className={VodCSS['vod-display']}>
                <video ref={vodRef} onPause={handlePause} onPlay={handlePlay}className={VodCSS['vod']} width="60%" height="60%" controls preload="metadata"> 
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

                
                {vodTimestamp && 
                 <div className={VodCSS['add-note']}> 
                   <button className={VodCSS['add-note-button']} onClick={() => {setAddingNote(true)}}> ADD NOTE </button>
                 </div>}
              </div>}
              
              <div className={VodCSS['notes-display']}>
                <select onChange={(e) => setTagFilter(e.target.value)} className={VodCSS['select-tag']}>
                  <option value=""> Filter by... </option>
                  <option value="Mechanics"> Mechanics </option>
                  <option value="Communication"> Communication </option>
                  <option value="Awareness"> Awareness </option>
                  <option value="Utility"> Utility </option>
                  <option value="Other"> Other </option>
                </select>

                <div className={VodCSS['all-notes']}>
                  {addingNote &&
                     <form onSubmit={handleNote} className={VodCSS['add-note-form']}>
                       <select onChange={(e) => setTag(e.target.value)} className={VodCSS['select-tag-second']} required="true">
                         <option value=""> Tag... </option>
                         <option value="mechanics"> Mechanics </option>
                         <option value="communication"> Communication </option>
                         <option value="awareness"> Awareness </option>
                         <option value="utility"> Utility </option>
                         <option value="other"> Other </option>
                       </select>

                       <textarea onChange={ (e) => setComment(e.target.value)} required="true" className={VodCSS['note-write']} placeholder="Note here..." />
                       <button onClick={() => setAddingNote(false)} className={VodCSS['note-cancel']}> Cancel </button>
                       <button type="submit" className={VodCSS['note-confirm']}> Submit </button>
                     </form>
                   }

                  <div className={VodCSS['user-notes']}>
                    {notes.length !== 0 ? (
                    notes.map((note) => (
                    <div className={VodCSS['note']}> 
                       <a onClick={goToTimestamp(note.timestamp)} className={VodCSS['note-timestamp-link']}> <h3 className={VodCSS['note-timestamp']}> {note.timestampConverted} </h3> </a>
                       <p className={VodCSS['note-comment']}> {note.comment} </p>
                       {note.tag === 'mechanics' && 
                       <div className={VodCSS['tag-mechanics']}>
                         Mechanics
                       </div>}

                       {note.tag === 'communication' && 
                       <div className={VodCSS['tag-communication']}>
                         Communication
                       </div>}

                       {note.tag === 'awareness' && 
                       <div className={VodCSS['tag-awareness']}>
                         Awareness
                       </div>}

                       {note.tag === 'utility' && 
                       <div className={VodCSS['tag-utility']}>
                         Utility
                       </div>}

                       {note.tag === 'other' && 
                       <div className={VodCSS['tag-other']}>
                         Other
                       </div>}

                    </div>
                    ))
                    ) : (
                   <div>No notes available</div>
                   )}
                  </div>
                   

                </div>
              </div>
            </div>
            
        </div>
    )
}