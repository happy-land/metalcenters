import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../Layout/Layout';
import MapsPage from '../../pages/MapsPage';

const App: FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="map" element={<MapsPage/>} />
      </Route>
    </Routes>
  );
};

export default App;
