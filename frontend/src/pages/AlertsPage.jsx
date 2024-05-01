import React, { useState, useEffect } from 'react';
import { fetchAlerts, clearAlert, deleteAlert } from '../services/apis';

const AlertsPage = () => {
    const [alerts, setAlerts] = useState([]);

    const handleClearAlert = async (deviceId) => {
        try {
            await clearAlert(deviceId);
            // Refetch the alerts to update the UI
            fetchAlertsData();
        } catch (error) {
            console.error('Error clearing alert:', error);
        }
    };

    const handleDeleteAlert = async (deviceId) => {
        try {
            await deleteAlert(deviceId);
            // Refetch the alerts to update the UI
            fetchAlertsData();
        } catch (error) {
            console.error('Error deleting alert:', error);
        }
    };

    const fetchAlertsData = async () => {
        try {
            const alerts = await fetchAlerts();
            setAlerts(alerts);
        } catch (error) {
            console.error('Error fetching alerts:', error);
        }
    };

    useEffect(() => {
        fetchAlertsData();
    }, []);

    return (
        <div>
            <h1>Alerts</h1>
            <table>
                <thead>
                    <tr>
                        <th>Device ID</th>
                        <th>Upper Limit</th>
                        <th>Lower Limit</th>
                        <th>Triggered At</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {alerts.map((alert, index) => (
                        <tr key={index}>
                            <td>{alert.deviceId}</td>
                            <td>{alert.upperLimit}</td>
                            <td>{alert.lowerLimit}</td>
                            <td>{alert.triggered_at || 'Not triggered'}</td>
                            <td>
                                {alert.triggered_at ? (
                                    <span className="text-red-500">Triggered</span>
                                ) : (
                                    <span className="text-green-500">Not Triggered</span>
                                )}
                            </td>
                            <td>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                    onClick={() => handleClearAlert(alert.deviceId)}
                                >
                                    Clear Alert
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                                    onClick={() => handleDeleteAlert(alert.deviceId)}
                                >
                                    Delete Alert
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AlertsPage;
