import { Button } from '@mui/material';
import './index.css';
export const AppendDemo = () => {
  return (
    <div className='demo-login-prompt'>
      <p className='demo-login-link'>
        <a href='/user/login'>请先登录</a>
      </p>
    </div>
  );
};

export const DemoLogin = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <AppendDemo />
      <Button
        variant='contained'
        color='primary'
        onClick={() => {
          window.location.href = `/user/login/?redirect=${window.location.href}&username=demo&password=xiong1015`;
        }}>
        试用登录
      </Button>
    </div>
  );
};
