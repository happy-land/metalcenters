import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../Layout/Layout';
import MapsPage from '../../pages/MapsPage';

const App: FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/1" element={<h1>1</h1>} />
        <Route path='/2' element={<h1>222</h1>} />
        <Route path='/map' element={<MapsPage />} />
        <Route path='/' element={<h1>Главная страница</h1>} />
      </Route>
    </Routes>
  );
};

export default App;
