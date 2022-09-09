import React from 'react';
import "destyle.css";
import './App.scss';
import Navigation from "~Navigation/Navigation";
import { useEffect } from 'react';
import { ReduxUtils } from '~Utils/ReduxUtils';
import LoadingWrapper from '~Components/LoadingWrapper/LoadingWrapper';

function App() {
  useEffect(() => {
    ReduxUtils.initializeStores();

    return ReduxUtils.destroyStores;
  }, [])

  return (
    <>
      <LoadingWrapper />
      <Navigation />
    </>
  );
}

export default App;
