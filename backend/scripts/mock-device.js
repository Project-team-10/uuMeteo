const { subMinutes } = require("date-fns");

async function main() {
  const host = process.argv[2];
  const deviceSecretKey = process.argv[3];
  const minutesToPast = parseInt(process.argv[4]);

  if (!host || !deviceSecretKey || !minutesToPast) {
    console.log(
      "Usage: node mock-device.js <host> <deviceSecretKey> <minutesToPast>"
    );
    process.exit(1);
  }

  await fetch(host + "/temperatures", {
    method: "DELETE",
    body: {
      secretKey: deviceSecretKey,
    },
  });

  console.log("Deleted temperatures for device");

  const now = new Date();
  const values = [];
  let lastTemp = 10;
  for (let i = minutesToPast; i >= 0; i--) {
    lastTemp = generateNextTemperature(lastTemp);
    values.push({
      temperature: lastTemp,
      time: subMinutes(now, i).toISOString(),
    });
  }

  await postValues(host, values, deviceSecretKey);

  console.log("Added historical temperatures for device");

  setInterval(async () => {
    lastTemp = generateNextTemperature(lastTemp);
    const value = {
      temperature: lastTemp,
      time: new Date().toISOString(),
    };

    await postValues(host, [value], deviceSecretKey);

    console.log("Added current temperature for device");
  }, 60 * 1000);
}

function generateNextTemperature(lastTemp) {
  return Math.min(Math.max(lastTemp + (Math.random() - 0.5) * 1, -30), 50);
}

async function postValues(host, values, secretKey) {
  await fetch(host + "/temperatures", {
    method: "POST",
    body: JSON.stringify({
      secretKey: secretKey,
      values: values,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

main();
