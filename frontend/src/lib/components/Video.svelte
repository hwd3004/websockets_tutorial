<script lang="ts">
  import { socket, roomName } from "@/src/stores/store";
  import { onMount } from "svelte";

  const MUTE = "MUTE";
  const UNMUTE = "UNMUTE";
  const TURN_CAMERA_ON = "Turn Camera On";
  const TURN_CAMERA_OFF = "Turn Camera Off";

  let videoRef: HTMLVideoElement;
  let muteButtonRef: HTMLButtonElement;
  let cameraButtonRef: HTMLButtonElement;
  let selectRef: HTMLSelectElement;

  let welcomeInputRef: HTMLInputElement;

  let peerStreamVideoRef: HTMLVideoElement;

  let stream: MediaStream;
  let muted = false;
  let cameraOff = false;
  let call = false;

  let peerConnection: RTCPeerConnection;

  let dataChannel: RTCDataChannel;

  const handleMuteClick = () => {
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    muted = !muted;
  };

  const handleCameraClick = () => {
    stream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    cameraOff = !cameraOff;
  };

  const handleCameraChange = async () => {
    await getMedia(selectRef.value);

    if (peerConnection) {
      // console.log("peerConnection.getSenders()", peerConnection.getSenders());

      const videoTrack = stream.getVideoTracks()[0];

      // Sender는 current의 peer로 보내진 media stream track을 컨트롤하게 한다.
      const videoSender: RTCRtpSender | undefined = peerConnection.getSenders().find((sender: RTCRtpSender) => {
        // console.log("sender", sender);
        return sender.track?.kind === "video";
      });

      videoSender?.replaceTrack(videoTrack);

      console.log("videoSender", videoSender);
    }
  };

  const getMedia = async (deviceId?: string) => {
    try {
      // facingMode는 모바일의 전면 카메라 또는 기기의 기본 카메라를 의미
      const initialConstrains: MediaStreamConstraints = {
        audio: true,
        video: { facingMode: "user" },
      };

      // exact를 사용 안하면 전달받은 deviceId를 찾지 못하면 감지된 다른 카메라에 자동 연결, 사용하면 연결 안함
      const cameraConstrains: MediaStreamConstraints = {
        audio: true,
        video: { deviceId: { exact: deviceId } },
      };

      stream = await navigator.mediaDevices.getUserMedia(deviceId ? cameraConstrains : initialConstrains);

      // console.log("stream : ", stream);
      videoRef.srcObject = stream;

      // https://velog.io/@youngcheon/WebRTC-하울링-이슈-수정하기
      videoRef.volume = 0;

      if (!deviceId) {
        await getCameras();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCameras = async () => {
    try {
      // 모든 비디오, 오디오 장비 가져오기
      const devices = await navigator.mediaDevices.enumerateDevices();
      // console.log("devices", devices);

      const cameras = devices.filter((device) => {
        return device.kind === "videoinput";
      });
      // console.log("cameras", cameras);

      cameras.forEach((camera) => {
        const optionRef = document.createElement("option");
        optionRef.value = camera.deviceId;
        optionRef.innerText = camera.label;
        selectRef.appendChild(optionRef);
      });

      selectRef.addEventListener("input", handleCameraChange);
    } catch (error) {
      console.log(error);
    }
  };

  const initCall = async () => {
    call = true;
    await getMedia();
    makeConnection();
  };

  const handleWelcomeSubmit = async () => {
    roomName.update(() => welcomeInputRef.value);

    // socket.emit("join_room", $roomName, initCall);

    await initCall();
    socket.emit("join_room", $roomName);
  };

  // Peer A에서 실행
  socket.on("welcome", async () => {
    console.log("Peer A");
    console.log("someone joined.");

    // Peer A의 데이터채널 정의
    dataChannel = peerConnection.createDataChannel("chat");
    dataChannel.addEventListener("message", (event: MessageEvent<any>) => {
      console.log("MessageEvent : ", event);
    });
    console.log("made data channel.");

    const offer: RTCSessionDescriptionInit = await peerConnection.createOffer();

    // Peer B로 offerf 전달
    peerConnection.setLocalDescription(offer);

    socket.emit("offer", offer, $roomName);
  });

  // Peer B에서 실행
  socket.on("offer", async (offer: RTCSessionDescriptionInit) => {
    
    // Peer B의 데이터채널 정의
    peerConnection.addEventListener("datachannel", (event: RTCDataChannelEvent) => {
      // console.log("RTCDataChannelEvent : ", event);
      dataChannel = event.channel;
      dataChannel.addEventListener("message", (event: MessageEvent<any>) => {
        console.log("Peer B MessageEvent : ", event);
      });
    });

    console.log("Peer B가 받은 offer : ", offer);

    /**
     * Uncaught (in promise) TypeError: peerConnection is undefined
     * offer가 도착한 순간, Peer B의 브라우저에서 peerConnection은 아직 존재하지 않는다.
     * 함수명 setRemoteDescription임에 주의
     */
    peerConnection.setRemoteDescription(offer);

    const answer = await peerConnection.createAnswer();

    console.log("answer : ", answer);

    // 함수명 setLocalDescription임에 주의
    peerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, $roomName);
  });

  /**
   * Peer A에서 offer를 Peer B로 보낸 후, Peer B에서 offer를 받아 answer를 Peer A가 받는다.
   * 이 함수는 Peer A에서 실행
   */
  socket.on("answer", (answer: RTCSessionDescriptionInit) => {
    peerConnection.setRemoteDescription(answer);
  });

  const makeConnection = () => {
    peerConnection = new RTCPeerConnection({
      // 전문적으로 하려면 직접 STUN 서버 구현 필요
      // iceServers: [
      //   {
      //     urls: [
      //       "stun:stun.l.google.com:19302",
      //       "stun:stun1.l.google.com:19302",
      //       "stun:stun2.l.google.com:19302",
      //       "stun:stun3.l.google.com:19302",
      //       "stun:stun4.l.google.com:19302",
      //     ],
      //   },
      // ],
    });

    peerConnection.addEventListener("icecandidate", handleIce);

    // addstream은 폐기됨. track을 사용.
    peerConnection.addEventListener("track", handleTrack);

    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });
  };

  const handleIce = (event: RTCPeerConnectionIceEvent) => {
    const { candidate } = event;
    socket.emit("ice", candidate, $roomName);
    console.log("sent ice candidated.");
    // console.log(event);
  };

  const handleTrack = (event: RTCTrackEvent) => {
    console.log("RTC Track Event : ", event);
    console.log("RTC Track Event streams : ", event.streams);
    console.log("current peer stream : ", stream);

    if (event.streams) {
      peerStreamVideoRef.srcObject = event.streams[0];
      peerStreamVideoRef.volume = 0;
    }
  };

  socket.on("ice", (ice: RTCIceCandidate | null) => {
    ice ? peerConnection.addIceCandidate(ice) : null;
    console.log("received candidated.");
  });

  onMount(() => {
    // getMedia();
    // getCameras();
  });
</script>

<div>
  {#if !call}
    <div id="welcome">
      <form on:submit|preventDefault={handleWelcomeSubmit}>
        <input bind:this={welcomeInputRef} type="text" required placeholder="room name" />
        <button type="submit">Enter Room</button>
      </form>
    </div>
  {:else}
    <div id="stream">
      <!-- svelte-ignore a11y-media-has-caption -->
      <video bind:this={videoRef} autoplay playsinline width="400" height="250" />

      <button bind:this={muteButtonRef} on:click={handleMuteClick}>
        {!muted ? MUTE : UNMUTE}
      </button>

      <button bind:this={cameraButtonRef} on:click={handleCameraClick}
        >{!cameraOff ? TURN_CAMERA_OFF : TURN_CAMERA_ON}
      </button>

      <select bind:this={selectRef} />
    </div>

    <!-- svelte-ignore a11y-media-has-caption -->
    <video id="peerStream" bind:this={peerStreamVideoRef} autoplay playsinline width="400" height="250" />
  {/if}
</div>
