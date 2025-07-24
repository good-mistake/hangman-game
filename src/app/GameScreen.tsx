import React, { useEffect, useState, useRef, useCallback } from "react";
import { CategoryStatus } from "./types";
import data from "../../data.json";
import { GameStatus } from "./types";
import StatusOverlay from "./StatusOverlay";
import { AnimatePresence, motion } from "framer-motion";

const CHANCES = 8;
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
const MAX = 8;
const GameScreen = ({
  visible,
  onPause,
  category,
  reloadRef,
  setWord,
  setStatus,
  onCategory,
  onQuit,
}: {
  visible: boolean;
  onPause: () => void;
  category: CategoryStatus | null;
  reloadRef: React.MutableRefObject<() => void>;
  setStatus: (s: GameStatus) => void;
  setWord: (w: string) => void;
  onCategory: () => void;
  onQuit: () => void;
}) => {
  const [currentWord, setCurrentWord] = useState("");
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [wrongPick, setWrongPick] = useState(0);
  const [currentStatus, setCurrentStatus] = useState<GameStatus>("playing");
  const [animateHeart, setAnimateHeart] = useState(false);
  const correctSfx = useRef<HTMLAudioElement | null>(null);
  const wrongSfx = useRef<HTMLAudioElement | null>(null);
  const winSfx = useRef<HTMLAudioElement | null>(null);
  const loseSfx = useRef<HTMLAudioElement | null>(null);
  const guessRef = useRef<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const cooldownRef = useRef(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);

  const load = useCallback(() => {
    if (!category) return;
    const list = data.categories[category];
    const newWord =
      list[Math.floor(Math.random() * list.length)].name.toLowerCase();

    setCurrentWord(newWord);
    setWord(newWord);
    setCurrentGuess([]);
    guessRef.current = [];
    setWrongPick(0);
    setCurrentStatus("playing");
    setStatus("playing");
  }, [category, setWord, setStatus]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    reloadRef.current = load;
  }, [load, reloadRef]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    correctSfx.current = new Audio("/sounds/rightanswer-95219.mp3");
    wrongSfx.current = new Audio("/sounds/wronganswer-37702.mp3");
    winSfx.current = new Audio("/sounds/success-fanfare-trumpets-6185.mp3");
    loseSfx.current = new Audio("/sounds/game-over-39-199830.mp3");
  }, []);

  useEffect(() => {
    [correctSfx, wrongSfx, winSfx, loseSfx].forEach((audioRef) => {
      if (audioRef.current) {
        audioRef.current.volume = muted ? 0 : volume;
      }
    });
  }, [volume, muted]);

  useEffect(() => {
    if (visible && inputRef.current) inputRef.current.focus();

    const onKey = (e: KeyboardEvent) => {
      const l = e.key.toLowerCase();
      if (
        visible &&
        currentStatus === "playing" &&
        currentWord &&
        /^[a-z]$/.test(l)
      ) {
        handleGuess(l);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, currentWord, currentStatus]);

  useEffect(() => {
    if (!currentWord) return;
    if (currentWord.split("").every((l) => currentGuess.includes(l))) {
      setCurrentStatus("won");
      setAnimateHeart(false);
      setStatus("won");
      winSfx.current?.play();
    } else if (wrongPick >= CHANCES) {
      setCurrentStatus("lost");
      setAnimateHeart(false);
      setStatus("lost");
      loseSfx.current?.play();
    }
  }, [currentGuess, wrongPick]);

  const handleGuess = (g: string) => {
    if (
      currentStatus !== "playing" ||
      !currentWord ||
      guessRef.current.includes(g)
    )
      return;
    cooldownRef.current = true;
    setTimeout(() => {
      cooldownRef.current = false;
    }, 100);
    const ok = currentWord.includes(g);
    if (ok) {
      correctSfx.current?.play();
    } else {
      wrongSfx.current?.play();
    }
    guessRef.current = [...guessRef.current, g];
    setCurrentGuess(guessRef.current);
    if (!ok) {
      setWrongPick((w) => w + 1);
      setAnimateHeart(true);
      setTimeout(() => setAnimateHeart(false), 300);
    }
  };

  const words = currentWord.split(" ");
  const lines: string[][] = [];
  for (let i = 0; i < words.length; i += MAX) {
    lines.push(words.slice(i, i + MAX));
  }

  return (
    <>
      <AnimatePresence>
        {currentStatus !== "playing" && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0   flex items-center justify-center z-50"
          >
            <StatusOverlay
              visible={currentStatus !== ("playing" as string)}
              status={currentStatus}
              onRestart={() => {
                load();
              }}
              onResume={() => {
                setCurrentStatus("playing");
                setStatus("playing");
              }}
              onCategory={() => {
                load();
                onCategory();
              }}
              onQuit={() => {
                load();
                onQuit();
              }}
            />{" "}
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`game  ${visible ? "visible" : "invisible"}`}>
        <div className="overlays" />
        <header>
          <div className="top">
            <div
              className="goBackBtn"
              onClick={() => {
                setCurrentStatus("pause");
                setStatus("pause");
                onPause();
              }}
            >
              <img src="/assets/images/icon-menu.svg" alt="menu" />
            </div>
            <h1>{category}</h1>
          </div>
          <div className="sound">
            <button
              onClick={() => setMuted((prev) => !prev)}
              className="bg-gradient-to-r from-[#FE71FE] to-[#7199FF] p-2 rounded-full text-white"
            >
              {muted ? (
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path d="M16 7L8 15" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 7L16 15" stroke="currentColor" strokeWidth="2" />
                  <path d="M5 9H2v6h3l4 4V5l-4 4z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path d="M5 9H2v6h3l4 4V5l-4 4z" fill="currentColor" />
                  <path
                    d="M15 8.5a4.5 4.5 0 0 1 0 7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M17.5 6a7.5 7.5 0 0 1 0 12"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </button>
            <div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                className=" transition-all duration-200 ease-in-out"
                onChange={(e) => setVolume(Number(e.target.value))}
                style={{
                  accentColor: "#261676",
                }}
              />
            </div>
          </div>

          <div className="bottom">
            <p>
              <span
                style={{
                  width: `${100 - (wrongPick / CHANCES) * 100}%`,
                }}
              ></span>
            </p>
            <img
              src="/assets/images/icon-heart.svg"
              alt="heart"
              className={`heart ${animateHeart ? "animate" : ""}`}
            />
          </div>
        </header>
        <div className="correctGuesses">
          {lines.map((line, lineIndex) => (
            <div className="wordGroup" key={lineIndex}>
              {line.map((word, wordIndex) => (
                <div className="words" key={`${lineIndex}-${wordIndex}`}>
                  {word.split("").map((l, i) =>
                    currentGuess.includes(l) ||
                    currentStatus === "won" ||
                    currentStatus === "lost" ? (
                      <span key={`${l}-${i}`} className="correct">
                        {l}
                      </span>
                    ) : (
                      <span key={`${l}-${i}`} className="emptyGuess"></span>
                    )
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>{" "}
        <div className="keyboard">
          {ALPHABET.map((c, index) => (
            <button
              key={index}
              onClick={() => handleGuess(c)}
              disabled={currentGuess.includes(c) || currentStatus !== "playing"}
              className={
                currentGuess.includes(c) || currentStatus !== "playing"
                  ? "disabled"
                  : ""
              }
            >
              {c}
            </button>
          ))}
        </div>
        <input
          ref={inputRef}
          type="text"
          style={{ opacity: 0, position: "absolute", pointerEvents: "none" }}
          onChange={(e) => {
            if (currentStatus !== "playing") return;
            const letter = e.target.value.toLowerCase();
            if (/^[a-z]$/.test(letter)) {
              handleGuess(letter);
            }
            e.target.value = "";
          }}
        />
      </div>
    </>
  );
};

export default GameScreen;
