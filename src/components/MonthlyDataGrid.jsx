import React, { useState, useRef, useEffect } from "react";
import {
  
  Modal,
  message,
  
  Select,
  Button,
  
  Card,
  Space,
  Tag,
} from "antd";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Group,
  Star,
} from "react-konva";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isoWeek from "dayjs/plugin/isoWeek";
import "./MonthlyDataGrid.css";
import PlannerSetup from "./PlannerSetup";
import PlannerToolbar from "./PlannerToolbar";
import TestQueue from "./TestQueue";
import TransformerModal from "./TransformerModal";
dayjs.extend(isSameOrBefore);
dayjs.extend(isoWeek);
const regions = [
  { name: "EHV", subItems: ["Impulse", "LMS", "Others"] },
  { name: "NORTH", subItems: ["Impulse", "LMS", "Others"] },
  { name: "SOUTH", subItems: ["Impulse", "LMS", "Others"] },
  ];
const shifts = [3, 1, 2];
const TRANSFORMERS = [
  "WT07226",
  "WT07347",
  "WT07348",
  "WT07380",
  "WT07224",
  "WT07015",
  "WT07365",
  "WT06900",
  "WT06782",
  "WT06471",
  "WT07318",
  "WT06599",
  "WT07369",
  "WT07329",
  "WT05187"
  ];
const TRANSFORMER_COLORS = {

  WT07226: "#ff7875",

  WT07347: "#ffd666",

  WT07348: "#95de64",

  WT07380: "#69c0ff",

  WT07224: "#b37feb",

  WT07015: "#ff9c6e",

  WT07365: "#5cdbd3",

  WT06900: "#597ef7",

  WT06782: "#73d13d",

  WT06471: "#36cfc9",

  WT07318: "#ffc069",

  WT06599: "#9254de",

  WT07369: "#13c2c2",

  WT07329: "#fa8c16",

  WT05187: "#f759ab",
};
const GROUP_COLORS = [
  "#E53935",
  "#3949AB",
  "#00897B",
  "#8E24AA",
  "#6D4C41",
  "#F4511E",
  "#546E7A",
  "#C2185B",
  "#2E7D32",
  "#1565C0",
  ];

const SHIFT_ORDER = [3, 1, 2];
const nextShiftAndDate = (shift, date) => {
  const idx = SHIFT_ORDER.indexOf(shift);
  if (idx === -1 || idx === SHIFT_ORDER.length - 1) {
    return { shift: SHIFT_ORDER[0], date: date.add(1, "day") };
  }
return { shift: SHIFT_ORDER[idx + 1], date };
// next shift within the same day.
};
const ALL_ROWS = [];
regions.forEach(region => {

    region.subItems.forEach(subItem => {
        ALL_ROWS.push({
            region: region.name,
            subItem,
          });

    });

});
const ROWS_PER_WEEK = ALL_ROWS.length; 
const getRowIndex = ( region,subItem) =>
ALL_ROWS.findIndex(
  r =>
  r.region === region && r.subItem === subItem );
function MonthlyDataGrid() {

  const [selectedMonth, setSelectedMonth] = useState(null);

  const [showPlannerPage, setShowPlannerPage] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedWeekRange, setSelectedWeekRange] = useState(null);

  const [draggingQueueEvent, setDraggingQueueEvent] = useState(null);

  const [eventList, setEventList] = useState([]);
  const stageRef = useRef(null);

  const dragInfoRef = useRef(null);

  const [pendingEvents, setPendingEvents] = useState([]);

  const [expandedTransformers, setExpandedTransformers] = useState({});

  const [isSelectingWeekRange, setIsSelectingWeekRange] = useState(false);

  const [selectedTransformers, setSelectedTransformer] = useState([])
  const [selectedVersion, setSelectedVersion] =
  useState(undefined);

  const [plannerTransformers, setPlannerTransformers] =
  useState([]);
  const [availablePlannerTransformers, setAvailablePlannerTransformers] =
  useState([]);

  const [selectedPlannerTransformer, setSelectedPlannerTransformer] =
  useState([]);
  const [addTransformerModalOpen, setAddTransformerModalOpen] =
  useState(false);
  const [modalTransformers, setModalTransformers] = useState([]);

  const [transformerCustomerMap, setTransformerCustomerMap] = useState({});

  const [daysArray, setDaysArray] = useState(() => {
      const base = dayjs("2026-04-01");
      return Array.from({ length: 28 }, (_, i) =>
        base.date(i + 1)
      );
  });

const getWeeks = (days) => {
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
return weeks;
};
const handleMonthChange = (value) => {
  if (!value) return;

  setSelectedMonth(value);

  const monthStart = value.startOf("month");

  const startOfFirstWeek =
  monthStart.startOf("isoWeek");

  // Default = 4 weeks = 28 days
  const defaultTotalWeeks = 4;

  const endOfDefaultWeek =
  startOfFirstWeek
  .add(defaultTotalWeeks - 1, "week")
  .startOf("isoWeek");

  setSelectedWeekRange([
      startOfFirstWeek,
      endOfDefaultWeek,
      ]);

  const newDays = Array.from(
    { length: defaultTotalWeeks * 7 },
    (_, i) =>
    startOfFirstWeek.add(i, "day")
  );

setSelectedDate(startOfFirstWeek);

setDaysArray(newDays);
};

const handleSetupSave = () => {

  if (!selectedMonth) {
    message.error("Please select month");
    return;
  }

if (
  !selectedWeekRange ||
  selectedWeekRange.length !== 2
) {
message.error("Please select week range");
return;
}

if (!selectedTransformers.length) {
  message.error("Please select transformer");
  return;
}

if (!selectedVersion) {
  message.error("Please create a version");
  return;
}

const startWeek =
selectedWeekRange[0].startOf("isoWeek");

const endWeek =
selectedWeekRange[1].endOf("isoWeek");

// Calculate number of complete Monday -> Sunday weeks
const totalWeeks =
endWeek.diff(
  startWeek,
  "week"
) + 1;

// 4 weeks = 28 days
// 5 weeks = 35 days
const totalDays =
totalWeeks * 7;
if (
  totalWeeks !== 4 &&
  totalWeeks !== 5
) {
message.error(
  "Please select exactly 4 or 5 weeks"
);
return;
}

const plannerDays =
Array.from(
  { length: totalDays },
  (_, i) =>
  startWeek.add(i, "day")
);

setDaysArray(plannerDays);

setPlannerTransformers(selectedTransformers);

setAvailablePlannerTransformers([]);

setShowPlannerPage(true);
}

const weeks = getWeeks(daysArray);

const getTransformerType = async (transformerId) => {

  try {

    const response = await fetch(
      `http://3.7.251.192/api/get/dashboard/transformer/type?transformerId=${transformerId}`
    );

  const data = await response.json();

  return data.result || "";

} catch (error) {

console.error("Transformer Type API Error", error);

return "";

}

};
const loadAllTransformerTests = async (transformerIds) => {

  try {
    console.time("Load Tests");
    const responses = await Promise.all(

      transformerIds.map(async (transformerId) => {

          const [response, transformerType] = await Promise.all([

              fetch(
                "http://3.7.251.192/api/get/dashboard/block/hours/data",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                  },
                body: JSON.stringify([transformerId]),
              }
          ),

        getTransformerType(transformerId),

        ]);

    const data = await response.json();

    const apiItem = data.result?.[0];

    if (!apiItem) return [];

    return Object.entries(apiItem.hours)
    .filter(([_, hrs]) => hrs > 0)
    .map(([test, hrs]) => ({
          id: `${transformerId}-${test}`,
          transformer: transformerId,
          label: test,
          test,
          durationHours: hrs,
          transformerType: transformerType,
          color: TRANSFORMER_COLORS[transformerId],
          customerName: apiItem.customerName,
        }));

})

);
console.timeEnd("Load Tests");
setPendingEvents(responses.flat());

} catch (err) {

console.error("API Error:", err);

}

};
const loadAllTransformerCustomers = async () => {

  try {

    const responses = await Promise.all(

      TRANSFORMERS.map(async (transformerId) => {

          try {

            const response = await fetch(
              "http://3.7.251.192/api/get/dashboard/block/hours/data",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "*/*",
                },
              body: JSON.stringify([transformerId]),
            }
        );

      const data = await response.json();

      const apiItem =
      data.result?.[0];

      return {
        transformerId,
        customerName:
        apiItem?.customerName || "-",
      };

  } catch (error) {

  console.error(
    `Customer API Error - ${transformerId}`,
    error
  );

return {
  transformerId,
  customerName: "-",
};

}

})

);

const customerMap = {};

responses.forEach((item) => {

    customerMap[item.transformerId] =
    item.customerName;

  });

setTransformerCustomerMap(
  customerMap
);

} catch (error) {

console.error(
  "Load Transformer Customers Error:",
  error
);

}

};
useEffect(() => {

    loadAllTransformerCustomers();

  }, []);
const toggleTransformer = (transformer) => {

  setExpandedTransformers(prev => ({

        ...prev,

        [transformer]: !prev[transformer],

      }));

};
const [witnessActive, setWitnessActive] = useState(false);
const [witnessTests, setWitnessTests] = useState(new Set());
const [witnessSideMap, setWitnessSideMap] = useState({});

const [retestActive, setRetestActive] = useState(false);
const [retestTests, setRetestTests] = useState(new Set());
const [retestSideMap, setRetestSideMap] = useState({});

const handleToggleWitness = () => {

  if (!witnessActive && deleteActive) {
    message.error("Cannot enable Witness while another mode is active");
    return;
  }

if (!witnessActive) {
  setRetestActive(false);
}

setWitnessActive(prev => !prev);

};
const handleToggleRetest = () => {

  if (!retestActive && deleteActive) {
    message.error("Cannot enable Retest while another mode is active");
    return;
  }

if (!retestActive) {
  setWitnessActive(false);
}

setRetestActive(prev => !prev);
};
const handleGroupTest = () => {

  if (selectedEvents.size < 2) {

    message.error(
      "Select at least two events."
    );

  return;
}

setEventList(prev =>
  prev.map(ev => {

      if (
        selectedEvents.has(ev.id)
      ) {

      return {
        ...ev,
        groupId:
        nextGroupId,
      };
  }

return ev;

})
);

setNextGroupId(
  prev => prev + 1
);

setSelectedEvents(
  new Set()
);

message.success(
  "Group created."
);
};
const handleUngroup = () => {

  if (selectedEvents.size === 0) {

    message.error(
      "Select at least one grouped event."
    );

  return;
}

setEventList(prev => {

    let updated = [...prev];

    const affectedGroups =
    [
      ...new Set(
        updated
        .filter(
          ev =>
          selectedEvents.has(ev.id) &&
          ev.groupId !== null
        )
      .map(
        ev => ev.groupId
      )
  )
];

updated =
updated.map(ev => {

    if (
      selectedEvents.has(ev.id)
    ) {

    return {
      ...ev,
      groupId: null,
    };
}

return ev;
});


affectedGroups.forEach(groupId => {

    const remaining =
    updated.filter(
      ev =>
      ev.groupId === groupId
    );

  if (
    remaining.length === 1
  ) {

  updated =
  updated.map(ev =>
    ev.groupId === groupId
    ? {
      ...ev,
      groupId: null,
    }
  : ev
);
}

});

return updated;

});

setSelectedEvents(
  new Set()
);

message.success(
  "Selected events removed from group."
);
};

const handleToggleStar = (eventId, side = "left") => {
  if (!witnessActive) return;

  setWitnessTests((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(eventId)) {
        newSet.delete(eventId);

        setWitnessSideMap((m) => {
            const copy = { ...m };
            delete copy[eventId];
            return copy;
          });

    } else {
    newSet.add(eventId);

    setWitnessSideMap((m) => ({
          ...m,
          [eventId]: side,
        }));
}

return newSet;
});

};
const handleToggleRetestStar = (eventId, side = "left") => {

  if (!retestActive) return;

  setRetestTests(prev => {

      const newSet = new Set(prev);

      if (newSet.has(eventId)) {

        newSet.delete(eventId);

        setRetestSideMap(m => {

            const copy = { ...m };

            delete copy[eventId];

            return copy;

          });

    } else {

    newSet.add(eventId);

    setRetestSideMap(m => ({
          ...m,
          [eventId]: side,
        }));

}

return newSet;

});

};

const [draggingEvent, setDraggingEvent] = useState(null);
const [dragMoved, setDragMoved] = useState(false);

// const [isDragging, setIsDragging] = useState(false);

const [showRightContainer, setShowRightContainer] = useState(true);

const [selectedCells, setSelectedCells] = useState({});
const [blockSelectedCells, setBlockSelectedCells] = useState({});

const [blockSelectionActive, setBlockSelectionActive] = useState(false);

const [isSelectingBlocks, setIsSelectingBlocks] = useState(false);

const handleBlockCellSelect = (cellKey) => {

  setBlockSelectedCells({
      [cellKey]: true,
    });

setBlockSelectionActive(true);
};

const [selectedEvents, setSelectedEvents] = useState(new Set());
const [nextGroupId, setNextGroupId] = useState(1);
const [splitPercentage, setSplitPercentage] = useState(null);
const [groupDragStart, setGroupDragStart] = useState(null);
const [groupDragOffset, setGroupDragOffset] = useState({dx: 0, dy: 0,});

const handleQueueDrop = (
  x,
  y,
  queueEvent
) => {

if (
  x < (2 * cellWidth) ||
  y < headerHeight
) {
return;
}

const adjustedX =
x - (2 * cellWidth);

const adjustedY =
y - headerHeight;

const fullWeekHeight =
singleWeekHeight + 20;

const droppedWeekIndex =
Math.floor(
  y / fullWeekHeight
);

const yInsideWeek =
y -
(droppedWeekIndex * fullWeekHeight);

if (
  yInsideWeek < headerHeight
) {
return;
}

const regionIndex =
Math.floor(
  (yInsideWeek - headerHeight) /
  (cellHeight * 3)
);
if (
  regionIndex < 0 ||
  regionIndex >= regions.length
) {
return;
}

const safeRegionIndex =
Math.min(
  Math.max(regionIndex, 0),
  regions.length - 1
);

const oneDayWidth =
3 * cellWidth;

const localDayIndex =
Math.floor(
  adjustedX /
  oneDayWidth
);

if (
  localDayIndex < 0 ||
  localDayIndex > 6
) {
return;
}

const safeDayIndex =
droppedWeekIndex * 7 +
localDayIndex;

const clampedDayIndex =
Math.min(
  Math.max(
    safeDayIndex,
    0
  ),
daysArray.length - 1
);

const dropDate =
daysArray[
  clampedDayIndex
  ];

const rawOffset =
adjustedX % oneDayWidth;

const snappedShift =
Math.round(
  rawOffset / cellWidth
);

const offsetInsideDay =
Math.min(
  snappedShift * cellWidth,
  2 * cellWidth
);

const localRowY =
(yInsideWeek - headerHeight) %
(cellHeight * 3);

const snappedRow =
Math.round(
  localRowY /
  cellHeight
);

const subIndex =
Math.min(
  Math.max(
    snappedRow,
    0
  ),
2
);

const regionName =
regions[
  safeRegionIndex
  ].name;

const subItemName =
regions[
  safeRegionIndex
  ].subItems[subIndex];
const totalShiftCells =
Math.ceil(
  (
    queueEvent.durationHours / 8
  ) +
(
  offsetInsideDay % cellWidth
) / cellWidth
);

let blockedFound = false;

let checkDate = dropDate;

const startShiftIndex =
Math.floor(
  offsetInsideDay / cellWidth
);

let checkShift =
SHIFT_ORDER[startShiftIndex];

for (let i = 0; i < totalShiftCells; i++) {

  const currentShiftIndex =
  SHIFT_ORDER.indexOf(
    checkShift
  );

const blockedCellKey =
`${checkDate.format("YYYY-MM-DD")}-${regionName}-${subItemName}-${currentShiftIndex}`;

if (
  selectedCells[
    blockedCellKey
    ]
) {
blockedFound = true;
break;
}

const next =
nextShiftAndDate(
  checkShift,
  checkDate
);

checkShift =
next.shift;

checkDate =
next.date;
}
if (blockedFound) {

  message.error(
    "Selected slot is blocked."
  );

return;
}
const newStart =
offsetInsideDay;

const newEnd =
offsetInsideDay +
Math.ceil(
  queueEvent.durationHours / 8
) * cellWidth

const isOverlapping =
eventList.some((ev) => {

    const sameRow =
    ev.region === regionName &&
    ev.subItem === subItemName &&
    ev.startDate.isSame(
      dropDate,
      "day"
    );

  if (!sameRow) {
    return false;
  }

const evStart =
ev.startOffset;

const evEnd =
ev.startOffset +
(ev.durationHours / 8) *
cellWidth;

return (
  newStart <= evEnd &&
  newEnd >= evStart
);
});

if (isOverlapping) {

  message.error(
    "Slot already occupied"
  );

return;
}

const newEvent = {
  ...queueEvent,

  id: Date.now(),

  startDate: dropDate,

  startOffset:
  offsetInsideDay,

  region: regionName,

  subItem: subItemName,
  groupId: null,
};

setEventList(prev => [
    ...prev,
    newEvent,
    ]);
};

const handleDropPixel = (
  x,
  y,
  node
) => {

if (!draggingEvent) {
  dragInfoRef.current = null;
  return;
}

const adjustedX = x - (2 * cellWidth);
const adjustedY = y - headerHeight;

let safeX = Math.max(0, adjustedX);
let safeY = Math.max(0, adjustedY);
const dayIndex = Math.floor(safeX / (cellWidth * 3));
const fullWeekHeight =
singleWeekHeight + 20;

const droppedWeekIndex =
Math.floor(safeY / fullWeekHeight);

const yInsideWeek =
safeY % fullWeekHeight;

const regionIndex = Math.floor(
  yInsideWeek / (cellHeight * 3)
);

const safeRegionIndex = Math.min(
  Math.max(regionIndex, 0),
  regions.length - 1
);

const oneDayWidth = 3 * cellWidth;

const localDayIndex =
Math.floor(adjustedX / oneDayWidth);

const safeDayIndex =
(droppedWeekIndex * 7) +
localDayIndex;

const offsetInsideDay =
adjustedX % oneDayWidth;

const localRowY =
yInsideWeek % (cellHeight * 3);

const snappedRow =
Math.round(localRowY / cellHeight);

const subIndex = Math.min(
  Math.max(snappedRow, 0),
  2
);

const clampedDayIndex =
Math.min(
  Math.max(safeDayIndex, 0),
  daysArray.length - 1
);

const dropDate =
daysArray[clampedDayIndex];
const regionName = regions[safeRegionIndex].name;
const subItemName =
regions[safeRegionIndex].subItems[subIndex];
//   const shiftIndex =
// Math.round(offsetInsideDay / cellWidth);
const shiftIndex = Math.min(
  Math.floor(offsetInsideDay / cellWidth),
  2
);

const totalShiftCells =
Math.ceil(
  (
    draggingEvent.durationHours / 8
  ) +
(
  offsetInsideDay % cellWidth
) / cellWidth
);

let blockedFound = false;

let checkDate = dropDate;
const startShiftIndex =
Math.floor(
  offsetInsideDay / cellWidth
);
let checkShift =
SHIFT_ORDER[startShiftIndex];

for (let i = 0; i < totalShiftCells; i++) {

  const currentShiftIndex =
  SHIFT_ORDER.indexOf(checkShift);

  const blockedCellKey =
  `${checkDate.format("YYYY-MM-DD")}-${regionName}-${subItemName}-${currentShiftIndex}`;

  if (selectedCells[blockedCellKey]) {
    blockedFound = true;
    break;
  }

const next =
nextShiftAndDate(
  checkShift,
  checkDate
);

checkShift = next.shift;
checkDate = next.date;
}

if (blockedFound) {

  message.error(
    "Selected slot is blocked."
  );

const dragInfo =
dragInfoRef.current;

if (dragInfo) {

  node.absolutePosition({

      x:
      dragInfo.startX,

      y:
      dragInfo.startY,

    });

}

node.getLayer()?.batchDraw();

setDraggingEvent(null);

dragInfoRef.current = null;

return;
}
const getOccupiedCells = (
  startDate,
  startOffset,
  durationHours
) => {

const cells = [];

let currentDate = startDate;

let currentShift =
SHIFT_ORDER[
  Math.floor(startOffset / cellWidth)
  ];

let remaining =
durationHours;

while (remaining > 0) {

  cells.push({
      date: currentDate.format("YYYY-MM-DD"),
      shift: currentShift,
    });

remaining -= 8;

if (remaining > 0) {

  const next =
  nextShiftAndDate(
    currentShift,
    currentDate
  );

currentShift =
next.shift;

currentDate =
next.date;
}
}

return cells;
};

const draggedCells =
getOccupiedCells(
  dropDate,
  offsetInsideDay,
  draggingEvent.durationHours
);

const isOverlapping =
eventList.some((ev) => {

    if (ev.id === draggingEvent.id) {
      return false;
    }

  if (
    ev.region !== regionName ||
    ev.subItem !== subItemName
  ) {
  return false;
}

const occupiedCells =
getOccupiedCells(
  ev.startDate,
  ev.startOffset,
  ev.durationHours
);

return draggedCells.some(
  (dragCell) =>
  occupiedCells.some(
    (cell) =>
    cell.date === dragCell.date &&
    cell.shift === dragCell.shift
  )
);
});

if (isOverlapping) {

  message.error("Slot already occupied");

  const savedDayIndex =
  daysArray.findIndex((d) =>
    d.isSame(
      draggingEvent.startDate,
      "day"
    )
);

const savedWeekIndex =
Math.floor(
  savedDayIndex / 7
);

const localDayIndex =
savedDayIndex % 7;

const savedX =
(2 + localDayIndex * 3) *
cellWidth +
draggingEvent.startOffset;

let rowIndex = 0;

for (const r of regions) {

  for (const s of r.subItems) {

    if (
      r.name === draggingEvent.region &&
      s === draggingEvent.subItem
    ) {
    break;
  }

rowIndex++;
}

if (
  r.name === draggingEvent.region
) {
break;
}
}

const savedY =
(
  savedWeekIndex *
  (singleWeekHeight + 20)
) +
headerHeight +
(
  rowIndex *
  cellHeight
);

node.absolutePosition({
    x: savedX,
    y: savedY,
  });

node.getLayer()?.batchDraw();

setDraggingEvent(null);

return;
}
// SOUND TEST LMS RESTRICTION
if (
  draggingEvent.test === "Sound Test" &&
  draggingEvent.subItem === "LMS" &&
  subItemName !== "LMS"
) {

setDraggingEvent(null);

return;
}

setEventList((prev) => {

    // Normal event
    if (!draggingEvent.groupId) {

      return prev.map((ev) =>
        ev.id === draggingEvent.id
        ? {
          ...ev,
          startDate: dropDate,
          startOffset: offsetInsideDay,
          region: regionName,
          subItem: subItemName,
        }
      : ev
    );

}
// -------------------------
// GROUP DRAG
// -------------------------

const draggedDayIndex =
daysArray.findIndex(d =>
  d.isSame(draggingEvent.startDate, "day")
);

const droppedDayIndex =
daysArray.findIndex(d =>
  d.isSame(dropDate, "day")
);

const dayDifference =
droppedDayIndex - draggedDayIndex;

const shiftDiff =
offsetInsideDay -
draggingEvent.startOffset;

const draggedWeek =
Math.floor(draggedDayIndex / 7);

const droppedWeek =
Math.floor(droppedDayIndex / 7);

const draggedRow =
getRowIndex(
  draggingEvent.region,
  draggingEvent.subItem
);

const droppedRow =
getRowIndex(
  regionName,
  subItemName
);

const newEventList = prev.map(ev => {

    if (ev.groupId !== draggingEvent.groupId) {
      return ev;
    }

  // ROW OFFSET
  const eventWeek =
  Math.floor(
    daysArray.findIndex(d =>
      d.isSame(ev.startDate, "day")
    ) / 7
);

const eventRow =
getRowIndex(
  ev.region,
  ev.subItem
);

const rowOffset =
eventRow - draggedRow;

const weekOffset =
eventWeek - draggedWeek;

let finalWeek =
droppedWeek + weekOffset;

let finalRow =
droppedRow + rowOffset;

while (finalRow < 0) {
  finalRow += ROWS_PER_WEEK;
  finalWeek--;
}

while (finalRow >= ROWS_PER_WEEK) {
  finalRow -= ROWS_PER_WEEK;
  finalWeek++;
}

finalWeek = Math.max(
  0,
  Math.min(
    weeks.length - 1,
    finalWeek
  )
);

//---------------------------------------
// HORIZONTAL MOVE
//---------------------------------------

const eventDay =
daysArray.findIndex(d =>
  d.isSame(ev.startDate, "day")
);

let finalDay =
eventDay + dayDifference;

let finalOffset =
ev.startOffset + shiftDiff;

while (finalOffset < 0) {
  finalOffset += 3 * cellWidth;
  finalDay--;
}

while (finalOffset >= 3 * cellWidth) {
  finalOffset -= 3 * cellWidth;
  finalDay++;
}

finalDay = Math.max(
  0,
  Math.min(
    daysArray.length - 1,
    finalDay
  )
);

//---------------------------------------
// WEEK CORRECTION
//---------------------------------------

const dayInsideWeek =
finalDay % 7;

finalDay =
(finalWeek * 7) +
dayInsideWeek;

finalDay = Math.max(
  0,
  Math.min(
    daysArray.length - 1,
    finalDay
  )
);

const target =
ALL_ROWS[finalRow];

const updatedEvent = {

  ...ev,

  startDate: daysArray[finalDay],

  startOffset: finalOffset,

  region: target.region,

  subItem: target.subItem,

};

return updatedEvent;

});

const finalGroupEvents =
newEventList.filter(
  ev =>
  ev.groupId ===
  draggingEvent.groupId
);
//--------------------------------------------------
// GROUP BLOCKED CELL VALIDATION
//--------------------------------------------------

const hasBlockedCell =
finalGroupEvents.some(groupEvent => {

    const occupiedCells =
    getOccupiedCells(
      groupEvent.startDate,
      groupEvent.startOffset,
      groupEvent.durationHours
    );

  return occupiedCells.some(cell => {

      const shiftIndex =
      SHIFT_ORDER.indexOf(cell.shift);

      const blockedKey =
      `${cell.date}-${groupEvent.region}-${groupEvent.subItem}-${shiftIndex}`;

      return selectedCells[blockedKey];

    });

});
if (hasBlockedCell) {

  message.error(
    "Group contains blocked cells."
  );

const dragInfo =
dragInfoRef.current;

if (dragInfo) {

  node.absolutePosition({

      x:
      dragInfo.startX,

      y:
      dragInfo.startY,

    });

}

node.getLayer()?.batchDraw();

setDraggingEvent(null);

dragInfoRef.current = null;

return prev;

}
//--------------------------------------------------
// GROUP OVERLAP VALIDATION
//--------------------------------------------------

const hasGroupOverlap =
finalGroupEvents.some(groupEvent => {

    const groupCells =
    getOccupiedCells(
      groupEvent.startDate,
      groupEvent.startOffset,
      groupEvent.durationHours
    );

  return prev.some(existingEvent => {

      // Ignore own group
      if (
        existingEvent.groupId === draggingEvent.groupId
      ) {
      return false;
    }

  // Different row
  if (
    existingEvent.region !== groupEvent.region ||
    existingEvent.subItem !== groupEvent.subItem
  ) {
  return false;
}

const occupied =
getOccupiedCells(
  existingEvent.startDate,
  existingEvent.startOffset,
  existingEvent.durationHours
);

return groupCells.some(gc =>
  occupied.some(ec =>
    gc.date === ec.date &&
    gc.shift === ec.shift
  )
);

});

});
if (hasGroupOverlap) {

  message.error(
    "Group overlaps another event."
  );

const dragInfo =
dragInfoRef.current;

if (dragInfo) {

  node.absolutePosition({

      x:
      dragInfo.startX,

      y:
      dragInfo.startY,

    });

}

node.getLayer()?.batchDraw();

setDraggingEvent(null);

dragInfoRef.current = null;

return;
}

return newEventList;

});

setDraggingEvent(null);
dragInfoRef.current = null;
};

const handlePrintPlanner = () => {

  if (eventList.length === 0) {

    message.warning(
      "No events are available on the planner to print."
    );

  return;
}

if (!stageRef.current) return;

const dataURL = stageRef.current.toDataURL({
    x: 0,
    y: 0,
    width: gridWidth,
    height: totalStageHeight,
    pixelRatio: 3,
  });
const pageWidth = 210;

const pageHeight = 297;

const leftSpace = 10;
const rightSpace = 10;
const topSpace = 30;
const bottomSpace = 10;
const plannerWidth = pageWidth - leftSpace - rightSpace;

const plannerHeight = pageHeight - topSpace - bottomSpace;

const monthName =
daysArray.length
? daysArray[0].format("MMMM YYYY")
: "";

const modifiedDate =
dayjs().format("DD-MM-YYYY HH:mm");

// ----------------------------------------
// TRANSFORMER + CUSTOMER DATA FOR PRINT
// ----------------------------------------

const printTransformerMap = {};

eventList.forEach((event) => {

    if (!event.transformer) {
      return;
    }

  // Keep only the first occurrence
  if (!printTransformerMap[event.transformer]) {

    printTransformerMap[event.transformer] = {
      transformer: event.transformer,
      customerName: event.customerName || "-",
    };

}

});

const printTransformerList = Object.values(printTransformerMap);

const transformerCount = printTransformerList.length;

let transformerFontSize = 7;

if (transformerCount > 8) {
  transformerFontSize = 6;
}

if (transformerCount > 12) {
  transformerFontSize = 5;
}

if (transformerCount > 16) {
  transformerFontSize = 4.5;
}

const iframe = document.createElement("iframe");

iframe.style.position = "fixed";
iframe.style.right = "0";
iframe.style.bottom = "0";
iframe.style.width = "0";
iframe.style.height = "0";
iframe.style.border = "0";

document.body.appendChild(iframe);

const doc =
iframe.contentWindow.document;

doc.open();

doc.write(`
<!DOCTYPE html>

<html>

<head>

<style>

@page{
    size:A4 portrait;
    margin:8mm;
}

html,body{
    margin:0;
    padding:0;
    font-family:Arial;
}

.header{
    text-align:center;
    font-size:20px;
    font-weight:bold;
}

.line{
    border-bottom:1px solid #999;
    margin:6px 0;
}

.info{
    display:flex;
    justify-content:space-between;
    font-size:12px;
    margin-bottom:2px;
}

.planner{
  display:flex;
  justify-content:center;
  align-items:center;
  margin-top:2mm;
  height:${plannerHeight}mm;
  overflow:hidden;
}

.planner img{
  display:block;
  width:100%;
  height:100%;
  max-width:none;
  max-height:none;
  object-fit:fill;
}

</style>

</head>

<body>

<div class="header">
TDMS PLANNING DASHBOARD
</div>

<div class="line"></div>

<div class="info">

<div>Version : ${selectedVersion || "-"}</div>
<div>Month : ${monthName}</div>
<div>Modified Date : ${modifiedDate}</div>

</div>

<div class="planner">

<img
src="${dataURL}"
style="
width:100%;
height:${plannerHeight}mm;

">

</div>

</div>
<div class="transformer-section">

  <div
    class="transformer-details"
    style="font-size:${transformerFontSize}px;"
  >
    ${printTransformerList.map((item, index) => {
      const customerShort =
        (item.customerName || "-").substring(0, 5);

      return `
  <span class="transformer-item">
  ${item.transformer} - ${customerShort}
  </span>
  ${
    index < printTransformerList.length - 1
    ? `<span class="transformer-separator">|</span>`
    : ""
  }
`;
    }).join("")}
  </div>
</div>

</body>

</html>
`);

doc.close();

iframe.onload = () => {

  iframe.contentWindow.focus();

  iframe.contentWindow.print();

  setTimeout(() => {

      document.body.removeChild(iframe);

    },1000);

};

};
const [deleteActive, setDeleteActive] = useState(false);
const handleDeleteEvent = (eventKey, eventObj) => {
  Modal.confirm({
      title: "Are you sure?",
      content: "Do you want to delete this event?",
      onOk: () => {
        setEventList(prev =>
          prev.filter(ev => ev !== (eventObj._original || eventObj))
        );
      message.success("Event deleted");
    },
  onCancel: () => {
    message.info("Cancelled");
  }
});
};
const handleSplitTask = (percentage) => {

  if (selectedEvents.size !== 1) {
    message.error(
      "Please select exactly one event to split."
    );

  // Reset dropdown because split did not happen
  setSplitPercentage(null);

  return;
}

if (!percentage) {
  message.error(
    "Please select split percentage."
  );
setSplitPercentage(null);

return;
}

const selectedEventId =
[...selectedEvents][0];

const originalEvent =
eventList.find( ev => ev.id === selectedEventId );

if (!originalEvent) {
  message.error(
    "Selected event not found."
  );

setSplitPercentage(null);

return;
}

const totalHours =
Number(
  originalEvent.durationHours
);

if (!totalHours || totalHours <= 0) {

  message.error(
    "Invalid event duration."
  );

setSplitPercentage(null);

return;
}

const part1Hours =
totalHours *
(percentage / 100);

// 6. PART 2
const part2Hours =
totalHours -
part1Hours;

if (
  part1Hours <= 0 ||
  part2Hours <= 0
) {

message.error(
  "Split percentage creates an invalid duration."
);

setSplitPercentage(null);

return;
}

let part2Date = originalEvent.startDate;

let part2Offset = Number(
  originalEvent.startOffset || 0
);

let remainingHours = part1Hours;

// -----------------------------------------
// Find current shift
// -----------------------------------------

let currentShiftIndex = Math.floor(
  part2Offset / cellWidth
);

currentShiftIndex = Math.max(
  0,
  Math.min(
    2,
    currentShiftIndex
  )
);

// -----------------------------------------
// Hours already consumed inside current shift
// -----------------------------------------

const offsetInsideShift =
part2Offset -
currentShiftIndex * cellWidth;

const hoursInsideCurrentShift =
(
  offsetInsideShift /
  cellWidth
) * 8;

// -----------------------------------------
// Remaining hours in current shift
// -----------------------------------------

let availableHours =
8 - hoursInsideCurrentShift;

// -----------------------------------------
// CASE 1:
// Part 2 still starts in current shift
// -----------------------------------------

if (
  remainingHours <= availableHours
) {

part2Offset =
part2Offset +
(
  remainingHours / 8
) * cellWidth;

remainingHours = 0;

}

// -----------------------------------------
// CASE 2:
// Part 1 continues into later shifts
// -----------------------------------------

else {

  remainingHours -= availableHours;

  let currentShift =
  SHIFT_ORDER[currentShiftIndex];

  // Move to next shift
  while (remainingHours > 0) {

    const next =
    nextShiftAndDate(
      currentShift,
      part2Date
    );

  currentShift = next.shift;
  part2Date = next.date;

  currentShiftIndex =
  SHIFT_ORDER.indexOf(
    currentShift
  );

// -------------------------------------
// Part 2 begins inside this shift
// -------------------------------------

if (remainingHours < 8) {

  part2Offset =
  currentShiftIndex *
  cellWidth +
  (
    remainingHours / 8
  ) * cellWidth;

remainingHours = 0;

break;
}

// -------------------------------------
// Entire shift consumed
// -------------------------------------

remainingHours -= 8;

// If exactly consumed the shift,
// part2 begins at the next shift.
if (remainingHours === 0) {

  const following =
  nextShiftAndDate(
    currentShift,
    part2Date
  );

currentShift =
following.shift;

part2Date =
following.date;

currentShiftIndex =
SHIFT_ORDER.indexOf(
  currentShift
);

part2Offset =
currentShiftIndex *
cellWidth;

break;
}
}
}

// -----------------------------------------
// CREATE PART 1
// -----------------------------------------

const timestamp = Date.now();

const part1 = {
  ...originalEvent,

  id:
  `${originalEvent.id}-part1-${timestamp}`,

  durationHours:
  part1Hours,

  label:
  originalEvent.label,

  groupId:
  null,
};

const part2 = {
  ...originalEvent,

  id:
  `${originalEvent.id}-part2-${timestamp}`,

  durationHours:
  part2Hours,

  label:
  originalEvent.label,

  startDate:
  part2Date,

  startOffset:
  part2Offset,

  groupId:
  null,
};

// -----------------------------------------
// REPLACE ORIGINAL
// -----------------------------------------

setEventList(prev => {

    const updatedEvents =
    prev.flatMap(ev => {

        if (
          ev.id !== originalEvent.id
        ) {
        return [ev];
      }

    return [
      part1,
      part2,
      ];
  });

console.log(
  "EVENTS AFTER SPLIT:",
  updatedEvents
);

return updatedEvents;
});

// -----------------------------------------
// CLEAR EVENT SELECTION
// -----------------------------------------

setSelectedEvents(
  new Set()
);

// -----------------------------------------
// RESET DROPDOWN
// -----------------------------------------

setSplitPercentage(null);

// -----------------------------------------
// SUCCESS
// -----------------------------------------

message.success(
  `Task split into ${part1Hours}h + ${part2Hours}h`
);
};
const handleToggleDelete = () => {
  if (!deleteActive && (witnessActive || retestActive)) {
    message.error("Cannot enable Delete while another mode is active");
    return;
  }

setDeleteActive(prev => !prev);
};
const handleBlock = () => {

  if (!blockSelectionActive) return;

  /*
  ============================================================
  EXACT EVENT OCCUPANCY CALCULATION
  ============================================================

  Each cell = 8 hours.

  We calculate the event as a continuous timeline.
  */

  const occupiedCellKeys = new Set();

  eventList.forEach((ev) => {

      const duration =
      Number(ev.durationHours || 0);

      if (duration <= 0) return;

      /*
      ------------------------------------------------------------
      EVENT START
      ------------------------------------------------------------
      */

      const startShiftIndex = Math.max(
        0,
        Math.min(
          2,
          Math.floor(
            Number(ev.startOffset || 0) /
            cellWidth
          )
      )
  );

/*
startOffset can be inside a cell.
Convert pixel offset into hours.
*/

const startHourInsideDay =
(
  Number(ev.startOffset || 0) /
  cellWidth
) * 8;

/*
------------------------------------------------------------
EVENT END
------------------------------------------------------------
*/

const endHour =
startHourInsideDay +
duration;

/*
------------------------------------------------------------
CHECK EVERY CELL OF THE EVENT'S DATE RANGE
------------------------------------------------------------
*/

const startDate =
ev.startDate.startOf("day");

const daysNeeded =
Math.ceil(
  endHour / 24
);

for (
  let dayOffset = 0;
  dayOffset <= daysNeeded;
  dayOffset++
) {

const currentDate =
startDate.add(
  dayOffset,
  "day"
);

/*
----------------------------------------------------------
EVENT TIMELINE FOR THIS DAY
----------------------------------------------------------
*/

const dayStartHour =
dayOffset * 24;

const dayEndHour =
dayStartHour + 24;

const eventStartInDay =
Math.max(
  0,
  startHourInsideDay -
  dayStartHour
);

const eventEndInDay =
Math.min(
  24,
  endHour -
  dayStartHour
);

/*
No event in this day.
*/

if (
  eventEndInDay <=
  eventStartInDay
) {
continue;
}

/*
----------------------------------------------------------
CHECK ALL 3 CELLS
----------------------------------------------------------
*/

for (
  let shiftIdx = 0;
  shiftIdx < 3;
  shiftIdx++
) {

const cellStartHour =
shiftIdx * 8;

const cellEndHour =
cellStartHour + 8;

/*
--------------------------------------------------------
ACTUAL OVERLAP
--------------------------------------------------------
*/

const overlapStart =
Math.max(
  eventStartInDay,
  cellStartHour
);

const overlapEnd =
Math.min(
  eventEndInDay,
  cellEndHour
);

const occupiedHours =
Math.max(
  0,
  overlapEnd -
  overlapStart
);

/*
--------------------------------------------------------
ANY OCCUPANCY = CELL CANNOT BE BLOCKED
---------------------------------------------------
*/

if (occupiedHours > 0) {

  const cellKey =
  `${currentDate.format("YYYY-MM-DD")}-${ev.region}-${ev.subItem}-${shiftIdx}`;

  occupiedCellKeys.add(
    cellKey
  );
}

}

}

});

/*
============================================================
NOW BLOCK ONLY COMPLETELY EMPTY SELECTED CELLS
============================================================
*/

const cellsToBlock = {};

const selectedKeys =
Object.keys(
  blockSelectedCells
);

selectedKeys.forEach((cellKey) => {

    /*
    If the event occupies even 1 hour,
    this cell is NOT allowed to be blocked.
    */

    if (
      !occupiedCellKeys.has(cellKey)
    ) {

    cellsToBlock[cellKey] = true;
  }

});

setSelectedCells(prev => ({
      ...prev,
      ...cellsToBlock,
    }));

setBlockSelectedCells({});

setBlockSelectionActive(false);

setIsSelectingBlocks(false);

const skippedCells =
selectedKeys.length -
Object.keys(
  cellsToBlock
).length;

if (skippedCells > 0) {

  message.warning(
    `${skippedCells} selected cell(s) contain event hours and were not blocked.`
  );

} else {

message.success(
  "Selected empty cells blocked."
);

}

};
const handleUnBlock = () => {

  if (!blockSelectionActive) return;

  setSelectedCells(prev => {

      const updated = {
        ...prev
      };

    Object.keys(
      blockSelectedCells
    ).forEach(key => {
      delete updated[key];
    });

return updated;
});

setBlockSelectedCells({});

setBlockSelectionActive(false);

setIsSelectingBlocks(false);
};

const getMonthTitle = () => {
  // We add a guard clause to prevent accessing
  // undefined values when no dates are selected
  if (!daysArray.length) return "Monthly Data";

  const firstMonth = daysArray[0].format("MMMM");
  const lastMonth = daysArray[daysArray.length - 1].format("MMMM");

  const versionText =
  selectedVersion
  ? ` | Version : ${selectedVersion}`
  : "";

  if (firstMonth === lastMonth) {
    return `${firstMonth} Monthly Data${versionText}`;
  }

return `${firstMonth} - ${lastMonth} Monthly Data${versionText}`;

};
const handleRemoveTransformer = (transformer) => {

  // Check whether this transformer already has tests on planner
  const existsOnGrid = eventList.some(
    (ev) => ev.transformer === transformer
  );

if (existsOnGrid) {
  message.error(
    "Transformer cannot be removed ."
  );
return;
}

// Remove from planner transformer list
setPlannerTransformers((prev) =>
  prev.filter((t) => t !== transformer)
);

// Remove from selected transformer list
setSelectedTransformer((prev) =>
  prev.filter((t) => t !== transformer)
);

// Remove pending queue items
setPendingEvents((prev) =>
  prev.filter(
    (ev) => ev.transformer !== transformer
  )
);

message.success("Transformer removed.");

};

const cellWidth = 50;
const cellHeight = 50;
const headerHeight = 60;
const gridStartX = 2 * cellWidth;   // current assumption

const totalCols = 2 + (7 * shifts.length);

const queueWidth = 270;

const gridWidth = totalCols * cellWidth;
const stageWidth = gridWidth + queueWidth;
const totalRows = regions.reduce(
  (sum, region) => sum + region.subItems.length,
  0
);

const singleWeekHeight = headerHeight +
totalRows * cellHeight;

const totalStageHeight =
(weeks.length * singleWeekHeight) +
((weeks.length - 1) * 20);
const groupedPendingEvents = pendingEvents.reduce((acc, ev) => {

    if (!acc[ev.transformer]) {
      acc[ev.transformer] = [];
    }

  acc[ev.transformer].push(ev);

  return acc;

}, {});

const isExcludedFromLmsUsage = (ev) => {

  const testName =
  ev.test ||
  ev.label ||
  "";

  return (
    testName === "REL" ||
    testName === "PRE"
  );

};
const lmsUsage = {
  EHV: 0,
  NORTH: 0,
  SOUTH: 0,
};

eventList.forEach((ev) => {

    // Only LMS row
    if (ev.subItem !== "LMS") {
      return;
    }

  // REL / PRE are excluded
  if (isExcludedFromLmsUsage(ev)) {
    return;
  }

const hours =
Number(ev.durationHours || 0);

if (ev.region === "EHV") {
  lmsUsage.EHV += hours;
}

if (ev.region === "NORTH") {
  lmsUsage.NORTH += hours;
}

if (ev.region === "SOUTH") {
  lmsUsage.SOUTH += hours;
}

});

return (
  <div className="monthly-grid-container" >
  <div
  style={{
      color: "#084a91",
      fontSize: "24px",
      fontWeight: "700",
      textTransform: "uppercase",
      marginBottom: "12px",
    }}
>
PLANNING DASH BOARD
</div>
{!showPlannerPage && (
    <PlannerSetup
    selectedMonth={selectedMonth}
    selectedWeekRange={selectedWeekRange}
    selectedTransformers={selectedTransformers}
    selectedVersion={selectedVersion}

    handleMonthChange={handleMonthChange}
    setSelectedWeekRange={setSelectedWeekRange}
    setDaysArray={setDaysArray}
    setSelectedDate={setSelectedDate}
    setIsSelectingWeekRange={setIsSelectingWeekRange}

    setSelectedTransformer={setSelectedTransformer}
    setPendingEvents={setPendingEvents}
    loadAllTransformerTests={loadAllTransformerTests}

    setSelectedVersion={setSelectedVersion}
    handleSetupSave={handleSetupSave}

    TRANSFORMERS={TRANSFORMERS}
    />
  )}
{showPlannerPage && (
    <>
    <h2 className="title">{getMonthTitle()}</h2>
    <PlannerToolbar
    witnessActive={witnessActive}
    retestActive={retestActive}
    splitPercentage={splitPercentage}
    blockSelectionActive={blockSelectionActive}
    deleteActive={deleteActive}
    selectedEvents={selectedEvents}

    handleToggleWitness={handleToggleWitness}
    handleToggleRetest={handleToggleRetest}

    handleSplitTask={(value) => {
        setSplitPercentage(value);
        handleSplitTask(value);
      }}

  handlePrintPlanner={handlePrintPlanner}
  handleGroupTest={handleGroupTest}
  handleUngroup={handleUngroup}
  handleToggleDelete={handleToggleDelete}
  handleBlock={handleBlock}
  handleUnBlock={handleUnBlock}
  />

  <Card
  size="small"
  style={{
      width: "100%",
      marginBottom: 16,
    }}
title={
  <div
  style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    }}
>
<span
style={{
    fontSize: 16,
    fontWeight: 600,
  }}
>
Selected Transformers List
</span>

<div
style={{
    fontWeight: 400,
    marginRight: 60,
  }}
>
<Space size={12}>
<span>Usage of LMS (Hrs)</span>

<span>
EHV : <b>{lmsUsage.EHV}</b>
</span>

<span>
NORTH : <b>{lmsUsage.NORTH}</b>
</span>

<span>
SOUTH : <b>{lmsUsage.SOUTH}</b>
</span>
</Space>
</div>
</div>
}
extra={
  <Space size={8}>
  <Select
  mode="multiple"
  size="small"
  placeholder="Select Transformer"
  value={selectedPlannerTransformer}
  onChange={setSelectedPlannerTransformer}
  allowClear
  showSearch
  optionFilterProp="children"
  maxTagCount={1}
  style={{
      width:180,      // little wider
    }}
className="planner-transformer-select"
>
{selectedTransformers.map((trf) => (
      <Select.Option
      key={trf}
      value={trf}
      >
      {trf}
      </Select.Option>
    ))}
</Select>

<Button
size="small"
type="default"
onClick={() =>
  setAddTransformerModalOpen(true)
}
>
Add Transformer
</Button>
</Space>
}
>

<div
style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    minHeight: "38px",
    alignItems: "center",
  }}
>

{plannerTransformers.length === 0 ? (

    <span
    style={{
        color: "#8c8c8c",
        fontSize: "13px",
      }}
  >
  No transformers selected.
  </span>

) : (

plannerTransformers.map((transformer) => (

    <Tag
    key={transformer}
    style={{
        padding: "4px 10px",
        fontSize: "13px",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
  >
  <span>{transformer}</span>

  <span
  onClick={() =>
    handleRemoveTransformer(transformer)
  }
style={{
    color: "#ff4d4f",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  }} >
✕
</span>

</Tag>

))

)}

</div>

</Card>

<TransformerModal
addTransformerModalOpen={
  addTransformerModalOpen
}

setAddTransformerModalOpen={
  setAddTransformerModalOpen
}

modalTransformers={
  modalTransformers
}

setModalTransformers={
  setModalTransformers
}

selectedTransformers={
  selectedTransformers
}

setSelectedTransformer={
  setSelectedTransformer
}

setPlannerTransformers={
  setPlannerTransformers
}

loadAllTransformerTests={
  loadAllTransformerTests
}

TRANSFORMERS={
  TRANSFORMERS
}

transformerCustomerMap={
  transformerCustomerMap
}
/>

<div
id="planner-print-area"
style={{
    display: "flex",
    alignItems: "flex-start",
  }}
>
<div
style={{
    flex: 1,
    marginRight: 0,
    paddingRight: 0,
  }}
>
<Stage
ref={stageRef}
width={stageWidth}
height={totalStageHeight}
>
<Layer>

{weeks.map((weekDays, weekIdx) => {

      const headerRow1 = 30;
      const headerRow2 = 30;

      const headerHeight =
      headerRow1 + headerRow2;

      const totalCols = 2 + weekDays.length * 3;
      const totalRows = regions.reduce((s, r) => s + r.subItems.length, 0);

      // const stageWidth = totalCols * cellWidth;
      // const stageHeight = headerHeight + totalRows * cellHeight;
      const weekOffsetY =
      weekIdx * (singleWeekHeight + 20);

      return (
        <Group
        key={weekIdx}
        y={weekOffsetY}
        >
        {/* region */}
        <Rect x={0} y={0} width={cellWidth} height={headerHeight} fill="#fafafa" />
        <Text x={0} y={0} width={cellWidth} height={headerHeight} text="Region" align="center" verticalAlign="middle" fontStyle="bold" />

        {/* sub item */}
        <Rect
        x={cellWidth}
        y={0}
        width={cellWidth}
        height={headerHeight}
        fill="#fafafa" />
        <Text
        x={cellWidth}
        y={0}
        width={cellWidth}
        height={headerHeight}
        text="Sub Item" align="center" verticalAlign="middle" fontStyle="bold" />

        {/* DAYS */}
        {weekDays.map((d, i) => {
              const baseX = (2 + i * 3) * cellWidth;

              return (
                <Group key={i}>
                {/* Day */}
                <Rect x={baseX} y={0} width={cellWidth * 3} height={30} fill="#f5f5f5" />
                <Text x={baseX} y={0} width={cellWidth * 3} height={30} text={`${d.format("ddd")}               ${d.format("MM-DD")}`} align="center" verticalAlign="middle" />

                {/* Shift */}
                {shifts.map((s, idx) => {
                      const x = baseX + idx * cellWidth;

                      return (
                        <Group key={idx}>
                        <Rect x={x} y={30} width={cellWidth} height={30} fill="#fff" />
                        <Text x={x} y={30} width={cellWidth} height={30} text={String(s)} align="center" verticalAlign="middle" />
                        </Group>
                      );
                  })}
            </Group>
          );
      })}

{(() => {
      let rowCounter = 0;

      return regions.map((region) =>
        region.subItems.map((sub, sIdx) => {
            const rowY = headerHeight + rowCounter * cellHeight;
            const isFirst = sIdx === 0;

            const group = (
              <Group key={`${region.name}-${sub}`}>

              {/* region row span */}
              {isFirst && (
                  <>
                  <Rect
                  x={0}
                  y={rowY}
                  width={cellWidth}
                  height={cellHeight * region.subItems.length}
                  fill="#fafafa"
                  />
                  <Text
                  x={0}
                  y={rowY}
                  width={cellWidth}
                  height={cellHeight * region.subItems.length}
                  text={region.name}
                  align="center"
                  verticalAlign="middle"
                  fontStyle="bold"
                  />

                  </>
                )}

            {/* Sub item */}
            <Rect x={cellWidth} y={rowY} width={cellWidth} height={cellHeight} fill="#fff" />
            <Text
            x={cellWidth + 6}//6 we used for the padding from left
            y={rowY}
            width={cellWidth - 6}
            height={cellHeight}
            text={sub}
            verticalAlign="middle"
            />

            {/* GRID CELLS */}
            {weekDays.map((_, dayIdx) =>
                shifts.map((_, shiftIdx) => {
                    const colIndex = 2 + dayIdx * 3 + shiftIdx;
                    const cellKey =
                    `${weekDays[dayIdx].format("YYYY-MM-DD")}-${region.name}-${sub}-${shiftIdx}`;

                    return (
                      <Rect
                      key={`${dayIdx}-${shiftIdx}`}
                      x={colIndex * cellWidth}
                      y={rowY}
                      width={cellWidth}
                      height={cellHeight}

                      fill={
                        weekDays[dayIdx].day() === 0 ||
                        weekDays[dayIdx].day() === 6
                        ? "#e0e0e0"
                        : selectedCells[cellKey]
                        ? blockSelectedCells[cellKey]
                        ? "rgb(255,153,153)"
                        : "rgb(138,138,138)"
                        : blockSelectedCells[cellKey]
                        ? "rgb(245,247,159)"
                        : "#fff"
                      }

                    onMouseDown={() => {

                        const isWeekend =
                        weekDays[dayIdx].day() === 0 ||
                        weekDays[dayIdx].day() === 6;

                        if (isWeekend) return;

                        setIsSelectingBlocks(true);

                        handleBlockCellSelect(cellKey);
                      }}

                  onMouseEnter={() => {

                      if (!isSelectingBlocks) return;

                      setBlockSelectedCells(prev => ({
                            ...prev,
                            [cellKey]: true,
                          }));

                    setBlockSelectionActive(true);
                  }}

              onMouseUp={() => {
                  setIsSelectingBlocks(false);
                }}

            />
          );
      })
)}
</Group>
);

rowCounter++;
return group;
})
);
})()}

<Rect
x={0}
y={0}
width={gridWidth}
height={singleWeekHeight}
fillEnabled={false}
stroke="#000"
strokeWidth={1.5}
/>

{Array.from({ length: totalCols + 1 }).map((_, col) => {
      const x = col * cellWidth;

      // MAIN BORDERS
      const isMajorLine =
      col === 0 ||
      col === 1 ||
      col === 2 ||
      col === totalCols ||
      ((col - 2) % 3 === 0 && col >= 2);

      return (
        <Group key={`hv-${col}`}>

        {/* FULL HEADER HEIGHT LINES */}
        {isMajorLine && (
            <Rect
            x={x}
            y={0}
            width={1}
            height={headerRow1 + headerRow2}
            fill="#000"
            />
          )}

      {/* SHIFT INNER LINES ONLY IN ROW-2 */}
      {!isMajorLine && (
          <Rect
          x={x}
          y={headerRow1}
          width={1}
          height={headerRow2}
          fill="#000"
          />
        )}

    </Group>
  );
})}

{/* vertical lines for each column boundary*/}
{Array.from({ length: totalCols + 1 }).map((_, col) => {
      const x =
      col === totalCols
      ? (col * cellWidth) - 1
      : col * cellWidth;

      let color = "#ccc";
      // 0 - left border1 - after Region2 -after SubItem totalCols - right border
      if (col === 0 || col === 1 || col === totalCols) color = "#000";
      if ((col - 2) % 3 === 0 && col >= 2) color = "#000";

      return (
        <Rect
        key={`v-${col}`}
        x={x}
        y={headerRow1 + headerRow2} // start at shift row
        width={1}
        height={singleWeekHeight - (headerRow1 + headerRow2)}
        fill={color}
        />
      );
  })}

{/* horizontal lines  */}
{Array.from({ length: totalRows + 3 }).map((_, i) => {
      let y;

      if (i === 0) y = 0;
      else if (i === 1) y = 30;
      else if (i === 2) y = 60;

      else y = headerHeight + (i - 3) * cellHeight;

      let rowIndex = i - 3;
      if (rowIndex < 0) rowIndex = -1;

      let cumulative = 0;
      let isRegionEnd = false;

      for (let r of regions) {
        cumulative += r.subItems.length;
        if (rowIndex === cumulative) isRegionEnd = true;
      }

    return (
      <Group key={`h-${i}`}>
      {/* HEADER */}
      {i <= 2 && (
          <>

          {i === 2 && (
              <Rect x={0} y={y} width={stageWidth} height={1} fill="#000" />
            )}

        {/* header lines */}
        {i !== 2 && (
            <Rect
            x={cellWidth * 2}
            y={y}
            width={stageWidth - (cellWidth * 2)}
            height={1}
            fill="#000"
            />
          )}
      </>
    )}

{/* REGION END */}
{i > 2 && isRegionEnd && (
    <Rect
    x={0}
    y={y }
    width={gridWidth}
    height={1}
    fill="#000" />
  )}

{i > 2 && !isRegionEnd && (
    <Rect
    x={i === 3 ? 0 : cellWidth}
    y={y}
    width={i === 3 ? stageWidth : stageWidth - cellWidth}
    height={1}
    fill={i === 3 ? "#000" : "#ccc"}

    />
  )}

</Group>
);
})}

{/* Event */}
{(() => {
      const visibleEvents =
      selectedPlannerTransformer.length === 0
      ? eventList
      : eventList.filter(ev =>
        selectedPlannerTransformer.includes(ev.transformer)
      );
    let rowCounter = 0;

    return regions.map((region) =>
      region.subItems.map((sub) => {
          const rowY = headerHeight + rowCounter * cellHeight;
          const elements = [];

          weekDays.forEach((d, dayIdx) => {
              const matchingEvents =
              visibleEvents.filter(
                (ev) =>
                ev.startDate.isSame(d, "day") &&
                ev.region === region.name &&
                ev.subItem === sub
              );

            if (!matchingEvents.length) return;

            matchingEvents.forEach((matchingEvent, eventIndex) => {

                const startCol = 2 + dayIdx * 3;
                const totalWidth =
                (matchingEvent.durationHours / 8) * cellWidth;

                const eventStartX =
                startCol * cellWidth +
                matchingEvent.startOffset;

                const currentWeekRightEdge =
                gridWidth;

                const remainingWidthInWeek =
                currentWeekRightEdge -
                eventStartX;

                const overflowWidth =
                Math.max(
                  0,
                  totalWidth -
                  remainingWidthInWeek
                );

              const hasOverflow = overflowWidth > 0;

              const leftWidth = totalWidth;

              const hasStar = witnessTests.has(matchingEvent.id);

              const hasRetest =
              retestTests.has(matchingEvent.id);

              const groupDotColor =
              matchingEvent.groupId
              ? GROUP_COLORS[
                (matchingEvent.groupId - 1) %
                GROUP_COLORS.length
                ]
              : null;

              elements.push(
                <Group
                key={`${region.name}-${sub}-${dayIdx}-${matchingEvent.id}-${eventIndex}`}
                x={startCol * cellWidth + matchingEvent.startOffset}
                y={rowY}
                draggable
                listening={true}

                dragBoundFunc={(pos) => {

                    let minX = 2 * cellWidth;

                    let maxX =
                    gridWidth -
                    totalWidth;

                    if (matchingEvent.groupId) {

                      const groupEvents =
                      visibleEvents.filter(
                        e =>
                        e.groupId ===
                        matchingEvent.groupId
                      );

                    let leftLimit = minX;
                    let rightLimit = maxX;

                    // Get the actual drag-start X position.
                    const dragStartX =
                    matchingEvent._dragStartX ??
                    dragInfoRef.current?.startX ??
                    pos.x;

                    groupEvents.forEach(ev => {

                        const eventDay =
                        daysArray.findIndex(d =>
                          d.isSame(
                            ev.startDate,
                            "day"
                          )
                      );

                    if (eventDay === -1) {
                      return;
                    }

                  const eventX =
                  (2 + (eventDay % 7) * 3) *
                  cellWidth +
                  ev.startOffset;

                  const eventWidth =
                  (ev.durationHours / 8) *
                  cellWidth;

                  const relativeOffset =
                  eventX -
                  dragStartX;

                  leftLimit =
                  Math.max(
                    leftLimit,
                    minX -
                    relativeOffset
                  );

                rightLimit =
                Math.min(
                  rightLimit,
                  (gridWidth -
                    eventWidth) -
                  relativeOffset
                );

            });

        minX = leftLimit;
        maxX = rightLimit;
      }

    const minY = headerHeight;

    const maxY =
    totalStageHeight - cellHeight;

    if (
      matchingEvent.test === "Sound Test" &&
      matchingEvent.subItem === "LMS"
    ) {

    return {
      x: Math.max(minX, Math.min(pos.x, maxX)),
      y: rowY,
    };
}

const fullWeekHeight =
singleWeekHeight + 20;

const weekIndex =
Math.floor(pos.y / fullWeekHeight);

const weekStartY =
weekIndex * fullWeekHeight;

const insideWeekY =
pos.y - weekStartY;

const clampedInsideY =
Math.max(
  headerHeight,
  Math.min(
    insideWeekY,
    singleWeekHeight - cellHeight
  )
);

const snappedInsideY =
Math.round(
  (clampedInsideY - headerHeight) /
  cellHeight
) *
cellHeight +
headerHeight;

const snappedY =
weekStartY + snappedInsideY;

return {
  x: Math.max(minX, Math.min(pos.x, maxX)),
  y: Math.max(minY, Math.min(snappedY, maxY)),
};

}}

// onDragStart={() => {
    //   setDraggingEvent(matchingEvent);
    //   setDragMoved(false);
    // }}
onDragStart={(e) => {

    const node =
    e.target;

    // IMPORTANT:
    // Get the actual starting position
    // of the event before dragging.
    const absolutePos =
    node.getAbsolutePosition();

    // Store drag information in ref.
    dragInfoRef.current = {

      id:
      matchingEvent.id,

      startX:
      absolutePos.x,

      startY:
      absolutePos.y,

      startDate:
      matchingEvent.startDate,

      startOffset:
      matchingEvent.startOffset,

      region:
      matchingEvent.region,

      subItem:
      matchingEvent.subItem,

      groupId:
      matchingEvent.groupId,

    };

  // IMPORTANT:
  // These values are required by the
  // group dragBoundFunc.
  //
  // We store them on the event object
  // because the existing dragBoundFunc
  // uses matchingEvent._dragStartX.
  matchingEvent._dragStartX =
  absolutePos.x;

  matchingEvent._dragStartY =
  absolutePos.y;

  setDraggingEvent({
      ...matchingEvent,
    });

setDragMoved(false);

if (
  matchingEvent.groupId
) {

setGroupDragStart({

    startDate:
    matchingEvent.startDate,

    startOffset:
    matchingEvent.startOffset,

    groupId:
    matchingEvent.groupId,

  });

}

}}

onDragMove={(e) => {

    setDragMoved(true);

    if (
      matchingEvent.groupId &&
      groupDragStart
    ) {

    setGroupDragOffset({

        dx:
        e.target.x() -
        matchingEvent._dragStartX,

        dy:
        e.target.y() -
        matchingEvent._dragStartY,

      });

}

}}
onDragEnd={(e) => {

    const node =
    e.target;

    const pos =
    node.getAbsolutePosition();

    handleDropPixel(
      pos.x,
      pos.y,
      node
    );

  setGroupDragOffset({
      dx: 0,
      dy: 0,
    });

setGroupDragStart(null);

// Clear temporary drag-start values.
matchingEvent._dragStartX =
undefined;

matchingEvent._dragStartY =
undefined;

}}

onClick={(e) => {
    if (dragMoved) {
      setDragMoved(false);
      return;
    }

  const eventId = matchingEvent.id;
  if (
    !deleteActive &&
    !witnessActive &&
    !retestActive
  ) {

  setSelectedEvents((prev) => {

      const next = new Set(prev);

      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
      next.add(eventId);
    }

  return next;

});

return;
}

if (deleteActive) {
  handleDeleteEvent(eventId, matchingEvent);
  return;
}

if (witnessActive) {

  const stage = e.target.getStage();

  const pointerPos = stage.getPointerPosition();

  const localX =
  pointerPos.x -
  (startCol * cellWidth + matchingEvent.startOffset);

  const clickedSide =
  localX < leftWidth ? "left" : "right";

  handleToggleStar(eventId, clickedSide);

  return;

}

if (retestActive) {

  const stage = e.target.getStage();

  const pointerPos = stage.getPointerPosition();

  const localX =
  pointerPos.x -
  (startCol * cellWidth + matchingEvent.startOffset);

  const clickedSide =
  localX < leftWidth ? "left" : "right";

  handleToggleRetestStar(eventId, clickedSide);

  return;

}

}}
>
{/* LEFT BLOCK */}
<Rect
x={0}
y={3}
width={leftWidth}
height={cellHeight - 6}
fill={matchingEvent.color}
cornerRadius={4}

stroke={
  selectedEvents.has(
    matchingEvent.id
  )
? "#4B7BEC"
: undefined
}

strokeWidth={
  selectedEvents.has(
    matchingEvent.id
  )
? 2
: 0
}
/>
{/* OVERFLOW TO NEXT WEEK */}
{hasOverflow && (
    <Rect
    x={
      gridWidth -
      (2 * cellWidth)
    }
  y={3}
  width={overflowWidth}
  height={cellHeight - 6}
  fill={matchingEvent.color}
  cornerRadius={4}
  />
)}

{/* LEFT TEXT */}
<Text
x={0}
y={0}
width={leftWidth}
fontSize={12}
height={cellHeight}
text={`${matchingEvent.transformer} (${matchingEvent.durationHours}h)
              ${matchingEvent.label}`}
  align="center"
  verticalAlign="middle"
  />

  {/* Witness Star */}
  {hasStar &&
    witnessSideMap[matchingEvent.id] === "left" && (
      <Star
      x={
        hasRetest &&
        retestSideMap[matchingEvent.id] === "left"
        ? leftWidth - 28
        : leftWidth - 10
      }
    y={12}
    numPoints={5}
    innerRadius={5}
    outerRadius={9}
    fill="#FFD700"
    stroke="#C99700"
    strokeWidth={1}
    listening={false}
    />
  )}
{/* Retest Star */}
{hasRetest &&
  retestSideMap[matchingEvent.id] === "left" && (
    <Group
    x={leftWidth - 12}
    y={3}
    listening={false}
    >
    <Star
    x={0}
    y={9}
    numPoints={5}
    innerRadius={5}
    outerRadius={9}
    fill="#FFD700"
    stroke="#C99700"
    strokeWidth={1}
    />

    <Text
    x={-6}
    y={4}
    width={12}
    height={10}
    text="R"
    align="center"
    verticalAlign="middle"
    fontSize={8}
    fontStyle="bold"
    fill="#000"
    />
    </Group>
  )}

{hasOverflow && (
    <Text
    x={
      gridWidth -
      (2 * cellWidth)
    }
  y={0}
  width={overflowWidth}
  height={cellHeight}
  text={matchingEvent.label}
  align="center"
  verticalAlign="middle"
  />
)}

{/* GROUP DOT */}
{matchingEvent.groupId && (
    <Rect
    x={leftWidth - 12}
    y={4}
    width={8}
    height={8}
    fill={groupDotColor}
    cornerRadius={4}
    listening={false}
    />
  )}
</Group>
);

});
});
rowCounter++;
return elements;
})
);
})()}

</Group>
);
})}
<Group>

{/* Queue Background */}

<Rect
x={gridWidth}
y={0}
width={queueWidth}
height={totalStageHeight}
fill="#fafafa"

/>
{/* LEFT SEPARATOR */}
<Rect
x={gridWidth}
y={0}
width={1}
height={totalStageHeight}
fill="#000"
/>
{/* TOP */}
<Rect
x={gridWidth}
y={0}
width={queueWidth}
height={1}
fill="#000"
/>

{/* RIGHT */}
<Rect
x={gridWidth + queueWidth - 1}
y={0}
width={1}
height={totalStageHeight}
fill="#000"
/>

<TestQueue
gridWidth={gridWidth}
queueWidth={queueWidth}
totalStageHeight={totalStageHeight}
headerHeight={headerHeight}
cellWidth={cellWidth}
cellHeight={cellHeight}
singleWeekHeight={singleWeekHeight}

groupedPendingEvents={groupedPendingEvents}
expandedTransformers={expandedTransformers}
toggleTransformer={toggleTransformer}

draggingQueueEvent={draggingQueueEvent}
handleQueueDrop={handleQueueDrop}
/>

</Group>
</Layer>
</Stage>

</div>

{/* SHOW CONTAINER BUTTON */}
{!showRightContainer && (
    <div
    style={{
        position: "fixed",
        right: "18px",
        top: "138px",
        zIndex: 1000,

      }}
  >
  <button
  onClick={() => setShowRightContainer(true)}
  style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      background: "#ffffff",
      border: "1px solid #d9d9d9",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "500",
      color: "#333",
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    }}
>

{/* SMALL CHECKBOX */}
<div
style={{
    width: "14px",
    height: "14px",
    border: "1px solid #666",
    borderRadius: "2px",
    background: "#f5f5f5",
  }}
/>

Show tests
</button>

</div>
)}

</div>
</>
)}

</div>

);}
export default MonthlyDataGrid;

