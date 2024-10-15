import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  const [username, setUsername] = useState("");
  return (
    <>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        id="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <Link to={`./room?name=${username}`}>
      <button>
        Join
      </button>
      </Link>
    </>
  );
};

export default Landing;
