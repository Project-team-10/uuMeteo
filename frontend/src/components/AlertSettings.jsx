import React, { useState, useContext } from 'react';
import { createAlert } from '../services/apis';

const AlertSettings = ({ onClose, devices, onAlertCreated }) => {
    const [upperLimit, setUpperLimit] = useState(0);
    const [lowerLimit, setLowerLimit] = useState(0);
    const [alertName, setAlertName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedDevice, setSelectedDevice] = useState(null);

    const handleSaveAlert = async () => {
        if (!selectedDevice || typeof selectedDevice !== 'string') {
            console.error('Device ID is required to create an alert and must be a string.');
            setErrorMessage('Device ID is required to create an alert and must be a string.');
            return;
        }

        try {
            await createAlert(selectedDevice, upperLimit, lowerLimit);
            onClose();
            onAlertCreated(); // Call the onAlertCreated prop
            // Display a success message or update the UI
        } catch (error) {
            console.error('Error creating alert:', error);
            setErrorMessage(error.message);
        }
    };

    const handleCloseModal = () => {
        onClose();
    };

    const handleDeviceSelect = (event) => {
        const selectedDeviceId = event.target.value;
        setSelectedDevice(selectedDeviceId);
    };

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Alert Settings</h3>
                            {errorMessage && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    <strong className="font-bold">Error:</strong> {errorMessage}
                                </div>
                            )}
                            {devices && devices.length > 0 ? (
                                <div className="mt-4">
                                    <label htmlFor="device-select" className="block text-gray-700 font-bold mb-2">
                                        Select Device
                                    </label>
                                    <select
                                        id="device-select"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={selectedDevice || ''}
                                        onChange={handleDeviceSelect}
                                    >
                                        <option value="">Select a device</option>
                                        {devices.map((device) => (
                                            <option key={device.deviceId} value={device.deviceId}>
                                                {device.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <p className="text-gray-500 mt-4">No devices found.</p>
                            )}
                            <div className="mt-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="temperature-below">
                                            Temperature Below
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="temperature-below"
                                            type="number"
                                            value={lowerLimit}
                                            onChange={(e) => setLowerLimit(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="temperature-above">
                                            Temperature Above
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="temperature-above"
                                            type="number"
                                            value={upperLimit}
                                            onChange={(e) => setUpperLimit(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={handleSaveAlert}
                                    >
                                        Save Alert
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={handleCloseModal}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertSettings;
