import { useEffect, useState } from "react";
import Graph from "./components/Graph";

function App() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const response = await fetch("http://localhost:3000/temperatures");
    let data = await response.json();

    setData(data);
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const groupedData = data
    ? data.reduce((acc, item) => {
        if (!acc[item.deviceId]) {
          acc[item.deviceId] = [];
        }
        acc[item.deviceId].push(item);
        return acc;
      }, {})
    : {};
      console.log(groupedData)
  return (
    <main>
      <h1 className="text-3xl font-bold p-4 flex justify-center">uuMeteo</h1>
      <div className="grid row-auto grid-cols-2">
        {Object.entries(groupedData).map(([deviceId, data]) => (
          <Graph key={deviceId} name={deviceId} data={data} />
        ))}
      </div>
    </main>
  );
}

export default App;
