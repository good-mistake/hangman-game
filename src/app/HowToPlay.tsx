import React from "react";
import Overlay from "./Overlay";

const HowToPlay = ({
  visible,
  onBack,
}: {
  visible: boolean;
  onBack: () => void;
}) => {
  return (
    <>
      <Overlay show={visible} />{" "}
      <div className={`explain  ${visible ? "visible" : "invisible"}`}>
        <header>
          <div className="goBackBtn" onClick={() => onBack()}>
            <img src="/assets/images/icon-back.svg" alt="goBackBtn" />
          </div>
          <h1>
            How to Play <span className="first">How to Play</span>{" "}
            <span className="second">How to Play</span>
          </h1>
        </header>
        <ul>
          <li>
            <h3>01</h3>
            <div>
              <h5>Choose a category</h5>
              <p>
                First, choose a word category, like animals or movies. The
                computer then randomly selects a secret word from that topic and
                shows you blanks for each letter of the word.
              </p>
            </div>
          </li>
          <li>
            <h3>02</h3>
            <div>
              <h5>Guess letters</h5>
              <p>
                Take turns guessing letters. The computer fills in the relevant
                blank spaces if your guess is correct. If it’s wrong, you lose
                some health, which empties after eight incorrect guesses.
              </p>
            </div>
          </li>
          <li>
            <h3>03</h3>
            <div>
              <h5>Win or lose</h5>
              <p>
                You win by guessing all the letters in the word before your
                health runs out. If the health bar empties before you guess the
                word, you lose.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default HowToPlay;
