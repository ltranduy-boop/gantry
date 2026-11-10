import { toObservationDto } from "../dtos/observation-dto.js";
import { Ok, Err } from "../result.js";
import * as repo from "../repositories/observations-repository.js";

export const validateObservation = async (data) => {
  if (!data) {
    return Err({ status: 400, message: "data does not exists" });
  }
  if (
    !data.treeId ||
    !data.date ||
    !data.phenophase
  ) {
    return Err({ status: 400, message: "Lacked of required field" });
  }
  const cond = repo.PHENOPHASES.some(
    (phenophase) => phenophase === data.phenophase,
  );
  if (!cond) {
    return Err({
      status: 400,
      message: "phenophase field is wrong",
    });
  }
  const date = new Date(data.date);
  if (date > new Date()) {
    return Err({ status: 400, message: "cannot accept date in the future" });
  }
  if (data.phenophase === "leaf fall") {
    const budBreaks = await repo.findBudBreaksForTreeInYear(
      data.treeId,
      date.getUTCFullYear(),
    );

    if (budBreaks.length > 0 && date < budBreaks[0].date) {
      return Err({
        status: 400,
        message: "leaf fall cannot be earlier than bud break in the same year",
      });
    }
  }
  return Ok();
};

export const listObservation = async () =>
  (await repo.getAll()).map(toObservationDto);

export const createObservation = async (data) => {
  const cond = await validateObservation(data);
  if (!cond.ok) {
    return cond;
  }
  const result = await repo.create(data);
  return Ok(toObservationDto(result));
};

export const updateObservation = async (id, data) => {
  const cond1 = repo.isValidId(id);
  if (!cond1) {
    return Err({ status: 400, message: "Wierd id" });
  }
  const cond2 = await validateObservation(data);
  if (!cond2.ok) {
    return cond2.error;
  }
  const result = await repo.updateById(id, data);
  if (!result) {
    return Err({
      status: 404,
      message:
        "id does not match with any object in MongoDB or data has a problem",
    });
  }
  return Ok(toObservationDto(result));
};

export const deleteObservation = async (id) => {
  const cond = repo.isValidId(id);
  if (!cond) {
    return Err({ status: 400, message: "Wierd id" });
  }
  await repo.removeById(id);
  return Ok();
};

export const confirmObservation = async (id) => {
  const cond = repo.isValidId(id);
  if (!cond) {
    return Err({ status: 400, message: "Wierd id" });
  }

  const result = await repo.updateById(
    id,
    { confirmed: true },
    { returnDocument: "after" },
  );
  if (!result) {
    return Err({
      status: 404,
      message:
        "id does not match with any object in MongoDB or data has a problem",
    });
  }
  return Ok(result);
};
