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

export async function fetchTemperatures(deviceId, timeFrame) {
  const res = await fetch(
    `${BE_URL}/temperatures/${deviceId}?time=${timeFrame}`,
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
  const res = await fetch(`${BE_URL}/alerts`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deviceId, upperLimit, lowerLimit }),
  });

  if (!res.ok) {
    throw new Error(`Error creating alert: ${res.status} - ${res.statusText}`);
  }

  return await res.json();
}

export async function clearAlert(deviceId) {
  const res = await fetch(`${BE_URL}/alerts/clear`, {
    credentials: "include",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deviceId }),
  });

  if (!res.ok) {
    return null;
  }
}

export async function deleteAlert(deviceId) {
  const res = await fetch(`${BE_URL}/alerts`, {
    credentials: "include",
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deviceId }),
  });

  if (!res.ok) {
    return null;
  }
}
