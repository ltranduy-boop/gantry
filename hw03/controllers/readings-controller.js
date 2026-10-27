import * as services from "../services/readings-service.js";

export const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

export const showReadings = async (req, res) => {
  const readings = await services.listReadings();
  if (!req.query.cityId) {
    res.status(200).json(readings);
  } else {
    const cityId = parseInt(req.query.cityId);
    const filteredReadings = readings.filter(
      (reading) => reading.cityId === cityId,
    );
    res.status(200).json(filteredReadings);
  }
};

export const addReading = async (req, res) => {
  const result = await services.createReading(req.body);
  if (result.ok) {
    const readings = await services.listReadings();
    res.status(201).json(readings[readings.length - 1]);
  } else {
    res.status(result.error.status).json({ error: result.error.message });
  }
};

export const updateReading = async (req, res) => {
  const result = await services.updateReading(
    Number.parseInt(req.params.id),
    req.body,
  );
  if (result.ok) {
    const readings = await services.listReadings();
    const updatedReading = readings.find(
      (reading) => reading.id === Number.parseInt(req.params.id),
    );
    res.status(200).json(updatedReading);
  } else {
    res.status(result.error.status).json({ error: result.error.message });
  }
};

export const deleteReading = async (req, res) => {
  const result = await services.deleteReading(Number.parseInt(req.params.id));
  if (result.ok) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: "Reading not found" });
  }
};
