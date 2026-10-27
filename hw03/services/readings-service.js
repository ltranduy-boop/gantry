import { Ok, Err } from "../result.js";
import { getAll, save } from "../repositories/readings-repository.js";

export const validateReading = (data) => {
  if (!data.cityId || !data.aqi) {
    return Err({
      status: 400,
      message: "cityId and a positive aqi are required",
    });
  }
  if (typeof data.cityId !== "number" || typeof data.aqi !== "number") {
    return Err({
      status: 400,
      message: "cityId and a positive aqi are required",
    });
  }
  if (data.aqi <= 0) {
    return Err({
      status: 400,
      message: "cityId and a positive aqi are required",
    });
  }
  return Ok({ status: 200, message: "Valid reading" });
};

export const classifyAqi = (aqi) => {
  if (aqi <= 50) {
    return "good";
  } else if (aqi <= 100) {
    return "moderate";
  } else if (aqi <= 150) {
    return "unhealthy for sensitive groups";
  } else if (aqi <= 200) {
    return "unhealthy";
  } else if (aqi <= 300) {
    return "very unhealthy";
  } else {
    return "hazardous";
  }
};

export const listReadings = async (req, res) => {
  const readings = await getAll();
  const classifiedReadings = readings.map((reading) => ({
    id: reading.id,
    cityId: reading.cityId,
    aqi: reading.aqi,
    category: classifyAqi(reading.aqi),
  }));
  return classifiedReadings;
};

export const createReading = async (reading) => {
  const validationResult = validateReading(reading);
  if (!validationResult.ok) {
    return Err({
      status: validationResult.error.status,
      message: validationResult.error.message,
    });
  }
  const readings = await getAll();
  const id = Math.max(...readings.map((r) => r.id), 0) + 1;
  reading.id = id;
  readings.push(reading);
  await save(readings);
  return Ok({ status: 201, message: "Reading created successfully" });
};

export const updateReading = async (id, reading) => {
  if (!id || typeof id !== "number") {
    return Err({ status: 400, message: "Invalid reading ID" });
  }
  const validationResult = validateReading(reading);
  if (!validationResult.ok) {
    return Err({
      status: validationResult.error.status,
      message: validationResult.error.message,
    });
  }
  const readings = await getAll();
  const index = readings.findIndex((r) => r.id === id);
  if (index === -1) {
    return Err({ status: 404, message: "Reading not found" });
  }
  readings[index].cityId = reading.cityId;
  readings[index].aqi = reading.aqi;
  await save(readings);
  return Ok({ status: 200, message: "Reading updated successfully" });
};

export const deleteReading = async (id) => {
  if (!id || typeof id !== "number") {
    return Err({ status: 400, message: "Invalid reading ID" });
  }
  const readings = await getAll();
  const index = readings.findIndex((r) => r.id === id);
  if (index === -1) {
    return Err({ status: 404, message: "Reading not found" });
  }
  readings.splice(index, 1);
  await save(readings);
  return Ok({ status: 200, message: "Reading deleted successfully" });
};
