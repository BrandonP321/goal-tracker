import React from 'react';
import './App.scss';
import Navigation from "~Navigation/Navigation";
import "destyle.css";
import { useEffect } from 'react';
import { ReduxUtils } from '~Utils/ReduxUtils';
import LoadingWrapper from '~Components/LoadingWrapper/LoadingWrapper';
import { WindowUtils } from '~Utils/WindowUtils';

function App() {
  useEffect(() => {
    ReduxUtils.initializeStores();

    return ReduxUtils.destroyStores;
  }, [])

  return (
    <>
      <LoadingWrapper />
      <Navigation />
      {Array(100).fill(null).map((_, i) => {
        return (
          <h1 key={i} onClick={WindowUtils.toggleScrollLock} style={{ fontSize: "1.5rem" }}>{i}</h1>
        )
      })}
    </>
  );
}

export default App;
