import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './Participant';

// Componente responsavel por se conectar com o Twilio
//recebe o token da sala
//nome da sala
//metodo de sair da sala
const Room = ({ roomName, token, handleLogout }) => {

    //sala
    const [room, setRoom] = useState(null);
    // Lista de participantes na sala
    const [participants, setParticipants] = useState([]);
  
    // obtem o nome de cada participante
    const remoteParticipants = participants.map(participant => (
      <Participant key={participant.sid} participant={participant} />
    ));

    useEffect(() => {

        // funções de callback para entrada e saida de participantes 
        const participantConnected = participant => {
          setParticipants(prevParticipants => [...prevParticipants, participant]);
        };
        const participantDisconnected = participant => {
          setParticipants(prevParticipants =>
            prevParticipants.filter(p => p !== participant)
          );
        };
        // fim do callback

        // Conexao com Twilio
        Video.connect(token, {
          name: roomName
        }).then(room => {
          setRoom(room);
          // listeners de CONEXAO E DESCONEXAO NA SALA para outros participantes   
          room.on('participantConnected', participantConnected);
          room.on('participantDisconnected', participantDisconnected);
          // fim dos LISTENERS

          // sincronizo minha lista de participantes com a lista de participantes da sala no twilio   
          room.participants.forEach(participantConnected);
        });

        return () => {
            // Pego a sala 
            setRoom(currentRoom => {
              
              // se eu ainda estiver conectado na sala atual quando o componente for desmontado   
              if (currentRoom && currentRoom.localParticipant.state === 'connected') {
                //   para os tracks
                currentRoom.localParticipant.tracks.forEach(function(trackPublication) {
                  trackPublication.track.stop();
                });
                currentRoom.disconnect();
                return null;
              } else {
                return currentRoom;
              }
            });
          };

      }, [roomName, token]);
  
    return (
      <div className="room">
        <h2>Room: {roomName}</h2>
        <button onClick={handleLogout}>Log out</button>
        <div className="local-participant">
          {room ? (
              <Participant
              key={room.localParticipant.sid}
              participant={room.localParticipant}
            />
          ) : (
            ''
          )}
        </div>
        <h3>Remote Participants</h3>
        <div className="remote-participants">{remoteParticipants}</div>
      </div>
    );
  };
  
export default Room;
