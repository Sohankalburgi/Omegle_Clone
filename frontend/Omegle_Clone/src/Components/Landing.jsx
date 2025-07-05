import React, { useRef } from "react";
import { useState, useEffect } from "react";
import Room from "./Room";
import './Landing.css';


const Landing = () => {

  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);  

  const videoRef = useRef(null);


  const getCam = async()=>{
    const stream = await window.navigator.mediaDevices.getUserMedia({
      video:true,
      audio:true
    })
    const audioTrack = stream.getAudioTracks()[0];
    const videoTrack = stream.getVideoTracks()[0];
    setLocalAudioTrack(audioTrack);
    setLocalVideoTrack(videoTrack);

    if(!videoRef.current){
      return;
    }

    videoRef.current.srcObject = new MediaStream([videoTrack]);
    videoRef.current.play();
  }

  useEffect(() => {
    if(videoRef && videoRef.current){
      getCam();
    }
  },[videoRef]);
  

  const [joined, setJoined] = useState(false);
  const [username, setUsername] = useState("");
  
  if(!joined){
  return (
    <div className="landing-container">
      <div className="landing-card">
        <h1>Omegle Clone</h1>
        <video ref={videoRef} className="landing-video" autoPlay muted></video>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter your name..."
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <button onClick={()=>setJoined(true)}>
          Join
        </button>
      </div>
    </div>
  );
}
else{
  return <>
    <Room name={username} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack}/>
  </>
}
};

export default Landing;
