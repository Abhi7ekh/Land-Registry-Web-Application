// client/src/components/Identicon2.jsx
import React, { useEffect, useRef } from "react";
import jazzicon from "@metamask/jazzicon";

const Identicon2 = ({ address, diameter = 40 }) => {
  const iconRef = useRef();

  useEffect(() => {
    if (address && iconRef.current) {
      iconRef.current.innerHTML = "";
      const seed = parseInt(address.slice(2, 10), 16);
      const icon = jazzicon(diameter, seed);
      iconRef.current.appendChild(icon);
    }
  }, [address, diameter]);

  return <div ref={iconRef} style={{ borderRadius: "50%" }} />;
};

export default Identicon2;
