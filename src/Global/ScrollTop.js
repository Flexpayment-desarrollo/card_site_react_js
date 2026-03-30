import React from "react";
import {
  Box,
  Zoom,
  Fab,
} from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useCallback } from "react";

const ScrollTop = () => {
    const trigger = useScrollTrigger({
      target: document.body,
      disableHysteresis: true,
      threshold: 100,
    });
 
    const scrollToTop = useCallback(() => {
       document.body.scrollTo({ top: 0, behavior: "smooth" });
     }, []);
 
   return (
       <Zoom in={trigger}>
         <Box
           role="presentation"
           sx={{
             position: "fixed",
             bottom: 50,
             right: 32,
             zIndex: 1,
           }}
         >
           <Fab
             onClick={scrollToTop}
             color="primary"
             size="small"
             aria-label="scroll back to top"
           >
             <KeyboardArrowUp />
           </Fab>
         </Box>
       </Zoom>
   )
 }

 export default ScrollTop;