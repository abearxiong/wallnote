import { Flow } from './pages/wall';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Auth } from './modules/layouts/Auth';
// import { basename } from './modules/basename';
import 'github-markdown-css/github-markdown.css';
export const App = () => {
  const url = new URL(location.href);
  const id = url.searchParams.get('id') || undefined;
  return (
    <>
      <Flow checkLogin={false} id={id} />
      <ToastContainer />
    </>
  );
};
