import { useContext, useEffect, useState } from "react";
import { fetchDevices, fetchTemperatures, logout } from "../services/apis";
import Graph from "../components/Graph";
import { MeContext } from "../contexts/MeContext";

const UPDATE_INTERVAL = 5000;

export default function Dashboard() {
  const [temperatures, setTemperatures] = useState({});
  const [devices, setDevices] = useState([]);
  const [deviceTimeFrames, setDeviceTimeFrames] = useState({});

  const { refetch } = useContext(MeContext);

  console.log(deviceTimeFrames);

  // TODO: fix later
  useEffect(() => {
    const fetchData = async () => {
      const devices = await fetchDevices();
      setDevices(devices);

      const fetchTemperatureData = async () => {
        const temperatureData = await Promise.all(
          devices.map(async (device) => {
            const t = await fetchTemperatures(
              device.deviceId,
              deviceTimeFrames[device.deviceId] || "1h"
            );
            return { deviceId: device.deviceId, temperatures: t };
          })
        );

        const temperatures = temperatureData.reduce(
          (acc, { deviceId, temperatures }) => {
            return { ...acc, [deviceId]: temperatures };
          },
          {}
        );

        setTemperatures(temperatures);
      };

      fetchTemperatureData();

      const interval = setInterval(fetchTemperatureData, UPDATE_INTERVAL);

      return () => clearInterval(interval);
    };

    fetchData();
  }, [deviceTimeFrames]);

  return (
    <main className="py-3 px-5">
      <div className="flex justify-end">
        <button
          className="border p-1"
          onClick={async () => {
            await logout();
            await refetch();
          }}
        >
          Logout
        </button>
      </div>
      <h1 className="text-3xl font-bold p-4 flex justify-center">uuMeteo</h1>
      <div className="grid row-auto grid-cols-2">
        {devices.map((device) => (
          <div key={device.deviceId}>
            <Graph name={device.name} data={temperatures[device.deviceId]} />
            <div className="flex justify-center">
              <select
                value={deviceTimeFrames[device.deviceId]}
                onChange={(e) => {
                  const value = e.target.value;
                  setDeviceTimeFrames((prevState) => ({
                    ...prevState,
                    [device.deviceId]: value,
                  }));
                }}
              >
                <option value="1h">1 hour</option>
                <option value="1d">1 day</option>
                <option value="1w">1 week</option>
                <option value="1m">1 month</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
