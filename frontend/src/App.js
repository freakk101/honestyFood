import React, { useState } from "react";
import Loader from "react-loader-spinner";

import "./App.css";

function App() {
  const [data, setData] = useState({
    status: "",
    message: "",
    query: "",
    loader: false
  });

  let handleChange = e => {
    setData({ ...data, query: e.target.value });
    console.log(data.query);
  };

  let submit = e => {
    setData({ ...data, loader: true });
    console.log(data.loader);
    e.preventDefault();
    fetch(`http://localhost:3001/location/${data.query}`)
      .then(res => res.json())
      .then(result =>
        setData(() => {
          return { ...data, status: result.status, message: result.message };
        })
      )
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={submit}>
          <label>
            <h2>Find location</h2>
          </label>
          <br />
          <input type="text" onChange={handleChange} />
          <button type="sumbit"> Search </button>
        </form>
        {data.loader ? (
          <Loader type="Bars" color="#00BFFF" height="100" width="100" />
        ) : (
          <div className="result">
            <span>{data.message}</span>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
