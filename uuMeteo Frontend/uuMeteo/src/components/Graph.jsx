import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";

function Graph({ name, data }) {
  const getHour = (timeString) => {
    const dateObject = new Date(timeString);
    const hour = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    return minutes;
  };

  return (
    <div className="grid grid-rows-7 justify-center pt-20 pb-5 col-span-1">
      <h1 className="row-span-1 text-center pt-3 font-bold">{name}</h1>
      {data ? (
        <div className="row-span-6">
          <LineChart
            xAxis={[
              {
                data: data.slice(-24).map((item) => getHour(item.time)),
              },
            ]}
            series={[
              {
                data: data.slice(-24).map((item) => item.value),
              },
            ]}
            width={500}
            height={300}
          />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default Graph;
