import React, { useState, useEffect, useRef } from 'react';

const Participant = ({ participant }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);

  const videoRef = useRef();
  const audioRef = useRef();

  // precisamos filtrar todas as faixas que não existem. 
  // Faremos isso com uma função que mapeia de TrackPublication para Track e filtra qualquer uma que seja null.
  const trackpubsToTracks = trackMap => Array.from(trackMap.values())
  .map(publication => publication.track)
  .filter(track => track !== null);

  // adicionaremos duas funções que serão executadas quando uma faixa for adicionada ou removida do participante.
  //faixa: audio | video => do Participante
  // Ele também precisará limpar e remover esses ouvintes e esvaziar o estado quando o componente for desmontado.
  useEffect(() => {

    const trackSubscribed = track => {
      if (track.kind === 'video') {
        setVideoTracks(videoTracks => [...videoTracks, track]);
      } else {
        setAudioTracks(audioTracks => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = track => {
      if (track.kind === 'video') {
        setVideoTracks(videoTracks => videoTracks.filter(v => v !== track));
      } else {
        setAudioTracks(audioTracks => audioTracks.filter(a => a !== track));
      }
    };

    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    participant.on('trackSubscribed', trackSubscribed);
    participant.on('trackUnsubscribed', trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };



  }, [participant])


  // Também precisamos do hook useEffect para conectar as faixas de vídeo e áudio ao DOM
  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(videoRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks, videoTracks]);

  // fim do add

  return (
    <div className="participant">
      <h3>{participant.identity}</h3>
      <video ref={videoRef} autoPlay={true} />
      <audio ref={audioRef} autoPlay={true} muted={true} />
    </div>
  );

 };



export default Participant;