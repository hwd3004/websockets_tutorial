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

  let stream: MediaStream;
  let muted = false;
  let cameraOff = false;
  let call = false;

  let peerConnection: RTCPeerConnection;

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

  const startMedia = async () => {
    call = true;
    await getMedia();
    makeConnection();
  };

  const handleWelcomeSubmit = () => {
    roomName.update(() => welcomeInputRef.value);
    socket.emit("join_room", $roomName, startMedia);
  };

  // Peer A에서 실행
  socket.on("welcome", async () => {
    console.log("someone joined.");

    const offer: RTCSessionDescriptionInit = await peerConnection.createOffer();

    // Peer B로 offerf 전달
    peerConnection.setLocalDescription(offer);

    socket.emit("offer", offer, $roomName);
  });

  // Peer B에서 실행
  socket.on("offer", (offer: RTCSessionDescriptionInit) => {
    console.log("offer : ", offer);
  });

  const makeConnection = () => {
    peerConnection = new RTCPeerConnection();
    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });
  };

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
  {/if}
</div>
