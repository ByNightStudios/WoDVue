import React from "react";
import AlertMp3 from './alert.mp3';

function SoundModal() {
  return (
   <audio id="emergency-audio">
       <source src={AlertMp3} />
   </audio>
  );
}

export default SoundModal;
