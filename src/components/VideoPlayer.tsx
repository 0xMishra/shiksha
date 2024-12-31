import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

// To provide quality control option in ABS Video
import "videojs-contrib-quality-levels";
import "videojs-http-source-selector";

export const VideoJS = (props: { options: any; onReady?: any }) => {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const { options, onReady } = props;

  useEffect(() => {
    // Ensure Video.js player is initialized once
    if (!playerRef.current) {
      const placeholderEl = placeholderRef.current;
      const videoElement = placeholderEl!.appendChild(
        document.createElement("video-js"),
      );

      const player: any = videojs(videoElement, options, () => {
        player.log("player is ready");
        onReady && onReady(player);
      });

      playerRef.current = player;

      // Add the source selector plugin
      player.httpSourceSelector();

      // Set player to be fluid
      player.fluid(true); // This ensures the player is fluid and scales based on the container
    } else {
      // Update player options if they change
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, onReady]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div className="mx-auto w-full max-w-6xl p-4">
      {/* Responsive container */}
      <div
        className="aspect-w-16 aspect-h-9 relative w-full"
        ref={placeholderRef}
      ></div>
    </div>
  );
};

export default VideoJS;
