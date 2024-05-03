const { getAllDevices } = require("../src/repositories/device.repository");
const {
  addTemperatures,
} = require("../src/repositories/temperature.repository");
const { subMinutes } = require("date-fns");

(async () => {
  console.log("MAKE SURE TO WAIT FOR THE SCRIPT TO FINISH");

  const devices = await getAllDevices();

  for (const device of devices) {
    console.log(
      "Filling random temperatures for device",
      device.deviceId,
      device.name
    );
    const values = [];
    let lastTemp = 10;
    for (let i = 0; i < 10000; i++) {
      const temp = Math.min(
        Math.max(lastTemp + (Math.random() - 0.5) * 1, -30),
        50
      );
      lastTemp = temp;
      values.push({
        temperature: temp,
        time: subMinutes(new Date(), i).toISOString(),
      });
    }

    // require("fs").writeFileSync(
    //   `temperatures-${device.deviceId}.json`,
    //   JSON.stringify(values))

    addTemperatures(values, device.deviceId);
  }
})();
