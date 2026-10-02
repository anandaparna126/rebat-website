"use client";

import type { TransformStage } from "@/lib/story";

// Plays natively (loop attribute, full clip) unless the stage sets
// `loopSeconds`, in which case playback jumps back to 0 once it passes
// that mark instead of running to the clip's actual end.
export function StageVideo({ stage }: { stage: TransformStage }) {
  return (
    <video
      className="h-full w-full object-cover"
      src={stage.video}
      poster={stage.image}
      autoPlay
      muted
      loop={!stage.loopSeconds}
      playsInline
      onTimeUpdate={
        stage.loopSeconds
          ? (e) => {
              if (e.currentTarget.currentTime >= stage.loopSeconds!) {
                e.currentTarget.currentTime = 0;
                e.currentTarget.play();
              }
            }
          : undefined
      }
    />
  );
}
