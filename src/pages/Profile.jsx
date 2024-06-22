import ResponsiveAppBar from "../components/Appbar"
import ProfileCSS from "../css/profile.module.css"
import { Box } from "@mui/material"

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
                
            }
            catch(error){
                console.log(error)
            }

        }
        getUser()
    }, [])
    return(
        <div>
            <ResponsiveAppBar />
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
              <Box height={851} width={701} 
              sx={{backgroundColor: "#222222", borderRadius: "20px", borderColor: "#FFC107", marginTop: "20px"}}>
              </Box>
            </div>
        </div>

    )
}