import React from 'react';
import "destyle.css";
import './App.scss';
import Navigation from "~Navigation/Navigation";
import { useEffect } from 'react';
import { ReduxUtils } from '~Utils/ReduxUtils';
import LoadingWrapper from '~Components/LoadingWrapper/LoadingWrapper';
import { PageHelmet } from '~FeatureComponents/PageHelmet/PageHelmet';

function App() {
  useEffect(() => {
    ReduxUtils.initializeStores();

    return ReduxUtils.destroyStores;
  }, [])

  return (
    <>
      <PageHelmet/>
      <LoadingWrapper />
      <Navigation />
    </>
  );
}

export default App;
