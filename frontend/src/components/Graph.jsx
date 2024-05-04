import { LineChart } from "@mui/x-charts/LineChart";
import { formatRelative } from "date-fns";

function Graph({ name, data, realTime, alert }) {
  console.log(alert);
  return (
    <div className="flex justify-center pt-10 pb-2 flex-col">
      <h1 className="row-span-1 text-center pt-3 font-bold">
        {name}: {realTime?.value.toFixed(2)} °C
      </h1>
      <span className="text-xs text-center">
        {realTime?.time
          ? formatRelative(new Date(realTime?.time), new Date())
          : "N/A"}
      </span>

      {data ? (
        <div className="row-span-6 flex justify-center">
          <LineChart
            xAxis={[
              {
                scaleType: "time",
                data: data.map((item) => new Date(item.time)),
              },
            ]}
            yAxis={[
              {
                label: "°C",
              },
            ]}
            series={[
              {
                data: data.map((item) => item.value),
              },
              alert
                ? {
                    data: data.map((i) => alert.lower_limit),
                    color: "red",
                    showMark: false,
                  }
                : { data: [] },
              alert
                ? {
                    data: data.map((i) => alert.upper_limit),
                    color: "red",
                    showMark: false,
                  }
                : { data: [] },
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
