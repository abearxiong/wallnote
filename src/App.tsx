import { Flow } from './pages/wall';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Editor } from './pages/editor';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { List } from './pages/wall/pages/List';
import { Auth } from './modules/layouts/Auth';
import { basename } from './modules/basename';
import 'github-markdown-css/github-markdown.css';

export const App = () => {
  return (
    <>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route element={<Auth auth={false} />}>
            <Route index path='/' element={<Flow checkLogin={false} />} />
            <Route path='/editor' element={<Editor />} />
          </Route>
          <Route element={<Auth auth={true} />}>
            <Route path='/edit/:id' element={<Flow checkLogin={true} />} />
            <Route path='/list' element={<List />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};
