import { useContext, useEffect, useState } from "react";
import { fetchDevices, fetchTemperatures, fetchAlerts, logout } from '../services/apis';
import Graph from '../components/Graph';
import { MeContext } from '../contexts/MeContext';
import AlertSettings from '../components/AlertSettings';

const UPDATE_INTERVAL = 5000;

export default function Dashboard() {
  const [temperatures, setTemperatures] = useState({});
  const [devices, setDevices] = useState([]);
  const [deviceTimeFrames, setDeviceTimeFrames] = useState({});
  const [isAlertSettingsVisible, setIsAlertSettingsVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [triggeredAlerts, setTriggeredAlerts] = useState([]);

  const { refetch } = useContext(MeContext);

  const fetchTriggeredAlerts = async () => {
    try {
      const alerts = await fetchAlerts();
      const triggeredAlerts = alerts.filter((alert) => alert.triggered_at);
      setTriggeredAlerts(triggeredAlerts);
    } catch (error) {
      console.error('Error fetching triggered alerts:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const devices = await fetchDevices();
      setDevices(devices);

      const fetchTemperatureData = async () => {
        const temperatureData = await Promise.all(
          devices.map(async (device) => {
            const t = await fetchTemperatures(
              device.deviceId,
              deviceTimeFrames[device.deviceId] || '1h'
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
      fetchTriggeredAlerts();

      const interval = setInterval(() => {
        fetchTemperatureData();
        fetchTriggeredAlerts();
      }, UPDATE_INTERVAL);

      return () => clearInterval(interval);
    };

    fetchData();
  }, [deviceTimeFrames]);

  return (
    <main className="py-3 px-5">
      <div className="flex justify-end">
        <button
          className="border p-1 mr-2"
          onClick={() => setIsAlertSettingsVisible(true)}
        >
          Set Alerts
        </button>
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

      {isAlertSettingsVisible && (
        <AlertSettings
          deviceId={selectedDevice}
          onClose={() => setIsAlertSettingsVisible(false)}
        />
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Triggered Alerts</h2>
        {triggeredAlerts.length > 0 ? (
          <ul>
            {triggeredAlerts.map((alert, index) => (
              <li key={index} className="bg-red-100 p-4 rounded-lg mb-2">
                <p>
                  Device ID: <span className="font-bold">{alert.deviceId}</span>
                </p>
                <p>
                  Triggered at: <span className="font-bold">{alert.triggered_at}</span>
                </p>
                <p>
                  Upper Limit: <span className="font-bold">{alert.upperLimit}</span>
                </p>
                <p>
                  Lower Limit: <span className="font-bold">{alert.lowerLimit}</span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No triggered alerts.</p>
        )}
      </div>
    </main>
  );
}
