import ResponsiveAppBar from "../components/Appbar"
import { Box, Typography, Divider, Button} from "@mui/material"
export const About = () =>{
    return(
        <div>
           <ResponsiveAppBar />

          <div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5%'}}>
                <Box height={800} width={1100} 
                  sx={{backgroundColor: "#222222", borderRadius: "20px", marginTop: "10px", 
                  display: 'flex', flexDirection: 'column', alignItems: 'center'
                  }}
                >
                <Typography variant="h3" sx={{ fontFamily: "Arial", fontWeight: "bold", marginTop: "10px" }}>
                    About VALORANT VOD Review
                </Typography>

                <Box sx={{width: '100%', textAlign: 'left', marginTop: "20px", marginLeft: "20px"}}>
                       <Typography variant="h4" sx={{ marginLeft: "5px", marginfontFamily: "Arial", fontWeight: "bold", color: "#FF4645"}}>
                          What It Is
                       </Typography>

                       <Typography variant="h6" sx={{ marginLeft: "5px", marginfontFamily: "Arial", marginTop: "10px" }}>
                          VALORANT VOD Review is a free to use, open source application designed to help you improve your VALORANT gameplay.
                          Upload a full match VOD, and you will have the opportunity to create custom notes catered to your areas of improvement.
                          Notes and VODS able to be categorized and organized to streamline your road to improvement. 
                       </Typography>

                       <Typography variant="h4" sx={{ marginLeft: "5px", marginTop: "20px", marginfontFamily: "Arial", fontWeight: "bold", color: "#FF4645"}}>
                          Beta Version
                       </Typography>

                       <Typography variant="h6" sx={{ marginLeft: "5px", marginfontFamily: "Arial", marginTop: "10px" }}>
                          VALORANT VOD Review is still in a beta state and is being worked on continously to provide players with the smoothest
                          possible experience. Development for VOD sharing and community posts is in progress.
                       </Typography>


                       <Typography variant="h4" sx={{ marginLeft: "5px", marginTop: "20px", marginfontFamily: "Arial", fontWeight: "bold", color: "#FF4645"}}>
                          About Me 
                       </Typography>

                       <Typography variant="h6" sx={{ marginLeft: "5px", marginfontFamily: "Arial", marginTop: "10px" }}>
                          I am a recent graduate with a Bachelor of Science in Software Engineering. VALORANT is my first PC game, and I have played since
                          release. When I first started playing, I struggled to find an easy and organized way to analyze my gameplay and streamline my progress. I created 
                          VALORANT Vod Review as a way to help players of all skill levels analyze and improve their gameplay. Please feel free to view the source code or contact me using the information provided below.
                       </Typography>
                </Box>

                <Box sx={{width:'100%', marginTop: "10%"}}>
                  <Button size="large" variant="contained"> <a href="https://github.com/JustinYSJSU/react_valorant"> PROJECT SOURCE CODE </a> </Button>
                  <Button sx={{marginLeft: "20px"}} size="large" variant="contained"> Discord: kigeki1714 </Button>
                  <Button sx={{marginLeft: "20px"}} size="large" variant="contained"> <a href="https://www.linkedin.com/in/justin-yamamoto-b9192824b/"> LinkedIn </a> </Button>
                </Box>
            </Box>
            </div>

          </div>
        </div>
    )
}