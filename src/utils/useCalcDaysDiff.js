import { useState, useEffect } from 'react';

const useCalcDaysDiff = (inputDate) => {
  const [dispWeek, setDispWeek] = useState();

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const updateAtDate = new Date(inputDate.seconds * 1000);
    updateAtDate.setHours(0, 0, 0, 0);

    const timeDiff = currentDate - updateAtDate;
    const weeksDiff = timeDiff / (1000 * 60 * 60 * 24 * 7);
    let diff;

    if (weeksDiff < 1) {
      diff = `${Math.floor(weeksDiff * 7)}日前`;
    } else {
      diff = `${Math.floor(weeksDiff)}週間前`;
    }

    setDispWeek(diff);
  }, [inputDate]);

  return dispWeek;
};
export default useCalcDaysDiff;
