import { useEffect } from 'react';
import { useWallStore } from '../store/wall';
import { useUserWallStore } from '../store/user-wall';
import { useShallow } from 'zustand/react/shallow';
import { formatDate, formatRelativeDate } from '../../../modules/dayjs';
import { useNavigate } from 'react-router-dom';
export const List = () => {
  const navigate = useNavigate();
  const wallStore = useUserWallStore(
    useShallow((state) => {
      return {
        wallList: state.wallList,
        queryWallList: state.queryWallList,
      };
    }),
  );
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    wallStore.queryWallList();
  };
  return (
    <div className='p-4 bg-white w-full h-full flex flex-col'>
      <div className='flex justify-between h-10 items-center'>
        <div className='text-2xl font-bold'>Wall Note</div>
      </div>
      <div className='flex flex-col flex-grow overflow-hidden'>
        <div className='flex flex-wrap gap-4 overflow-y-auto'>
          {wallStore.wallList.map((wall) => {
            return (
              <div
                key={wall.id}
                className='p-4 border border-gray-200 w-80 rounded-md'
                onClick={() => {
                  navigate(`/wall/${wall.id}`);
                }}>
                <div>
                  <div>{wall.title}</div>
                </div>
                <div className='mt-2 flex flex-col gap-2'>
                  <div className='text-sm text-gray-500 line-clamp-2'>{wall.summary}</div>
                  <div className='text-sm text-gray-500 flex flex-wrap gap-2 '>
                    {wall?.tags?.map?.((tag) => {
                      return (
                        <div className='text-xs text-gray-500 border border-gray-200 rounded-md px-2 py-1' key={tag}>
                          {tag}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className='mt-2 flex justify-between'>
                  <div className='text-sm text-gray-500'>{formatDate(wall?.createdAt, 'YYYY-MM-DD')}</div>
                  <div className='text-sm text-gray-500'>{formatRelativeDate(wall?.createdAt)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
