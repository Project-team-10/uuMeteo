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
