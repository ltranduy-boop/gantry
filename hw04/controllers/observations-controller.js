import * as Service from "../services/observations-service.js";

export const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

export const Read = async (req, res) => {
  const result = await Service.getObservation();
  if (!req.query.treeId) {
    return res.status(200).json(result);
  }
  const result2 = result.find(
    (observation) => observation.treeId === req.query.treeId,
  );
  res.status(200).json(result2);
};

export const Create = async (req, res) => {
  const result = await Service.addObservation(req.body);
  if (!result.ok) {
    return res
      .status(result.error.status)
      .json({ error: result.error.message });
  }
  res.status(201).json(result.value);
};

export const Update = async (req, res) => {
  const result = await Service.updateObservation(req.params.id, req.body);
  if (!result.ok) {
    return res
      .status(result.error.status)
      .json({ error: result.error.message });
  }
  res.status(200).json(result.value);
};

export const Delete = async (req, res) => {
  const result = await Service.deleteObservation(req.params.id);
  if (!result.ok) {
    return res
      .status(result.error.status)
      .json({ error: result.error.message });
  }
  res.status(204).send();
};
