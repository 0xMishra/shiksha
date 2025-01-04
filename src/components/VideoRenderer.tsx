"use strict";
"use client";
import { useRef } from "react";
import videojs from "video.js";
import VideoJS from "~/components/VideoPlayer";

export function VideoRenderer({ src }: { src: string }) {
  const playerRef = useRef(null);
  console.log(src);

  const videoJsOptionsM3u8 = {
    fluid: true,
    controls: true,
    autoplay: false,
    width: 400,
    sources: [
      {
        src: `${src}`,
        type: "video/mp4",
      },
    ],
    plugins: {
      httpSourceSelector: {
        default: "auto",
      },
    },
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    console.log(player.qualityLevels());

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };
  return (
    <div className="flex w-full items-center justify-center">
      <VideoJS options={videoJsOptionsM3u8} onReady={handlePlayerReady} />
    </div>
  );
}
