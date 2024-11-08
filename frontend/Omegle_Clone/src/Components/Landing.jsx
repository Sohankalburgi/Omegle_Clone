import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Room from "./Room";


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
    <>
    <video ref={videoRef}></video>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        id="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      
      <button  onClick={()=>setJoined(true)}>
        Join
      </button>

    </>
  );
}
else{
  return <>
    <Room name={name} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack}/>
  </>
}
};

export default Landing;
