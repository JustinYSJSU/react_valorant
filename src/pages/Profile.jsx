import ResponsiveAppBar from "../components/Appbar"
import ProfileCSS from "../css/profile.module.css"
import { Avatar, Box, Typography, Divider} from "@mui/material"
import { collection, getDocs, query, where} from "firebase/firestore"

import { db } from "../config/firebase"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
export const Profile = () =>{

    const userID = useParams()
    const [user, setUser] = useState()
    console.log(userID.userID)
    /*
    - Get the user information (display name, pfp, agents, tracker, discord)
    - display in the box
    */
    useEffect( () =>{
        const getUser = async () =>{
            const profileID = userID.userID
            try{
                const q = query(collection(db, "users"), where ("user_id", "==", userID.userID))
                const querySnapshot = await getDocs(q)
                querySnapshot.forEach((doc) =>{
                    setUser(doc.data())
                })
            }
            catch(error){
                console.log(error)
            }

        }
        getUser()
    }, [])
    console.log(user)
    return(
        <div>
            <ResponsiveAppBar />
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
              <Box height={600} width={400} 
              sx={{backgroundColor: "#222222", borderRadius: "20px", borderColor: "#FFC107", borderStyle:"solid", marginTop: "20px", 
                display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}>

              {user && 
                 <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                   <Avatar src={user.profile_picture} sx={{ height: 102, width: 102, marginTop: "20px" }} />
                   <Typography variant="h4" sx={{ fontFamily: "Arial", fontWeight: "bold", marginTop: "10px" }}>
                     {user.username}
                   </Typography>
                   <Divider sx={{ backgroundColor: 'white', height: "2px", width: "100%", marginTop: "10px" }} />   

                   <Box sx={{width: '100%', textAlign: 'left', marginTop: "20px", marginLeft: "20px"}}>
                     <Box sx={{borderColor: "#FF4645", borderStyle:"solid", borderRadius: "10px", width: "380px"}}>
                       <Typography variant="h6" sx={{ marginLeft: "5px", marginfontFamily: "Arial", fontWeight: "bold" }}>
                         Agent(s): 
                       </Typography>
                     </Box>

                     <Box sx={{borderColor: "#FF4645", borderStyle:"solid", borderRadius: "10px", width: "380px", marginTop: "20px"}}>
                       <Typography variant="h6" sx={{ marginLeft: "5px", fontFamily: "Arial", fontWeight: "bold"}}>
                         Tracker.gg: 
                       </Typography>
                     </Box>

                     <Box sx={{borderColor: "#FF4645", borderStyle:"solid", borderRadius: "10px", width: "380px", marginTop: "20px"}}>
                       <Typography variant="h6" sx={{ marginLeft: "5px", fontFamily: "Arial", fontWeight: "bold"}}>
                         Discord:  
                       </Typography>
                     </Box>
                   </Box>      
                 </Box>

               
                
                
               
              }
              </Box>
            </div>
        </div>

    )
}