import React, { useState, useEffect } from "react";
import { fetchAlerts, clearAlert, deleteAlert } from "../services/apis";
import AlertSettings from "./AlertSettings";

const AlertsModal = ({ isVisible, onClose, devices }) => {
  const [triggeredAlerts, setTriggeredAlerts] = useState([]);
  const [unTriggeredAlerts, setUnTriggeredAlerts] = useState([]);
  const [isAlertSettingsVisible, setIsAlertSettingsVisible] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  console.log(devices);

  const fetchAlertsData = async () => {
    try {
      const alerts = await fetchAlerts();
      const triggeredAlerts = alerts
        .filter((alert) => alert.triggered_at !== null)
        .map((alert) => ({
          id: alert.id,
          deviceId: alert.device_id,
          upperLimit: alert.upper_limit,
          lowerLimit: alert.lower_limit,
          triggered_at: alert.triggered_at,
        }));

      const unTriggeredAlerts = alerts
        .filter((alert) => alert.triggered_at === null)
        .map((alert) => ({
          id: alert.id,
          deviceId: alert.device_id,
          upperLimit: alert.upper_limit,
          lowerLimit: alert.lower_limit,
          triggered_at: alert.triggered_at,
        }));

      setTriggeredAlerts(triggeredAlerts);
      setUnTriggeredAlerts(unTriggeredAlerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const handleClearAlert = async (alertId) => {
    try {
      await clearAlert(alertId);
      fetchAlertsData();
    } catch (error) {
      console.error("Error clearing alert:", error);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      await deleteAlert(alertId);
      fetchAlertsData();
    } catch (error) {
      console.error("Error deleting alert:", error);
    }
  };

  const handleCreateAlert = () => {
    setIsAlertSettingsVisible(true);
  };

  const handleCloseAlertSettings = () => {
    setIsAlertSettingsVisible(false);
    fetchAlertsData();
  };

  useEffect(() => {
    if (isVisible) {
      fetchAlertsData();
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isAlertSettingsVisible) {
      fetchAlertsData();
    }
  }, [isAlertSettingsVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h2 className="text-2xl font-bold mb-4">Triggered Alerts</h2>
              {triggeredAlerts.length > 0 ? (
                <ul>
                  {triggeredAlerts.map((alert, index) => (
                    <li key={index} className="bg-red-100 p-4 rounded-lg mb-2">
                      <p>
                        Device:{" "}
                        <span className="font-bold">
                          {devices.find((d) => d.deviceId === alert.deviceId)
                            ?.name ?? ""}
                        </span>
                      </p>
                      <p>
                        Triggered at:{" "}
                        <span className="font-bold">
                          {new Date(alert.triggered_at).toLocaleString()}
                        </span>
                      </p>
                      <p>
                        Upper Limit:{" "}
                        <span className="font-bold">{alert.upperLimit} °C</span>
                      </p>
                      <p>
                        Lower Limit:{" "}
                        <span className="font-bold">{alert.lowerLimit} °C</span>
                      </p>
                      <div className="flex justify-end mt-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                          onClick={() => handleClearAlert(alert.id)}
                        >
                          Clear Alert
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                          onClick={() => handleDeleteAlert(alert.id)}
                        >
                          Delete Alert
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No triggered alerts.</p>
              )}

              <h2 className="text-2xl font-bold mt-8 mb-4">
                Untriggered Alerts
              </h2>
              {unTriggeredAlerts.length > 0 ? (
                <ul>
                  {unTriggeredAlerts.map((alert, index) => (
                    <li key={index} className="bg-gray-100 p-4 rounded-lg mb-2">
                      <p>
                        Device:{" "}
                        <span className="font-bold">
                          {devices.find((d) => d.deviceId === alert.deviceId)
                            ?.name ?? ""}
                        </span>
                      </p>
                      <p>
                        Upper Limit:{" "}
                        <span className="font-bold">{alert.upperLimit} °C</span>
                      </p>
                      <p>
                        Lower Limit:{" "}
                        <span className="font-bold">{alert.lowerLimit} °C</span>
                      </p>
                      <div className="flex justify-end mt-2">
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                          onClick={() => handleDeleteAlert(alert.id)}
                        >
                          Delete Alert
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No untriggered alerts.</p>
              )}

              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleCreateAlert()}
                >
                  Create Alert
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isAlertSettingsVisible && (
        <AlertSettings
          onClose={handleCloseAlertSettings}
          devices={devices}
          deviceId={selectedDeviceId}
        />
      )}
    </div>
  );
};

export default AlertsModal;
