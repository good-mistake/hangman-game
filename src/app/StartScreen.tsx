"use client";
import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Overlay from "./Overlay";

const StartScreen = ({
  onNext,
  visible,
  onHow,
}: {
  onNext: () => void;
  visible: boolean;
  onHow: () => void;
}) => {
  return (
    <>
      <div className={`  start `}>
        <div className={`screenWrapper ${visible ? "visible" : "invisible"} `}>
          <div className={` startBtnC`}>
            <img src="/assets/images/logo.svg" alt="logo" className="logo" />
            <div className="playBtn" onClick={() => onNext()}>
              <img src="/assets/images/icon-play.svg" alt="goBackBtn" />
            </div>

            <button onClick={() => onHow()}>HOW TO PLAY</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartScreen;
