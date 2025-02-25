import { Routes, Route } from 'react-router-dom';

const WallShare = () => {
  return <div>WallShare</div>;
};

export const App = () => {
  return (
    <Routes>
      <Route path='/:id' element={<WallShare />} />
    </Routes>
  );
};
