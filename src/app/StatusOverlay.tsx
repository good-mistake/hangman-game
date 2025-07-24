import React from "react";
import { GameStatus } from "./types";
import { useEffect, useRef } from "react";
import ConfettiJson from "./ConfettiJson.json";
import fail from "./fail.json";
import Lottie from "lottie-react";
const StatusOverlay = ({
  status,
  onRestart,
  onResume,
  onCategory,
  onQuit,
  visible,
}: {
  status: GameStatus;
  onRestart: () => void;
  onResume: () => void;
  onCategory: () => void;
  onQuit: () => void;
  visible: boolean;
}) => {
  const messages: Record<
    Exclude<GameStatus, "playing">,
    {
      title: string;
      mainLabel: string;
      newLabel: string;
      quitLabel: string;
      action: () => void;
    }
  > = {
    pause: {
      title: "Paused",
      mainLabel: "continue",
      newLabel: "new category",
      quitLabel: "quit game",
      action: onResume,
    },
    won: {
      title: "You Win",
      mainLabel: "play again!",
      newLabel: "new category",
      quitLabel: "quit game",
      action: onRestart,
    },
    lost: {
      title: "You Lose",
      mainLabel: "play again!",
      newLabel: "new category",
      quitLabel: "quit game",
      action: onRestart,
    },
  };
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        visible &&
        status === "pause" &&
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        onResume();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, status, onResume]);

  if (status === "playing") return null;

  const { title, mainLabel, newLabel, quitLabel, action } = messages[status];

  return (
    <div className={`statusOverlay  ${visible ? "visible" : "invisible"}`}>
      {status === "won" && (
        <div className="confettiWrapper">
          <Lottie animationData={ConfettiJson} loop={true} autoplay={true} />
        </div>
      )}{" "}
      {status === "lost" && (
        <div className="failWrapper">
          <Lottie animationData={fail} loop={true} autoplay={true} />
        </div>
      )}
      <div className="overlayContent" ref={overlayRef}>
        <h1>
          {title}
          <span className="first"> {title}</span>{" "}
          <span className="second"> {title}</span>
        </h1>
        <div>
          <button onClick={action} className="resume">
            {mainLabel}
          </button>
          <button onClick={onCategory} className="new">
            {newLabel}
          </button>
          <button onClick={onQuit} className="quit">
            {quitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusOverlay;
