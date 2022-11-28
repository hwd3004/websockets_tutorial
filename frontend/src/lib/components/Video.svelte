<script lang="ts">
  import { onMount } from "svelte";

  const MUTE = "MUTE";
  const UNMUTE = "UNMUTE";
  const TURN_CAMERA_ON = "Turn Camera On";
  const TURN_CAMERA_OFF = "Turn Camera Off";

  let videoRef: HTMLVideoElement;
  let muteButtonRef: HTMLButtonElement;
  let cameraButtonRef: HTMLButtonElement;
  let selectRef: HTMLSelectElement;
  let stream: MediaStream;
  let muted = false;
  let cameraOff = false;

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

  onMount(() => {
    getMedia();
    getCameras();
  });
</script>

<div>
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
