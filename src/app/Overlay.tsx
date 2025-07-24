import React from "react";

const Overlay = ({ show }: { show: boolean }) =>
  show ? <div className="overlay" /> : null;

export default Overlay;
