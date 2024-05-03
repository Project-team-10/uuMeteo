import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";

function Graph({ name, data }) {
  return (
    <div className="grid grid-rows-7 justify-center pt-20 pb-5 col-span-1">
      <h1 className="row-span-1 text-center pt-3 font-bold">
        {name}: {data?.[data.length - 1]?.value?.toFixed(2)} °C
      </h1>

      {data ? (
        <div className="row-span-6">
          <LineChart
            xAxis={[
              {
                scaleType: "time",
                data: data.slice(-24).map((item) => new Date(item.time)),
              },
            ]}
            yAxis={[
              {
                label: "°C",
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
