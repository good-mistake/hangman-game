import React from "react";
import Overlay from "./Overlay";
import { CategoryStatus } from "./types";

const CategorySelect = ({
  visible,
  onBack,
  onNext,
  setCategory,
}: {
  visible: boolean;
  onBack: () => void;
  onNext: () => void;
  setCategory: (cat: CategoryStatus) => void;
}) => {
  const categories: CategoryStatus[] = [
    "Movies",
    "TV Shows",
    "Countries",
    "Capital Cities",
    "Animals",
    "Sports",
  ];
  return (
    <>
      <Overlay show={visible} />
      <div className={`category  ${visible ? "visible" : "invisible"}`}>
        <header>
          <div className="goBackBtn" onClick={() => onBack()}>
            <img src="/assets/images/icon-back.svg" alt="goBackBtn" />
          </div>
          <h1>
            Pick a Category <span className="first">Pick a Category</span>{" "}
            <span className="second">Pick a Category</span>
          </h1>
        </header>
        <ul>
          {categories?.map((c, index) => {
            return (
              <li
                key={index}
                onClick={() => {
                  setCategory(c);
                  onNext();
                }}
              >
                {c}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default CategorySelect;
