import VodCSS from "../css/vod.module.css"
import { useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { collection, getDocs, query, where, addDoc } from "firebase/firestore"
import { db, auth } from "../config/firebase"
import { format, intervalToDuration } from "date-fns"
import ResponsiveAppBar from "../components/Appbar"
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import { Button } from "@mui/material"
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
export const Vod = () => {

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { vodID } = useParams()
  const [vod, setVod] = useState()
  const [notes, setNotes] = useState([])
  const [notesToShow, setNotesToShow] = useState([])

  const [addingNote, setAddingNote] = useState(false)
  const [addNoteButton, setAddNoteButton] = useState(false)
  const [comment, setComment] = useState()

  const vodRef = useRef(0)
  const [vodTimestamp, setVodTimestamp] = useState()

  const [tagFilter, setTagFilter] = useState()
  const [tag, setTag] = useState()

  const convertTimestamp = (timestamp) => {
    const ms = (timestamp.seconds) * 1000 + (timestamp.nanoseconds / 1000000)
    return format(new Date(ms), "MMMM dd, yyyy hh:mm a")
  }

  const convertPausedTimestamp = (timestamp) => {
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
      orderNotes(copyOfNotes)
      setNotes(copyOfNotes);
      setNotesToShow(copyOfNotes)
      setAddingNote(false);
    } catch (error) {
      console.log(error);
    }
  }

  const orderNotes = (notes) => {
    notes.sort((a, b) => a.timestamp - b.timestamp)
    return notes
  }

  const handlePlay = () => {
    setVodTimestamp(null)
    setAddingNote(false)
  }

  const handlePause = () => {
    if (vodRef.current) {
      setVodTimestamp(vodRef.current.currentTime)
      setAddNoteButton(true)
    }
  }


  const goToTimestamp = (time) => {

    vodRef.current.currentTime = time;

  };


  useEffect(() => {
    const getVod = async () => {
      const q = query(collection(db, "videos"), where("vod_id", "==", vodID))

      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        setVod(doc.data())
        console.log(doc.data().timestamp)
      })
    }
    getVod()
  }, [])

  useEffect(() => {
    const getNotes = async () => {
      const copyOfNotes = [];
      try {
        const q = query(collection(db, "notes"), where("vod_id", "==", vodID));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          copyOfNotes.push(doc.data());
        });
        copyOfNotes.sort((a, b) => a.timestamp - b.timestamp)
      } catch (error) {
        console.log(error);
      } finally {
        setNotes(orderNotes(copyOfNotes))
        setNotesToShow(copyOfNotes)
      }
    };

    getNotes();
  }, [vodID]);

  console.log(notes)
  console.log(notes.length)

  const handleTagFilter = (e) => {
    let userNotes = [...notes]
    if (e.target.value !== "") {
      userNotes = userNotes.filter(note => note.tag === e.target.value.toLowerCase())
      setNotesToShow(orderNotes(userNotes))
    }
    else {

      setNotesToShow(orderNotes(userNotes))
    }

  }

  return (
    <div className={VodCSS['vod-page-container']}>
      <ResponsiveAppBar />

      <div className={VodCSS['vod-and-notes']}>
        {!vod && <div> Loading VOD... </div>}
        {vod &&
          <div className={VodCSS['vod-display']}>
            <video ref={vodRef} onPause={handlePause} onPlay={handlePlay} className={VodCSS['vod']} width="60%" height="60%" controls preload="metadata">
              <source src={vod.video_url + "#t=0.1"} type="video/mp4" />
            </video>

            <div className={VodCSS['vod-title-time']}>
              <p style={{ marginLeft: "15px" }}>

                {vod.title} ◦ {convertTimestamp(vod.timestamp)}
              </p>
            </div>

            <div className={VodCSS['vod-desc']}>
              <p style={{ marginLeft: "15px" }}> Agent: {vod.agent} </p>
              <p style={{ marginLeft: "10px" }}> Map: {vod.map} </p>
              <p style={{ marginLeft: "10px" }}> Result: {vod.result} </p>
              <br></br>

            </div>

            <Button onClick={handleOpen} variant='contained' sx={{ display: 'flex', marginLeft: '15px', marginTop: '10px', marginBottom: '10px', alignSelf: 'flex-start' }}> <PersonAddAlt1OutlinedIcon sx={{ color: 'white' }} /> <Typography sx={{ marginLeft: '5px', color: 'white', fontFamily: "Arial" }}>  Share </Typography>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                disableBackdropClick={false}
              >
                <Box sx={style}>

                </Box>
              </Modal>
            </Button>
            {vodTimestamp &&
              <div className={VodCSS['add-note']}>
                <button className={VodCSS['add-note-button']} onClick={() => { setAddingNote(true) }}> ADD NOTE </button>
              </div>}
          </div>}

        <div className={VodCSS['notes-display']}>
          <select onChange={(e) => handleTagFilter(e)} className={VodCSS['select-tag-notes']}>
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

                <textarea onChange={(e) => setComment(e.target.value)} required="true" className={VodCSS['note-write']} placeholder="Note here..." />
                <button onClick={() => setAddingNote(false)} className={VodCSS['note-cancel']}> Cancel </button>
                <button type="submit" className={VodCSS['note-confirm']}> Submit </button>
              </form>
            }

            <div className={VodCSS['user-notes']}>
              {notesToShow.length !== 0 ? (
                notesToShow.map((note) => (
                  <div className={VodCSS['note']}>
                    <a onClick={() => goToTimestamp(note.timestamp)} className={VodCSS['note-timestamp-link']}> <h3 className={VodCSS['note-timestamp']}> {note.timestampConverted} </h3> </a>
                    <p className={VodCSS['note-comment']}> {note.comment} </p>
                    {note.tag === 'mechanics' &&
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <div className={VodCSS['tag-mechanics']}>
                        Mechanics
                      </div>

                      <EditIcon sx={{justifyContent: "center",
  alignItems: "center", marginLeft: '15px', marginTop: '7.5px'}}/>

                      
                      <DeleteIcon sx={{justifyContent: "center",
  alignItems: "center", marginLeft: '15px', marginTop: '7.5px'}} />
                    </Box>
                      }

                    {note.tag === 'communication' &&
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                         <div className={VodCSS['tag-communication']}>
                        Communication
                      </div>
                      <div>
                      <EditIcon sx={{justifyContent: "center",
  alignItems: "center", marginLeft: '15px', marginTop: '7.5px'}}/>

                      
                      <DeleteIcon sx={{justifyContent: "center",
  alignItems: "center", marginLeft: '15px'}}/>
                      
                    </div>
                    </Box>
                      
                      }

                    {note.tag === 'awareness' &&
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <div className={VodCSS['tag-awareness']}>
                        Awareness
                      </div>
                      
                      <div>
                        <EditIcon sx={{justifyContent: "center",
    alignItems: "center", marginLeft: '15px', marginTop: '7.5px'}}/>

                        
                        <DeleteIcon sx={{justifyContent: "center",
    alignItems: "center", marginLeft: '15px'}}/>
                        
                      </div>
                    </Box>
                      }

                    {note.tag === 'utility' &&
                      <Box sx={{display: 'flex', flexDirection: 'row'}}>
                          <div className={VodCSS['tag-utility']}>
                        Utility
                      </div>

                      <div>
                        <EditIcon sx={{justifyContent: "center",
    alignItems: "center", marginLeft: '15px', marginTop: '7.5px'}}/>

                        
                        <DeleteIcon sx={{justifyContent: "center",
    alignItems: "center", marginLeft: '15px'}}/>
                        
                      </div>
                      </Box>
                      

                     
                      
                      }

                    {note.tag === 'other' &&

                       <Box sx={{display: 'flex', flexDirection: 'row'}}>
                           <div className={VodCSS['tag-other']}>
                        Other
                      </div>
                      
                      <div>
                        <EditIcon sx={{justifyContent: "center",
    alignItems: "center", marginLeft: '15px', marginTop: '7.5px'}}/>

                        
                        <DeleteIcon sx={{justifyContent: "center",
    alignItems: "center", marginLeft: '15px'}}/>
                        
                      </div>
                       </Box>
                     }

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