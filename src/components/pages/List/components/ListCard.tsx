import React, { memo } from 'react';

const ListCard = memo(() => {
  return (
    <div className="mt-3 h-1/3 w-full rounded-md border-2 border-slate-400 p-2 shadow-lg">
      <div className="flex justify-between">
        <div className="flex">
          <p className="mr-2">Parking name</p>
          <p className="rounded-md border-2 border-primary px-2 text-sm text-primary">
            公營
          </p>
        </div>
        <p>距離 10 公里</p>
      </div>
      <div>地址：324247947293492384</div>
      <div>電話：2233-1233</div>
      <div>營業時間：00:00~23:59</div>
    </div>
  );
});

export default ListCard;
