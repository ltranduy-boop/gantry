export const toObservationDto = (observation) => ({
  id: observation._id.toString(),
  treeId: observation.treeId,
  phenophase: observation.phenophase,
  date: observation.date,
  percent: observation.percent,
  confirmed: observation.confirmed,
});
