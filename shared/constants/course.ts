export enum CourseStatusText {
  "finished",
  "processing",
  "pending",
}

export enum CourseStatusBadge {
  "warning",
  "success",
  "default",
}

export enum CourseStatusColor {
  "default",
  "green",
  "orange",
}

export const DurationUnitType: { id: number; name: string }[] = [
  { id: 1, name: "year" },
  { id: 2, name: "month" },
  { id: 3, name: "day" },
  { id: 4, name: "week" },
  { id: 5, name: "hour" },
];

export const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
