import { Flow } from './pages/wall';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Editor } from './pages/editor';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { List } from './pages/wall/pages/List';
import { Auth } from './modules/layouts/Auth';

export const App = () => {
  return (
    <>
      <BrowserRouter basename='/apps/wallnote'>
        <Routes>
          <Route element={<Auth auth={false} />}>
            <Route path='/' element={<Flow checkLogin={false}/>} />
            <Route path='/editor' element={<Editor  />} />
          </Route>
          <Route element={<Auth auth={true} />}>
            <Route path='/edit/:id' element={<Flow checkLogin={true}/>} />
            <Route path='/list' element={<List />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};
