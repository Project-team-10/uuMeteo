import { addDays, subDays } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertSettings from "../components/AlertSettings";
import AlertsModal from "../components/AlertsModal";
import Graph from "../components/Graph";
import { MeContext } from "../contexts/MeContext";
import { useInterval } from "../hooks/useInterval";
import {
  fetchAlerts,
  fetchDevices,
  fetchHistoricalTemperatures,
  fetchRealTimeTemperatures,
  logout,
} from "../services/apis";

const HISTORICAL_TEMPERATURES_UPDATE_INTERVAL = 60000;
const REAL_TIME_TEMPERATURES_UPDATE_INTERVAL = 5000;
const ALERTS_UPDATE_INTERVAL = 60000;

export default function Dashboard() {
  const [historicalTemperatures, setHistoricalTemperatures] = useState({});
  const [realTimeTemperatures, setRealTimeTemperatures] = useState([]);
  const [devices, setDevices] = useState([]);
  const [deviceTimeFrames, setDeviceTimeFrames] = useState({});
  const [deviceIntervals, setDeviceIntervals] = useState({});

  const [isAlertSettingsVisible, setIsAlertSettingsVisible] = useState(false);
  const [isAlertsModalVisible, setIsAlertsModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [triggeredAlerts, setTriggeredAlerts] = useState([]);
  const [triggeredAlertsCount, setTriggeredAlertsCount] = useState(0);

  const navigate = useNavigate();

  const fetchTriggeredAlerts = async () => {
    try {
      const alerts = await fetchAlerts();

      // Filter the alerts to only include the triggered ones
      const triggeredAlerts = alerts.filter(
        (alert) => alert.triggered_at !== null
      );

      setTriggeredAlerts(triggeredAlerts);
      setTriggeredAlertsCount(triggeredAlerts?.length ?? 0);
    } catch (error) {
      console.error("Error fetching triggered alerts:", error);
    }
  };

  const fetchTemperaturesAndDevices = async () => {
    const devices = await fetchDevices();
    setDevices(devices);

    for (const device of devices) {
      if (!deviceIntervals[device.deviceId]) {
        setDeviceIntervals((prevState) => ({
          ...prevState,
          [device.deviceId]: {
            from: subDays(new Date(), 2).toISOString().split("T")[0],
            to: addDays(new Date(), 1).toISOString().split("T")[0],
          },
        }));
      }
    }

    const fetchHistoricalTemperatureData = async () => {
      const temperatureData = await Promise.all(
        devices.map(async (device) => {
          const t = await fetchHistoricalTemperatures(
            device.deviceId,
            deviceTimeFrames[device.deviceId] || "1h",
            deviceIntervals[device.deviceId]?.["from"]
              ? new Date(deviceIntervals[device.deviceId]?.["from"])
              : new Date("2021-01-01"),
            deviceIntervals[device.deviceId]?.["to"]
              ? new Date(deviceIntervals[device.deviceId]?.["to"])
              : new Date()
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

      setHistoricalTemperatures(temperatures);
    };

    fetchHistoricalTemperatureData();
  };

  const fetchRealTimeTemperatureData = async () => {
    const realTimeTemperatureData = await fetchRealTimeTemperatures();
    setRealTimeTemperatures(realTimeTemperatureData);
  };

  useInterval(fetchTriggeredAlerts, ALERTS_UPDATE_INTERVAL);
  useInterval(
    fetchTemperaturesAndDevices,
    HISTORICAL_TEMPERATURES_UPDATE_INTERVAL
  );
  useInterval(
    fetchRealTimeTemperatureData,
    REAL_TIME_TEMPERATURES_UPDATE_INTERVAL
  );

  useEffect(() => {
    (async () => {
      await fetchTemperaturesAndDevices();
      await fetchTriggeredAlerts();
      await fetchRealTimeTemperatureData();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await fetchTemperaturesAndDevices();
    })();
  }, [deviceTimeFrames, deviceIntervals]);

  const { refetch } = useContext(MeContext);

  const handleOpenAlertsModal = () => {
    setIsAlertsModalVisible(true);
  };

  const handleCloseAlertsModal = () => {
    setIsAlertsModalVisible(false);
  };

  const handleOpenDeviceRegistration = () => {
    navigate("/devices"); // Navigate to the Device Registration page
  };

  return (
    <main className="py-3 px-5">
      <div className="flex justify-end">
        <button
          className="border p-1 mr-2"
          style={{
            backgroundColor: "rgba(37,99,235,0.7)",
            color: "black",
            border: "1px solid rgba(37,99,235,0.7)",
            fontWeight: "bold",
            padding: "6px 12px",
            borderRadius: "4px",
          }}
          onClick={handleOpenDeviceRegistration}
        >
          Device Registration
        </button>
        <button
          className="border p-1 mr-2 relative"
          style={{
            backgroundColor: "rgba(37,99,235,0.7)",
            color: "black",
            border: "1px solid rgba(37,99,235,0.7)",
            fontWeight: "bold",
            padding: "6px 12px",
            borderRadius: "4px",
          }}
          onClick={handleOpenAlertsModal}
        >
          View Alerts
          {triggeredAlertsCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
              {triggeredAlertsCount}
            </span>
          )}
        </button>
        <button
          className="border p-1"
          style={{
            backgroundColor: "rgba(223,63,5 ,0.3)",
            color: "black",
            fontWeight: "bold",
            border: "1px solid rgba(37,99,235,0.7)",
            padding: "6px 12px",
            borderRadius: "4px",
          }}
          onClick={async () => {
            await logout();
            await refetch();
          }}
        >
          Logout
        </button>
      </div>
      <h1 className="text-3xl font-bold p-4 flex justify-center">uuMeteo</h1>
      <div className="grid row-auto lg:grid-cols-2 grid-cols-1">
        {devices.map((device) => (
          <div key={device.deviceId}>
            <Graph
              name={device.name}
              data={historicalTemperatures[device.deviceId]}
              realTime={realTimeTemperatures.find(
                (t) => t.deviceId === device.deviceId
              )}
            />
            <div className="text-sm">
              <div className="flex justify-center mb-1">
                <span>Granularity: </span>
                <select
                className="ml-1"
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
                </select>
              </div>
              <div className="flex justify-center">
                <span>From: </span>
                <input
                  type="date"
                  name="from"
                  id="from"
                  value={deviceIntervals[device.deviceId]?.["from"]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDeviceIntervals((prevState) => ({
                      ...prevState,
                      [device.deviceId]: {
                        ...prevState[device.deviceId],
                        from: value,
                      },
                    }));
                  }}
                />
                <span className="ml-2">To: </span>
                <input
                  type="date"
                  name="to"
                  id="to"
                  value={deviceIntervals[device.deviceId]?.["to"]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDeviceIntervals((prevState) => ({
                      ...prevState,
                      [device.deviceId]: {
                        ...prevState[device.deviceId],
                        to: value,
                      },
                    }));
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAlertSettingsVisible && (
        <AlertSettings
          deviceId={selectedDevice}
          onClose={() => setIsAlertSettingsVisible(false)}
          devices={devices}
        />
      )}

      {isAlertsModalVisible && (
        <AlertsModal
          isVisible={isAlertsModalVisible}
          onClose={handleCloseAlertsModal}
          devices={devices}
        />
      )}
    </main>
  );
}
