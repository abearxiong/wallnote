import { ToastContentProps } from 'react-toastify';

export function SplitButtons({ closeToast }: ToastContentProps) {
  return (
    // using a grid with 3 columns
    <div className='grid grid-cols-[1fr_1px_80px] w-full'>
      <div className='flex flex-col p-4'>
        <h3 className='text-zinc-800 text-sm font-semibold'>提示</h3>
        <p className='text-sm'>有未保存的内容，是否继续打开？</p>
      </div>
      {/* that's the vertical line which separate the text and the buttons*/}
      <div className='bg-zinc-900/20 h-full' />
      <div className='grid grid-rows-[1fr_1px_1fr] h-full'>
        {/*specifying a custom closure reason that can be used with the onClose callback*/}
        <button onClick={() => closeToast('cancle')} className='text-purple-600'>
          取消
        </button>
        <div className='bg-zinc-900/20 w-full' />
        {/*specifying a custom closure reason that can be used with the onClose callback*/}
        <button onClick={() => closeToast('success')}>继续</button>
      </div>
    </div>
  );
}

//   toast(SplitButtons, {
//     closeButton: false,
//     className: 'p-0 w-[400px] border border-purple-600/40',
//     ariaLabel: 'Email received',
//     onClose: (reason) => {
//       if (reason === 'success') {
//         set({ open: true, selectedNode: data, hasEdited: false });
//       }
//     },
//   });
