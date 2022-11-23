export const prepServiceTime = (time: string): string => {
  if (!time) return '無提供營業時間';
  if (time === '00:00:00~23:59:59' || time === '00:00:00~23:59:00') return '24小時';
  return time;
};
