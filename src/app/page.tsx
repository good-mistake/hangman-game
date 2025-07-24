"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import StartScreen from "./StartScreen";
import HowToPlay from "./HowToPlay";
import CategorySelect from "./CategorySelect";
import { CategoryStatus } from "./types";
import GameScreen from "./GameScreen";
import StatusOverlay from "./StatusOverlay";
import { GameStatus } from "./types";

type View =
  | "start"
  | "category"
  | "game"
  | "pause"
  | "gameover"
  | "How"
  | "win"
  | "lost"
  | "statusOverlay";

export default function Home() {
  const [category, setCategory] = useState<CategoryStatus | null>(null);
  const [error, setError] = useState("");
  const [view, setView] = useState<View>("start");
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setMuted] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [currentWord, setCurrentWord] = useState("");
  const reloadRef = useRef(() => {});
  return (
    <div className="hangMan" onClick={() => ref.current?.focus()}>
      <StartScreen
        onNext={() => setView("category")}
        visible={view === "start"}
        onHow={() => setView("How")}
      />
      <HowToPlay visible={view === "How"} onBack={() => setView("start")} />
      <CategorySelect
        onNext={() => setView("game")}
        onBack={() => setView("start")}
        visible={view === "category"}
        setCategory={setCategory}
      />
      <GameScreen
        visible={view === "game"}
        onPause={() => setGameStatus("pause")}
        category={category}
        onCategory={() => setView("category")}
        reloadRef={reloadRef}
        setStatus={setGameStatus}
        setWord={setCurrentWord}
        onQuit={() => setView("start")}
      />
    </div>
  );
}
