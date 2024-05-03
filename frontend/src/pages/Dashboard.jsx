import React, { useContext, useEffect, useState } from "react";
import AlertSettings from "../components/AlertSettings";
import AlertsModal from "../components/AlertsModal";
import Graph from "../components/Graph";
import { MeContext } from "../contexts/MeContext";
import { useInterval } from "../hooks/useInterval";
import { useNavigate } from "react-router-dom";
import {
  fetchAlerts,
  fetchDevices,
  fetchTemperatures,
  logout,
} from "../services/apis";

const UPDATE_INTERVAL = 5000;

export default function Dashboard() {
  const [temperatures, setTemperatures] = useState({});
  const [devices, setDevices] = useState([]);
  const [deviceTimeFrames, setDeviceTimeFrames] = useState({});
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
      setTriggeredAlertsCount(triggeredAlerts.length);
    } catch (error) {
      console.error("Error fetching triggered alerts:", error);
    }
  };

  const fetchTemperaturesAndDevices = async () => {
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
  };

  useInterval(fetchTriggeredAlerts, UPDATE_INTERVAL);
  useInterval(fetchTemperaturesAndDevices, UPDATE_INTERVAL);

  useEffect(() => {
    (async () => {
      await fetchTemperaturesAndDevices();
      await fetchTriggeredAlerts();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await fetchTemperaturesAndDevices();
    })();
  }, [deviceTimeFrames]);

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
              </select>
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
