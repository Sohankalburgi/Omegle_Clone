import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { io } from "socket.io-client";
import './Room.css'; // Import the CSS file for styling

const URL = 'http://localhost:3000';

const Room = ({name,localAudioTrack, localVideoTrack}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [socket, setSocket] = useState(null);
  const [lobby, setLobby] = useState(true);
  const [sendingPC, setSendingPC] = useState(null);
  const [receivingPC, setReceivingPC] = useState(null);
  const [remoteVideoTrack, setRemoteVideoTrack] = useState(null);
  const [remoteAudioTrack, setRemoteAudioTrack] = useState(null);
  const [remoteMediaStream, setRemoteMediaStream ] = useState(null);
  const remoteVideoRef = useRef();
  const localVideoRef = useRef();

  useEffect(() => {
    // logic to init user
    const socket = io(URL);

    socket.on('send-offer', async ({roomId})=>{
      console.log('send-offer');
      
      setLobby(false);

      const pc = new RTCPeerConnection();
      console.log("___________________________")
      console.log(pc);
      setSendingPC(pc);
      
      if(localAudioTrack){
        
        pc.addTrack(localAudioTrack);
      }

      if(localVideoTrack){
       
        pc.addTrack(localVideoTrack);
      }
     
      pc.onicecandidate = async(e)=>{
        console.log('receiving ice candidate locally')
       console.log(e.candidate);

        if(e.candidate){
          socket.emit("add-ice-candidate",{
            candidate : e.candidate,
            type : "sender",
            roomId
          })
        }
      }

      pc.onnegotiationneeded = async ()=>{
          console.log("on negotiation needed ,sending offer");
          const sdp = await pc.createOffer();
          pc.setLocalDescription(sdp);

          socket.emit("offer",{
          sdp ,
          roomId
          });        
      }

      
    });

    socket.on("offer",async  ({roomId,sdp: remoteSdp }) =>{
      console.log("recieved offer");
      setLobby(false);
      const pc = new RTCPeerConnection();
      pc.setRemoteDescription(remoteSdp);
      
      const sdp = await pc.createAnswer();

      pc.setLocalDescription(sdp);
      const stream = new MediaStream();
      
      if(remoteVideoRef.current){
      remoteVideoRef.current.srcObject = stream;
      }
      setRemoteMediaStream(stream);

      setReceivingPC(pc);
      window.pcr = pc;

      pc.ontrack = (e)=>{
        alert("onTrack");
      }
      
      pc.onicecandidate = async(e)=>{
        
        if(!e.candidate){
          return;
        }
        if(e.candidate){
          socket.emit("add-ice-candidate",{
            candidate : e.candidate,
            type : "receiver",
            roomId
          })
        }
      }

      socket.emit('answer',{
        roomId,
        sdp:sdp
      });
      
      setTimeout(()=>{
        const track1 = pc.getTransceivers()[0].receiver.track;
        const track2 = pc.getTransceivers()[1].receiver.track;

        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        console.log(track1);
        console.log(track2);

        if(track1.kind === 'video'){
          setRemoteVideoTrack(track1);
          setRemoteAudioTrack(track2);
        }
        else{
          setRemoteAudioTrack(track1);
          setRemoteVideoTrack(track2);
        }

        remoteVideoRef.current.srcObject.addTrack(track1);
        remoteVideoRef.current.srcObject.addTrack(track2);

        remoteVideoRef.current.play();
      },5000)

    });

    socket.on('answer',({roomId,sdp:remoteSdp})=>{
      
      setLobby(false);
      setSendingPC(pc =>{
        pc.setRemoteDescription(remoteSdp)
        return pc;
      });
      console.log("loop closed ");
    })

    socket.on("lobby",()=>{
      setLobby(true);
    })

    socket.on("add-ice-candidate",({candidate,type})=>{
      if(type == "sender"){
        console.log("socket on add-ice candidate ++++++++++++++++++++++++++")
        console.log(candidate);
        console.log(type); 
        setReceivingPC( pc=>{
          if(!pc){
            console.error("receiver pc not found")
          }
          else {
            console.error(pc.ontrack)
          }
           pc?.addIceCandidate(candidate);
           return pc;
        });

      }
      else{
         setSendingPC( pc=>{
          if(!pc){
            console.error("sender pc not found")
          }
          else {
           
          }
          pc?.addIceCandidate(candidate);
          return pc;
         });
      }
    })

    setSocket(socket)
  }, [name])

  useEffect(() => {
    if (localVideoRef.current) {
        if (localVideoTrack) {
            localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
            localVideoRef.current.play();
        }
    }
}, [localVideoRef])
  
   
   
    return (
    <div className="room-container">
      <header className="room-header">
        <h1>Omegle Clone</h1>
        <h2>Welcome, {name || 'Guest'}!</h2>
      </header>
      <div className="video-section">
        <div className="video-block">
          <h3>Your Video</h3>
          <video className="video-player" width={400} height={400} ref={localVideoRef} autoPlay muted></video>
        </div>
        <div className="video-block">
          <h3>Stranger's Video</h3>
          <video className="video-player" width={400} height={400} ref={remoteVideoRef} autoPlay></video>
        </div>
      </div>
      {lobby && <div className="lobby-message">Waiting for someone to connect with you...</div>}
    </div>
  )
}

export default Room