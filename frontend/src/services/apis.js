const BE_URL = import.meta.env.VITE_BE_URL;

export async function getMe() {
  const res = await fetch(`${BE_URL}/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    return null;
  }

  const me = await res.json();
  return me;
}

export async function fetchDevices() {
  const res = await fetch(`${BE_URL}/devices`, {
    credentials: "include",
  });

  if (!res.ok) {
    return null;
  }

  const devices = await res.json();
  return devices;
}

export async function fetchHistoricalTemperatures(
  deviceId,
  timeFrame,
  from,
  to
) {
  const res = await fetch(
    `${BE_URL}/temperatures/${deviceId}?time=${timeFrame}&from=${from.toISOString()}&to=${to.toISOString()}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    return null;
  }

  const temperatures = await res.json();
  return temperatures;
}

export async function fetchRealTimeTemperatures() {
  const res = await fetch(`${BE_URL}/temperatures/realtime`, {
    credentials: "include",
  });

  if (!res.ok) {
    return null;
  }

  const temperatures = await res.json();
  return temperatures;
}

export async function logout() {
  const res = await fetch(`${BE_URL}/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!res.ok) {
    return null;
  }
}

export async function fetchAlerts() {
  const res = await fetch(`${BE_URL}/alerts`, {
    credentials: "include",
  });

  if (!res.ok) {
    return null;
  }

  const alerts = await res.json();
  return alerts;
}

export async function createAlert(deviceId, upperLimit, lowerLimit) {
  try {
    const response = await fetch(`${BE_URL}/alerts`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deviceId, upperLimit, lowerLimit }),
    });

    if (!response.ok) {
      const errorMessage = `Error creating alert: ${response.status} - ${response.statusText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating alert:", error);
    throw error;
  }
}

export async function clearAlert(alertId) {
  const res = await fetch(`${BE_URL}/alerts/${alertId}/clear`, {
    credentials: "include",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return null;
  }
}

export async function deleteAlert(alertId) {
  const res = await fetch(`${BE_URL}/alerts/${alertId}`, {
    credentials: "include",
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return null;
  }
}

export async function createDevice(deviceName) {
  const response = await fetch(`${BE_URL}/devices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ name: deviceName }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export async function deleteDevice(deviceId) {
  const res = await fetch(`${BE_URL}/devices/${deviceId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  try {
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error parsing JSON:", err);
    return res.statusText;
  }
}
