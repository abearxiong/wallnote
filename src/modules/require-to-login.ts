import { DialogModal } from '@kevisual/system-ui/dist/modal';
// import '@kevisual/system-ui/dist/modal.css';

const content = document.createElement('div');
const loginUrl = '/root/center/user/login';
export const redirectToLogin = (open = true) => {
  const url = new URL(loginUrl, window.location.href);
  url.searchParams.set('redirect', window.location.href);
  if (open) {
    window.open(url.toString(), '_blank');
  } else {
    return url.toString();
  }
};
content.innerHTML = `
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
      <h2 class="text-2xl font-bold mb-4">Token 无效</h2>
      <p class="mb-6">您的登录凭证已失效，请重新登录。</p>
      <a href="${redirectToLogin(false)}" class="inline-block bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">确定</a>
    </div>
`;
export const modal = DialogModal.render(content, {
  id: 'redirect-to-login',
  contentStyle: {
    width: 'unset',
  },
  dialogTitleStyle: {
    display: 'none',
    padding: '0',
  },
  dialogContentStyle: {
    padding: '0',
  },
  mask: true,
  open: false,
});
