import { expect, jest, test } from "@jest/globals";

jest.unstable_mockModule("../repositories/observations-repository.js", () => ({
  PHENOPHASES: [
    "bud break",
    "leaf development",
    "flowering",
    "leaf color change",
    "leaf fall",
  ],
  isValidId: jest.fn(() => true),
  getAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn((data) => ({ _id: "fake-id", confirmed: false, ...data })),
  updateById: jest.fn(),
  removeById: jest.fn(),
  findBudBreaksForTreeInYear: jest.fn(() => []),
}));

afterEach(() => {
  findBudBreaksForTreeInYear.mockReset();
});

const { validateObservation } =
  await import("../services/observations-service.js");
const { findBudBreaksForTreeInYear } =
  await import("../repositories/observations-repository.js");

test("rejects a leaf fall observation dated before this tree's own bud break", async () => {
  findBudBreaksForTreeInYear.mockResolvedValueOnce([
    { date: new Date("2023-05-09") },
  ]);
  const result = await validateObservation({
    treeId: "ACRU-01",
    phenophase: "leaf fall",
    date: "2023-04-01",
  });
  expect(result.ok).toBe(false);
});

test("rejects future-date", async () => {
  const future = new Date();
  future.setUTCFullYear(future.getUTCFullYear() + 1);

  const result = await validateObservation({
    treeId: "ACRU-01",
    phenophase: "bud break",
    date: future.toISOString().slice(0, 10),
    percent: 0,
  });
  expect(result.ok).toBe(false);
  expect(result.error.message).toBe("cannot accept date in the future");
});

test("rejects a leaf fall observation dated before many bud breaks", async () => {
  findBudBreaksForTreeInYear.mockResolvedValueOnce([
    { date: new Date("2023-05-09") },
    { date: new Date("2023-04-15") },
    { date: new Date("2023-04-20") },
  ]);
  const result = await validateObservation({
    treeId: "ACRU-01",
    phenophase: "leaf fall",
    date: "2023-04-01",
    percent: 4.5,
  });
  expect(result.ok).toBe(false);
  expect(result.error.message).toBe(
    "leaf fall cannot be earlier than bud break in the same year",
  );
});

test("accept a leaf fall observation dated after many bud breaks", async () => {
  findBudBreaksForTreeInYear.mockResolvedValueOnce([
    { date: new Date("2023-05-09") },
    { date: new Date("2023-04-15") },
    { date: new Date("2023-04-20") },
  ]);
  const result = await validateObservation({
    treeId: "ACRU-01",
    phenophase: "leaf fall",
    date: "2023-05-10",
    percent: 4.5,
  });
  expect(result.ok).toBe(true);
});

test("accept a leaf fall observation even when no bud breaks", async () => {
  findBudBreaksForTreeInYear.mockResolvedValueOnce([]);
  const result = await validateObservation({
    treeId: "ACRU-01",
    phenophase: "leaf fall",
    date: "2023-01-01",
    percent: 4.5,
  });
  expect(result.ok).toBe(true);
});
