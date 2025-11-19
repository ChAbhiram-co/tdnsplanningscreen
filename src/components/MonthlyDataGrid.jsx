// import React from "react";
// import "./MonthlyDataGrid.css";

// const regions = [
//   { name: "EHV", subItems: ["Impulse", "Indar"] },
//   { name: "NORTH", subItems: ["Tes", "Kato"] },
//   { name: "SOUTH", subItems: ["Tes", "MI"] },
// ];

// const events = [
//   { week: 1, day: 1, shift: 1, region: "EHV", subItem: "Impulse", text: "sfra\nA1", color: "red" },
//   { week: 1, day: 3, shift: 2, region: "EHV", subItem: "Impulse", text: "sfra\nA1", color: "red" },
//   { week: 1, day: 2, shift: 3, region: "NORTH", subItem: "Tes", text: "Text\nA1⭐", color: "lightblue" },
//   { week: 1, day: 3, shift: 1, region: "NORTH", subItem: "Tes", text: "sfra\nA1 ⭐", color: "yellow" },
//   { week: 2, day: 7, shift: 2, region: "SOUTH", subItem: "MI", text: "sfra\nA2", color: "yellow" },

//   { week: 3, day: 4, shift: 1, region: "EHV", subItem: "Indar", text: "sfra\nA3", color: "lightgreen" },
//   { week: 4, day: 6, shift: 3, region: "NORTH", subItem: "Kato", text: "sfra\nA4", color: "orange" },
// ];

// const weeks = [1, 2, 3, 4];
// const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
// const shifts = [3, 1, 2];

// function MonthlyDataGrid() {
//   return (
//     <div className="monthly-grid-container">
//       <h2 className="title">Monthly Data</h2>
//       <div className="buttons">
//         <button>Add Customer Witness</button>
//         <button>Split Selected Vertically</button>
//         <button>calander </button>
//         <button>create test </button>
//       </div>

//       {weeks.map((week) => (
//         <table className="schedule-table" key={week}>
//           <thead>
//             {/* Top row: Day names spanning 3 shifts */}
//             <tr>
//               <th rowSpan="3" className="region-col">Region</th>
//               <th rowSpan="3" className="sub-col">Sub Item</th>
//               {days.map((d, i) => (
//                 <th key={i} className="day-header" colSpan={3}>{d}</th>
//               ))}
//             </tr>
//             {/* Second row: Date cells spanning 3 shifts */}
//             <tr>
//               {days.map((_, i) => (
//                 <th key={i} className="date-cell" colSpan={3}>
//                   {String(i + 1 + (week - 1) * 7).padStart(2, "0")}-07
//                 </th>
//               ))}
//             </tr>
//             {/* Third row: individual shift headers */}
//       <tr className="shift-row">
//   {days.map((_, i) =>
//     shifts.map((s, idx) => (
//       <th
//         key={`${i}-${s}`}
//         className={`shift-cell ${
//           idx === 0 || idx === 1 || idx === 2 ? "black-separator" : ""
//         }`}
//       >
//         {s}
//       </th>
//     ))
//   )}
// </tr>


//           </thead>

//  <tbody>
//   {regions.map((region) =>
//     region.subItems.map((sub, i) => (
//       <tr key={sub}>
//         {i === 0 && (
//           <td rowSpan={region.subItems.length} className="region-name">
//             {region.name}
//           </td>
//         )}
//         <td className="sub-name">{sub}</td>

//         {days.map((_, dayIdx) =>
//           shifts.map((s, shiftIdx) => {
//             const ev = events.find(
//               (e) =>
//                 e.week === week &&
//                 e.day === dayIdx + 1 &&
//                 e.shift === s &&
//                 e.region === region.name &&
//                 e.subItem === sub
//             );

//             return (
//               <td
//                 key={`${dayIdx}-${s}`}
//                 className={`cell shift-cell ${
//                   shiftIdx === 3 ? "black-separator" : ""
//                 } ${shiftIdx === shifts.length - 1 ? "day-separator" : ""}`}
//               >
//                 {ev && (
//                   <div
//                     className="event-block"
//                     style={{ backgroundColor: ev.color }}
//                   >
//                     {ev.text}
//                   </div>
//                 )}
//               </td>
//             );
//           })
//         )}
//       </tr>
//     ))
//   )}
// </tbody>
//         </table>
//       ))}
//     </div>
//   );
// }

// export default MonthlyDataGrid;`

// ----------------------------------------------above one is static ---------------------------------------------//
// //15-09-2025
// import React, { useState } from "react";
// import { DatePicker, Modal, message } from "antd";
// import dayjs from "dayjs";
// import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
// import "./MonthlyDataGrid.css";

// dayjs.extend(isSameOrBefore);

// const { RangePicker } = DatePicker;

// const regions = [
//   { name: "EHV", subItems: ["Impulse", "LMS","Others"] },
//   { name: "NORTH", subItems: ["Impulse", "LMS","Others"] },
//   { name: "SOUTH", subItems: ["Impulse", "LMS","Others"] },
// ];

// const shifts = [3, 1, 2];

// const TEST_STYLES = {
//   SfraA1: { color: "red", text: "SfraA1" },
//   SfraA2: { color: "yellow", text: "SfraA2" },
//   TestA1: { color: "lightblue", text: "Test A1" },
// };

// const SHIFT_ORDER = [3, 1, 2];
// const nextShiftAndDate = (shift, date) => {
//   const idx = SHIFT_ORDER.indexOf(shift);
//   if (idx === -1 || idx === SHIFT_ORDER.length - 1) {
//     return { shift: SHIFT_ORDER[0], date: date.add(1, "day") };
//   }
//   return { shift: SHIFT_ORDER[idx + 1], date };
// };

// function MonthlyDataGrid() {
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [tempRange, setTempRange] = useState([]);
//   const [eventList, setEventList] = useState([]);

//   const [daysArray, setDaysArray] = useState(() => {
//     const base = dayjs("2025-09-01");
//     return Array.from({ length: base.daysInMonth() }, (_, i) =>
//       base.date(i + 1)
//     );
//   });

//   const getWeeks = (days) => {
//     const weeks = [];
//     for (let i = 0; i < days.length; i += 7) {
//       weeks.push(days.slice(i, i + 7));
//     }
//     return weeks;
//   };

//   const applyDateRange = () => {
//     if (!tempRange || tempRange.length !== 2) {
//       message.error("Please select both start and end dates!");
//       return;
//     }
//     const [start, end] = tempRange;
//     let current = start.startOf("day");

//     if (end.diff(start, "day") + 1 > 28) {
//       message.error("Date range cannot exceed 28 days.");
//       return;
//     }

//     const selectedDays = [];
//     while (current.isSameOrBefore(end, "day")) {
//       selectedDays.push(current);
//       current = current.add(1, "day");
//     }

//     setDaysArray(selectedDays);
//     setShowCalendar(false);
//   };

//   const handleCancel = () => {
//     setTempRange([]);
//     setShowCalendar(false);
//   };

//   const weeks = getWeeks(daysArray);

//   const [showCreateTest, setShowCreateTest] = useState(false);
//   const [testForm, setTestForm] = useState({
//     name: "",
//     date: null,
//     region: "",
//     hours: "",
//     shift: "",
//   });

//   const handleCreateTest = () => {
//     const { name, date, region, hours, shift } = testForm;

//     if (!name || !TEST_STYLES[name]) {
//       message.error("Please select a test.");
//       return;
//     }
//     if (!date) {
//       message.error("Please select a start date.");
//       return;
//     }
//     if (date.isBefore(dayjs("2025-08-01"), "day")) {
//       message.error("Start date must be on/after 01-08-2025.");
//       return;
//     }
//     if (!region.includes("-")) {
//       message.error("Please select region and sub item.");
//       return;
//     }
//     const hrs = Number(hours);
//     if (!hrs || hrs <= 0) {
//       message.error("Hours must be positive.");
//       return;
//     }
//     const shiftNum = Number(shift);
//     if (!SHIFT_ORDER.includes(shiftNum)) {
//       message.error("Invalid shift.");
//       return;
//     }

//     const [regionName, subItemName] = region.split("-");

//     let remaining = hrs;
//     let currentDate = date.startOf("day");
//     let currentShift = shiftNum;
//     const toAdd = [];

//     while (remaining > 0) {
//       const allot = Math.min(8, remaining);
//       toAdd.push({
//         date: currentDate,
//         shift: currentShift,
//         region: regionName,
//         subItem: subItemName,
//         test: name,
//         color: TEST_STYLES[name].color,
//         label: TEST_STYLES[name].text,
//         hours: allot,
//       });
//       remaining -= allot;
//       const next = nextShiftAndDate(currentShift, currentDate);
//       currentShift = next.shift;
//       currentDate = next.date;
//     }

//     setEventList((prev) => [...prev, { merged: true, parts: toAdd }]);
//     setShowCreateTest(false);
//     setTestForm({ name: "", date: null, region: "", hours: "", shift: "" });
//   };

//   // 🔹 Customer Witness
//   const [witnessActive, setWitnessActive] = useState(false);
//   const [witnessTests, setWitnessTests] = useState(new Set());

//   const handleToggleWitness = () => {
//     setWitnessActive((prev) => !prev);
//   };

//   const handleToggleStar = (eventKey) => {
//     if (!witnessActive) return;
//     setWitnessTests((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(eventKey)) newSet.delete(eventKey);
//       else newSet.add(eventKey);
//       return newSet;
//     });
//   };

//   // 🔹 Split Event Logic
//   const [splitActive, setSplitActive] = useState(false);

//   const handleToggleSplit = () => {
//     setSplitActive((prev) => !prev);
//   };
// //-----------===---------------===-----------------
//   const handleSplitEvent = (eventKey, mergedEvent) => {
//     Modal.confirm({
//       title: "Split Test",
//       content: "Are you sure you want to split this test into 2 equal parts?",
//       onOk: () => {
//         const totalHours = mergedEvent.parts.reduce(
//           (sum, p) => sum + p.hours,
//           0
//         );
//         const half = Math.floor(totalHours / 2);
//         const otherHalf = totalHours - half;

//         const { region, subItem, test, color, label } = mergedEvent.parts[0];
//         const startDate = mergedEvent.parts[0].date;
//         const startShift = mergedEvent.parts[0].shift;

//         const allocateParts = (hours, date, shift) => {
//           let remaining = hours;
//           let currentDate = date;
//           let currentShift = shift;
//           const parts = [];

//           while (remaining > 0) {
//             const allot = Math.min(8, remaining);
//             parts.push({
//               date: currentDate,
//               shift: currentShift,
//               region,
//               subItem,
//               test,
//               color,
//               label,
//               hours: allot,
//             });
//             remaining -= allot;
//             const next = nextShiftAndDate(currentShift, currentDate);
//             currentShift = next.shift;
//             currentDate = next.date;
//           }

//           return parts;
//         };

//         const firstHalfParts = allocateParts(half, startDate, startShift);

//         const last = firstHalfParts[firstHalfParts.length - 1];
//         const next = nextShiftAndDate(last.shift, last.date);
//         const secondHalfParts = allocateParts(otherHalf, next.date, next.shift);

//         const firstEvent = { merged: true, parts: firstHalfParts };
//         const secondEvent = { merged: true, parts: secondHalfParts };

//         setEventList((prev) => {
//           const filtered = prev.filter((ev) => ev !== mergedEvent);
//           return [...filtered, firstEvent, secondEvent];
//         });

//         message.success("Test split into two halves!");
//       },
//     });
//   };
  

//   return (
//     <div className="monthly-grid-container">
//       <h2 className="title">Monthly Data</h2>

//       <div className="buttons">
//         <button
//           onClick={handleToggleWitness}
//           style={{ position: "relative", paddingRight: "20px" }}
//         >
//           Add Customer Witness
//           {witnessActive && <span className="witness-dot"></span>}
//         </button>

//         <button
//           onClick={handleToggleSplit}
//           style={{ position: "relative", paddingRight: "20px" }}
//         >
//           Split Selected Vertically
//           {splitActive && <span className="witness-dot"></span>}
//         </button>

//         <button onClick={() => setShowCalendar(true)}>Calendar</button>
//         <button onClick={() => setShowCreateTest(true)}>Create Test</button>
//         <button>Delete Test</button>
//       </div>

//       {/* Calendar Modal */}
//       <Modal
//         title="Select Date Range"
//         open={showCalendar}
//         onOk={applyDateRange}
//         onCancel={handleCancel}
//         okText="OK"
//       >
//         <RangePicker
//           value={tempRange}
//           onChange={(values) => setTempRange(values || [])}
//           defaultPickerValue={[dayjs("2025-08-01"), dayjs("2025-08-01")]}
//           disabledDate={(current) =>
//             current && current.isBefore(dayjs("2025-08-01"), "day")
//           }
//         />
//       </Modal>

//       {/* Create Test Modal */}
//       <Modal
//         title="Create Test"
//         open={showCreateTest}
//         onOk={handleCreateTest}
//         onCancel={() => setShowCreateTest(false)}
//         okText="Create"
//         className="create-test-modal"
//       >
//         {/* form fields */}
//         <div className="form-group">
//           <label>Name of the Test</label>
//           <select
//             className="form-control"
//             value={testForm.name}
//             onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
//           >
//             <option value="">Select Test</option>
//             <option value="SfraA1">SfraA1</option>
//             <option value="SfraA2">SfraA2</option>
//             <option value="TestA1">TestA1</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Date to Start</label>
//           <DatePicker
//             value={testForm.date}
//             onChange={(date) => setTestForm({ ...testForm, date })}
//             disabledDate={(current) =>
//               current && current.isBefore(dayjs("2025-08-01"), "day")
//             }
//             className="form-control"
//           />
//         </div>
// <div className="form-group">
//   <label>Region</label>
//   <select
//     className="form-control"
//     value={testForm.region}
//     onChange={(e) => setTestForm({ ...testForm, region: e.target.value })}
//   >
//     <option value="">Select Region</option>
//     {regions.map((reg) => (
//       <optgroup key={reg.name} label={reg.name}>
//         {reg.subItems.map((sub) => (
//           <option key={`${reg.name}-${sub}`} value={`${reg.name}-${sub}`}>
//             {sub}
//           </option>
//         ))}
//       </optgroup>
//     ))}
//   </select>
// </div>



//         <div className="form-group">
//           <label>Test Hours</label>
//           <input
//             type="number"
//             className="form-control"
//             value={testForm.hours}
//             onChange={(e) =>
//               setTestForm({ ...testForm, hours: parseInt(e.target.value, 10) })
//             }
//             placeholder="Enter hours"
//             min={1}
//           />
//         </div>

//         <div className="form-group">
//           <label>Shift</label>
//           <select
//             className="form-control"
//             value={testForm.shift}
//             onChange={(e) => setTestForm({ ...testForm, shift: e.target.value })}
//           >
//             <option value="">Select Shift</option>
//             <option value="3">3</option>
//             <option value="1">1</option>
//             <option value="2">2</option>
//           </select>
//         </div>
//       </Modal>

//       {weeks.length > 0 ? (
//         weeks.map((weekDays, weekIdx) => (
//           <table className="schedule-table" key={weekIdx}>
//             <thead>
//               <tr>
//                 <th rowSpan="3" className="region-col">Region</th>
//                 <th rowSpan="3" className="sub-col">Sub Item</th>
//                 {weekDays.map((d, i) => (
//                   <th key={i} colSpan={shifts.length} className="day-header">
//                     {d.format("dddd")}
//                   </th>
//                 ))}
//               </tr>
//               <tr>
//                 {weekDays.map((d, i) => (
//                   <th key={i} colSpan={shifts.length} className="date-cell">
//                     {d.format("DD-MM")}
//                   </th>
//                 ))}
//               </tr>
//               <tr className="shift-row">
//                 {weekDays.map((_, i) =>
//                   shifts.map((s, idx) => (
//                     <th
//                       key={`${i}-${s}`}
//                       className={`shift-cell ${idx === 2 ? "black-separator" : ""}`}
//                     >
//                       {s}
//                     </th>
//                   ))
//                 )}
//               </tr>
//             </thead>

//             <tbody>
//               {regions.map((region) =>
//                 region.subItems.map((sub, i) => (
//                   <tr key={`${region.name}-${sub}`}>
//                     {i === 0 && (
//                       <td rowSpan={region.subItems.length} className="region-name">
//                         {region.name}
//                       </td>
//                     )}
//                     <td className="sub-name">{sub}</td>

//                     {weekDays.map((d, dayIdx) =>
//                       shifts.map((s, shiftIdx) => {
//                         const mergedEvent = eventList.find(
//                           (ev) =>
//                             ev.merged &&
//                             ev.parts[0].date.isSame(d, "day") &&
//                             ev.parts[0].shift === s &&
//                             ev.parts[0].region === region.name &&
//                             ev.parts[0].subItem === sub
//                         );

//                         if (mergedEvent) {
//                           const totalCells = mergedEvent.parts.length;
//                           const totalHours = mergedEvent.parts.reduce(
//                             (sum, p) => sum + p.hours,
//                             0
//                           );
//                           const firstPart = mergedEvent.parts[0];

//                           // ✅ FIXED: mark black only if the WHOLE event ends at shift 2
//                           const lastPart = mergedEvent.parts[mergedEvent.parts.length - 1];
//                           const coversShift2 = lastPart && lastPart.shift === 2;

//                           const eventKey = `${region.name}-${sub}-${d.format(
//                             "YYYY-MM-DD"
//                           )}-${firstPart.test}`;

//                           return (
//                             <td
//                               key={`${dayIdx}-${s}`}
//                               colSpan={totalCells}
//                               className={`cell shift-cell ${coversShift2 ? "black-separator" : ""}`}
//                             >
//                               <div
//                                 className="event-block"
//                                 style={{
//                                   backgroundColor: firstPart.color,
//                                   color: "black",
//                                   height: "100%",
//                                   width: `${(totalHours / (8 * totalCells)) * 100}%`,
//                                   textAlign: "left",
//                                   cursor: (witnessActive || splitActive) ? "pointer" : "default",
//                                 }}
//                                 onClick={() => {
//                                   if (witnessActive) handleToggleStar(eventKey);
//                                   if (splitActive) handleSplitEvent(eventKey, mergedEvent);
//                                 }}
//                               >
//                                 <span className="event-text">
//                                   {firstPart.label}
//                                   {witnessTests.has(eventKey) && (
//                                     <span className="event-star">⭐</span>
//                                   )}
//                                 </span>
//                               </div>
//                             </td>
//                           );
//                         }

//                         const insideSpan = eventList.some(
//                           (ev) =>
//                             ev.merged &&
//                             ev.parts.some(
//                               (p) =>
//                                 p.date.isSame(d, "day") &&
//                                 p.shift === s &&
//                                 p.region === region.name &&
//                                 p.subItem === sub
//                             )
//                         );
//                         if (insideSpan) return null;

//                         return (
//                           <td
//                             key={`${dayIdx}-${s}`}
//                             className={`cell shift-cell ${
//                               shiftIdx === 2 ? "black-separator" : ""
//                             }`}
//                           />
//                         );
//                       })
//                     )}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         ))
//       ) : (
//         <p>No dates to show</p>
//       )}
//     </div>
//   );
// }

// export default MonthlyDataGrid;

// // // ------------------------- using react konva ------------------------------------------------------
// //-------------------------------24-09-2025--------------------------------
// import React, { useState } from "react";
// import { DatePicker, Modal, message, Slider, Radio, Anchor } from "antd";
// import dayjs from "dayjs";
// import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
// import "./MonthlyDataGrid.css";

// dayjs.extend(isSameOrBefore);

// const { RangePicker } = DatePicker;

// const regions = [
//   { name: "EHV", subItems: ["Impulse", "LMS", "Others"] },
//   { name: "NORTH", subItems: ["Impulse", "LMS", "Others"] },
//   { name: "SOUTH", subItems: ["Impulse", "LMS", "Others"] },
// ];

// const shifts = [3, 1, 2];

// const TEST_STYLES = {
//   SfraA1: { color: "red", text: "SfraA1" },
//   SfraA2: { color: "yellow", text: "SfraA2" },
//   TestA1: { color: "lightblue", text: "Test A1" },
// };

// const SHIFT_ORDER = [3, 1, 2];
// const nextShiftAndDate = (shift, date) => {
//   const idx = SHIFT_ORDER.indexOf(shift);
//   if (idx === -1 || idx === SHIFT_ORDER.length - 1) {
//     return { shift: SHIFT_ORDER[0], date: date.add(1, "day") };
//   }
//   return { shift: SHIFT_ORDER[idx + 1], date };
// };

// function MonthlyDataGrid() {
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [tempRange, setTempRange] = useState([]);
//   const [eventList, setEventList] = useState([]);

//   const [daysArray, setDaysArray] = useState(() => {
//     const base = dayjs("2025-10-01");
//     return Array.from({ length: base.daysInMonth() }, (_, i) =>
//       base.date(i + 1)
//     );
//   });

//   const getWeeks = (days) => {
//     const weeks = [];
//     for (let i = 0; i < days.length; i += 7) {
//       weeks.push(days.slice(i, i + 7));
//     }
//     return weeks;
//   };

//   const applyDateRange = () => {
//     if (!tempRange || tempRange.length !== 2) {
//       message.error("Please select both start and end dates!");
//       return;
//     }
//     const [start, end] = tempRange;
//     let current = start.startOf("day");

//     if (end.diff(start, "day") + 1 > 28) {
//       message.error("Date range cannot exceed 28 days.");
//       return;
//     }

//     const selectedDays = [];
//     while (current.isSameOrBefore(end, "day")) {
//       selectedDays.push(current);
//       current = current.add(1, "day");
//     }

//     setDaysArray(selectedDays);
//     setShowCalendar(false);
//   };

//   const handleCancel = () => {
//     setTempRange([]);
//     setShowCalendar(false);
//   };

//   const weeks = getWeeks(daysArray);

//   const [showCreateTest, setShowCreateTest] = useState(false);
//   const [testForm, setTestForm] = useState({
//     name: "",
//     date: null,
//     region: "",
//     hours: "",
//     shift: "",
//   });

//   const handleCreateTest = () => {
//     const { name, date, region, hours, shift } = testForm;

//     if (!name || !TEST_STYLES[name]) {
//       message.error("Please select a test.");
//       return;
//     }
//     if (!date) {
//       message.error("Please select a start date.");
//       return;
//     }
//     if (date.isBefore(dayjs("2025-08-01"), "day")) {
//       message.error("Start date must be on/after 01-08-2025.");
//       return;
//     }
//     if (!region.includes("-")) {
//       message.error("Please select region and sub item.");
//       return;
//     }
//     const hrs = Number(hours);
//     if (!hrs || hrs <= 0) {
//       message.error("Hours must be positive.");
//       return;
//     }
//     const shiftNum = Number(shift);
//     if (!SHIFT_ORDER.includes(shiftNum)) {
//       message.error("Invalid shift.");
//       return;
//     }

//     const [regionName, subItemName] = region.split("-");

//     let remaining = hrs;
//     let currentDate = date.startOf("day");
//     let currentShift = shiftNum;
//     const toAdd = [];

//     while (remaining > 0) {
//       const allot = Math.min(8, remaining);
//       toAdd.push({
//         date: currentDate,
//         shift: currentShift,
//         region: regionName,
//         subItem: subItemName,
//         test: name,
//         color: TEST_STYLES[name].color,
//         label: TEST_STYLES[name].text,
//         hours: allot,
//       });
//       remaining -= allot;
//       const next = nextShiftAndDate(currentShift, currentDate);
//       currentShift = next.shift;
//       currentDate = next.date;
//     }

//     setEventList((prev) => [...prev, { merged: true, parts: toAdd }]);
//     setShowCreateTest(false);
//     setTestForm({ name: "", date: null, region: "", hours: "", shift: "" });
//   };

//   // 🔹 Customer Witness
//   const [witnessActive, setWitnessActive] = useState(false);
//   const [witnessTests, setWitnessTests] = useState(new Set());

//   const handleToggleWitness = () => {
//     setWitnessActive((prev) => !prev);
//   };

//   const handleToggleStar = (eventKey) => {
//     if (!witnessActive) return;
//     setWitnessTests((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(eventKey)) newSet.delete(eventKey);
//       else newSet.add(eventKey);
//       return newSet;
//     });
//   };

//   // 🔹 Split Event Logic
//   const [splitActive, setSplitActive] = useState(false);

//   const handleToggleSplit = () => {
//     setSplitActive((prev) => !prev);
//   };

//   // ---- New split modal state (minimal additions) ----
//   const [splitModalVisible, setSplitModalVisible] = useState(false);
//   const [splitPercent, setSplitPercent] = useState(50); // 1..99
//   const [splitSide, setSplitSide] = useState("left"); // 'left' or 'right'
//   const [eventToSplit, setEventToSplit] = useState(null);
//   // ----------------------------------------------------

//   const handleSplitEvent = (eventKey, mergedEvent) => {
//     // mergedEvent may be a shallow copy (for a week slice) with _original pointing to the real full event.
//     const fullEvent =
//       mergedEvent._original ||
//       eventList.find(
//         (ev) =>
//           ev.merged &&
//           ev.parts[0].date.isSame(
//             (mergedEvent.parts &&
//               mergedEvent.parts[0] &&
//               mergedEvent.parts[0].date) ||
//               mergedEvent.parts[0].date,
//             "day"
//           ) &&
//           ev.parts[0].shift === mergedEvent.parts[0].shift &&
//           ev.parts[0].region === mergedEvent.parts[0].region &&
//           ev.parts[0].subItem === mergedEvent.parts[0].subItem &&
//           ev.parts[0].test === mergedEvent.parts[0].test
//       );

//     if (!fullEvent) return;

//     // If already split, keep original reset behavior (confirm reset)
//     if (fullEvent.split) {
//       Modal.confirm({
//         title: "Reset Split",
//         content:
//           "This event is already split. Do you want to reset it back to original?",
//         onOk: () => {
//           setEventList((prev) =>
//             prev.map((ev) =>
//               ev === fullEvent ? { ...ev, split: false, splitAt: null } : ev
//             )
//           );
//           message.success("Event reset to original!");
//         },
//         onCancel: () => {
//           message.info("This is not able to split because it is already split.");
//         },
//       });
//       return;
//     }

//     // Open the percentage split modal for this event
//     setEventToSplit(fullEvent);
//     setSplitPercent(50);
//     setSplitSide("left");
//     setSplitModalVisible(true);
//   };

//   // Apply the split chosen in modal: compute left hours (splitAt) and set on the full event
//   const applySplitFromModal = () => {
//     const fullEvent = eventToSplit;
//     if (!fullEvent) {
//       setSplitModalVisible(false);
//       return;
//     }

//     const totalHours = fullEvent.parts.reduce((s, p) => s + p.hours, 0);
//     // compute left hours according to selected side+percent
//     const pct = Math.max(1, Math.min(99, Number(splitPercent || 50)));
//     let leftHours;
//     if (splitSide === "left") {
//       leftHours = Math.round((totalHours * pct) / 100);
//     } else {
//       const rightHours = Math.round((totalHours * pct) / 100);
//       leftHours = totalHours - rightHours;
//     }

//     // ensure at least 1 hour on each side and not exceed total
//     if (leftHours < 1) leftHours = 1;
//     if (leftHours > totalHours - 1) leftHours = totalHours - 1;

//     // final sanity: ensure sum equals totalHours
//     const rightHoursFinal = totalHours - leftHours;

//     if (leftHours <= 0 || rightHoursFinal <= 0) {
//       message.error("Split results in invalid hour distribution. Choose different percentage.");
//       return;
//     }

//     setEventList((prev) =>
//       prev.map((ev) =>
//         ev === fullEvent ? { ...ev, split: true, splitAt: leftHours } : ev
//       )
//     );

//     setSplitModalVisible(false);
//     setEventToSplit(null);
//     message.success(
//       `Test split applied: left ${leftHours}h / right ${rightHoursFinal}h (${pct}% on ${splitSide})`
//     );
//   };

//   return (
//     <div className="monthly-grid-container">
//       <h2 className="title">Monthly Data</h2>

//       <div className="buttons">
//         <button
//           onClick={handleToggleWitness}
//           style={{ position: "relative", paddingRight: "20px" }}
//         >
//           Add Customer Witness
//           {witnessActive && <span className="witness-dot"></span>}
//         </button>

//         <button
//           onClick={handleToggleSplit}
//           style={{ position: "relative", paddingRight: "20px" }}
//         >
//           Split Selected Vertically
//           {splitActive && <span className="witness-dot"></span>}
//         </button>

//         <button onClick={() => setShowCalendar(true)}>Calendar</button>
//         <button onClick={() => setShowCreateTest(true)}>Create Test</button>
//         <button>Delete Test</button>
//       </div>

//       {/* Calendar Modal */}
//       <Modal
//         title="Select Date Range"
//         open={showCalendar}
//         onOk={applyDateRange}
//         onCancel={handleCancel}
//         okText="OK"
//       >
//         <RangePicker
//           value={tempRange}
//           onChange={(values) => setTempRange(values || [])}
//           defaultPickerValue={[dayjs("2025-08-01"), dayjs("2025-08-01")]}
//           disabledDate={(current) =>
//             current && current.isBefore(dayjs("2025-08-01"), "day")
//           }
//         />
//       </Modal>

//       {/* Create Test Modal */}
//       <Modal
//         title="Create Test"
//         open={showCreateTest}
//         onOk={handleCreateTest}
//         onCancel={() => setShowCreateTest(false)}
//         okText="Create"
//         className="create-test-modal"
//       >
//         <div className="form-group">
//           <label>Name of the Test</label>
//           <select
//             className="form-control"
//             value={testForm.name}
//             onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
//           >
//             <option value="">Select Test</option>
//             <option value="SfraA1">SfraA1</option>
//             <option value="SfraA2">SfraA2</option>
//             <option value="TestA1">TestA1</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Date to Start</label>
//           <DatePicker
//             value={testForm.date}
//             onChange={(date) => setTestForm({ ...testForm, date })}
//             disabledDate={(current) =>
//               current && current.isBefore(dayjs("2025-08-01"), "day")
//             }
//             className="form-control"
//           />
//         </div>

//         <div className="form-group">
//           <label>Region</label>
//           <select
//             className="form-control"
//             value={testForm.region}
//             onChange={(e) =>
//               setTestForm({ ...testForm, region: e.target.value })
//             }
//           >
//             <option value="">Select Region</option>
//             {regions.map((reg) => (
//               <optgroup key={reg.name} label={reg.name}>
//                 {reg.subItems.map((sub) => (
//                   <option key={`${reg.name}-${sub}`} value={`${reg.name}-${sub}`}>
//                     {sub}
//                   </option>
//                 ))}
//               </optgroup>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Test Hours</label>
//           <input
//             type="number"
//             className="form-control"
//             value={testForm.hours}
//             onChange={(e) =>
//               setTestForm({ ...testForm, hours: parseInt(e.target.value, 10) })
//             }
//             placeholder="Enter hours"
//             min={1}
//           />
//         </div>

//         <div className="form-group">
//           <label>Shift</label>
//           <select
//             className="form-control"
//             value={testForm.shift}
//             onChange={(e) =>
//               setTestForm({ ...testForm, shift: e.target.value })
//             }
//           >
//             <option value="">Select Shift</option>
//             <option value="3">3</option>
//             <option value="1">1</option>
//             <option value="2">2</option>
//           </select>
//         </div>
//       </Modal>

//       {/* Split-percentage Modal (new) */}
//       <Modal
//         title={
//           eventToSplit
//             ? `Split "${eventToSplit.parts[0].label || eventToSplit.parts[0].test}"`
//             : "Split Test"
//         }
//         open={splitModalVisible}
//         onOk={applySplitFromModal}
//         onCancel={() => {
//           setSplitModalVisible(false);
//           setEventToSplit(null);
//         }}
//         okText="Apply Split"
//       >
//         <div style={{ marginBottom: 12 }}>
//           <div style={{ marginBottom: 8 }}>
//             <strong>Choose percentage (1 - 99)</strong>
//           </div>
//           <Slider
//             min={1}
//             max={99}
//             value={splitPercent}
//             onChange={(val) => setSplitPercent(val)}
//             tooltipVisible
//           />
//           <div style={{ marginTop: 8, textAlign: "center" }}>
//             <span style={{ fontWeight: 600 }}>{splitPercent}%</span>
//           </div>
//         </div>

//         <div style={{ marginTop: 8 }}>
//           <div style={{ marginBottom: 8 }}>
//             <strong>Apply percentage to</strong>
//           </div>
//           <Radio.Group
//             onChange={(e) => setSplitSide(e.target.value)}
//             value={splitSide}
//           >
//             <Radio value="left">Left</Radio>
//             <Radio value="right">Right</Radio>
//           </Radio.Group>
//         </div>

//         <div style={{ marginTop: 12, color: "#666", fontSize: 13 }}>
//           <div>
//             Example: if total hours = 24 and you choose <b>{splitPercent}%</b> on{" "}
//             <b>{splitSide}</b>, distribution will be computed in hours and stored.
//           </div>
//         </div>
//       </Modal>

//       {weeks.length > 0 ? (
//         weeks.map((weekDays, weekIdx) => (
//           <table className="schedule-table" key={weekIdx}>
//             <thead>
//               <tr>
//                 <th rowSpan="3" className="region-col">
//                   Region
//                 </th>
//                 <th rowSpan="3" className="sub-col">
//                   Sub Item
//                 </th>
//                 {weekDays.map((d, i) => (
//                   <th key={i} colSpan={shifts.length} className="day-header">
//                     {d.format("dddd")}
//                   </th>
//                 ))}
//               </tr>
//               <tr>
//                 {weekDays.map((d, i) => (
//                   <th key={i} colSpan={shifts.length} className="date-cell">
//                     {d.format("DD-MM")}
//                   </th>
//                 ))}
//               </tr>
//               <tr className="shift-row">
//                 {weekDays.map((_, i) =>
//                   shifts.map((s, idx) => (
//                     <th
//                       key={`${i}-${s}`}
//                       className={`shift-cell ${idx === 2 ? "black-separator" : ""}`}
//                     >
//                       {s}
//                     </th>
//                   ))
//                 )}
//               </tr>
//             </thead>

//             <tbody>
//               {regions.map((region) =>
//                 region.subItems.map((sub, i) => (
//                   <tr key={`${region.name}-${sub}`}>
//                     {i === 0 && (
//                       <td rowSpan={region.subItems.length} className="region-name">
//                         {region.name}
//                       </td>
//                     )}
//                     <td className="sub-name">{sub}</td>

//                     {weekDays.map((d, dayIdx) =>
//                       shifts.map((s, shiftIdx) => {
//                         // === NEW merged-event selection (robust & week-sliced) ===
//                         let mergedEvent = null;

//                         // find any event that contains a part for this exact cell
//                         const evContaining = eventList.find((ev) =>
//                           ev.merged &&
//                           ev.parts.some(
//                             (p) =>
//                               p.date.isSame(d, "day") &&
//                               p.shift === s &&
//                               p.region === region.name &&
//                               p.subItem === sub
//                           )
//                         );

//                         if (evContaining) {
//                           // limit rendering to the contiguous parts that fall inside this WEEK
//                           const currentWeekStart = weekDays[0];
//                           const currentWeekEnd = weekDays[weekDays.length - 1];

//                           // get indices of all parts that fall inside this week
//                           const indicesInWeek = evContaining.parts
//                             .map((p, idx) => ({ p, idx }))
//                             .filter(
//                               ({ p }) =>
//                                 !p.date.isBefore(currentWeekStart, "day") &&
//                                 !p.date.isAfter(currentWeekEnd, "day")
//                             )
//                             .map(({ idx }) => idx);

//                           if (indicesInWeek.length > 0) {
//                             const firstWeekPartIdx = indicesInWeek[0];
//                             const lastWeekPartIdx = indicesInWeek[indicesInWeek.length - 1];

//                             // index of this specific cell inside the event parts
//                             const currentPartIndex = evContaining.parts.findIndex(
//                               (p) =>
//                                 p.date.isSame(d, "day") &&
//                                 p.shift === s &&
//                                 p.region === region.name &&
//                                 p.subItem === sub
//                             );

//                             // Only render a merged block at the FIRST visible part inside the week
//                             if (currentPartIndex === firstWeekPartIdx) {
//                               const partsFromHere = evContaining.parts.slice(
//                                 firstWeekPartIdx,
//                                 lastWeekPartIdx + 1
//                               );
//                               mergedEvent = { ...evContaining, parts: partsFromHere, _original: evContaining };
//                             }
//                             // otherwise: this cell is inside the block but not the first visible part -> we will return null later
//                           }
//                         }

//                         // === end merged-event selection ===

//                         if (mergedEvent) {
//                           const totalCells = mergedEvent.parts.length;
//                           const totalHours = mergedEvent.parts.reduce(
//                             (sum, p) => sum + p.hours,
//                             0
//                           );
//                           const firstPart = mergedEvent.parts[0];

//                           const lastPart =
//                             mergedEvent.parts[mergedEvent.parts.length - 1];
//                           const coversShift2 = lastPart && lastPart.shift === 2;

                          
//                           const originalEv = mergedEvent._original || mergedEvent;
//                           const eventKey = `${region.name}-${sub}-${originalEv.parts[0].date.format(
//                             "YYYY-MM-DD"
//                           )}-${originalEv.parts[0].test}`;

//                           // handle split rendering: show split only if the global split point falls inside THIS visible slice
//                           const isSplit = Boolean(originalEv.split);
//                           const splitAtGlobal = originalEv.splitAt ?? null;

//                           let shouldRenderSplitHere = false;
//                           let leftPct = 50;
//                           let rightPct = 50;

//                           if (isSplit && splitAtGlobal != null) {
//                             // find index of mergedEvent.parts[0] inside the original event
//                             const idxInOriginal = originalEv.parts.findIndex(
//                               (p) =>
//                                 p.date.isSame(firstPart.date, "day") &&
//                                 p.shift === firstPart.shift &&
//                                 p.region === firstPart.region &&
//                                 p.subItem === firstPart.subItem &&
//                                 p.test === firstPart.test
//                             );

//                             // prefix hours before this visible slice
//                             let prefixHours = 0;
//                             for (let k = 0; k < idxInOriginal; k++) {
//                               prefixHours += originalEv.parts[k].hours;
//                             }

//                             const sliceHours = mergedEvent.parts.reduce((s, p) => s + p.hours, 0);

//                             // split point lies inside this slice?
//                             if (splitAtGlobal > prefixHours && splitAtGlobal < prefixHours + sliceHours) {
//                               shouldRenderSplitHere = true;
//                               const localSplitHours = splitAtGlobal - prefixHours;
//                               leftPct = (localSplitHours / sliceHours) * 100;
//                               rightPct = 100 - leftPct;
//                             } else {
//                               shouldRenderSplitHere = false;
//                             }
//                           }

//                           if (isSplit && shouldRenderSplitHere) {
//                             const colorLeft = mergedEvent.parts[0].color;
//                             const colorRight = mergedEvent.parts[0].color;

//                             const leftKey = `${eventKey}-left`;
//                             const rightKey = `${eventKey}-right`;

//                             return (
//                               <td
//                                 key={`${dayIdx}-${s}`}
//                                 colSpan={totalCells}
//                                 className={`cell shift-cell ${coversShift2 ? "black-separator" : ""}`}
//                                 style={{ padding: 0 }}
//                               >
//                                 <div
//                                   style={{
//                                     display: "flex",
//                                     width: `${(totalHours / (8 * totalCells)) * 100}%`,
//                                     height: "100%",
//                                   }}
//                                 >
//                                   <div
//                                     onClick={() => {
//                                       if (witnessActive) handleToggleStar(leftKey);
//                                       if (splitActive) handleSplitEvent(eventKey, mergedEvent);
//                                     }}
//                                     style={{
//                                       width: `${leftPct}%`,
//                                       height: "100%",
//                                       display: "flex",
//                                       alignItems: "center",
//                                       justifyContent: "center",
//                                       backgroundColor: colorLeft,
//                                       boxSizing: "border-box",
//                                       textAlign: "center",
//                                       borderRadius: "4px",
//                                       cursor:
//                                         witnessActive || splitActive ? "pointer" : "default",
//                                     }}
//                                   >
//                                     <span className="event-text">
//                                       {firstPart.label}
//                                       {witnessTests.has(leftKey) && (
//                                         <span className="event-star">⭐</span>
//                                       )}
//                                     </span>
//                                   </div>

//                                   <div
//                                     onClick={() => {
//                                       if (witnessActive) handleToggleStar(rightKey);
//                                       if (splitActive) handleSplitEvent(eventKey, mergedEvent);
//                                     }}
//                                     style={{
//                                       width: `${rightPct}%`,
//                                       height: "100%",
//                                       display: "flex",
//                                       alignItems: "center",
//                                       justifyContent: "center",
//                                       backgroundColor: colorRight,
//                                       boxSizing: "border-box",
//                                       textAlign: "center",
//                                       borderRadius: "4px",
//                                       borderLeft: "1px solid black",
//                                       cursor:
//                                         witnessActive || splitActive ? "pointer" : "default",
//                                     }}
//                                   >
//                                     <span className="event-text">
//                                       {firstPart.label}
//                                       {witnessTests.has(rightKey) && (
//                                         <span className="event-star">⭐</span>
//                                       )}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </td>
//                             );
//                           }

//                           return (
//                             <td
//                               key={`${dayIdx}-${s}`}
//                               colSpan={totalCells}
//                               className={`cell shift-cell ${
//                                 coversShift2 ? "black-separator" : ""
//                               }`}
//                             >
//                               <div
//                                 className="event-block"
//                                 style={{
//                                   backgroundColor: firstPart.color,
//                                   color: "black",
//                                   height: "100%",
//                                   width: `${(totalHours / (8 * totalCells)) * 100}%`,
//                                   textAlign: "left",
//                                   cursor:
//                                     witnessActive || splitActive ? "pointer" : "default",
//                                 }}
//                                 onClick={() => {
//                                   if (witnessActive) handleToggleStar(eventKey);
//                                   if (splitActive) handleSplitEvent(eventKey, mergedEvent);
//                                 }}
//                               >
//                                 <span className="event-text">
//                                   {firstPart.label}
//                                   {witnessTests.has(eventKey) && (
//                                     <span className="event-star">⭐</span>
//                                   )}
//                                 </span>
//                               </div>
//                             </td>
//                           );
//                         }

//                         const insideSpan = eventList.some(
//                           (ev) =>
//                             ev.merged &&
//                             ev.parts.some(
//                               (p) =>
//                                 p.date.isSame(d, "day") &&
//                                 p.shift === s &&
//                                 p.region === region.name &&
//                                 p.subItem === sub
//                             )
//                         );
//                         if (insideSpan) return null;

//                         return (
//                           <td
//                             key={`${dayIdx}-${s}`}
//                             className={`cell shift-cell ${
//                               shiftIdx === 2 ? "black-separator" : ""
//                             }`}
//                           />
//                         );
//                       })
//                     )}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         ))
//       ) : (
//         <p>No dates to show</p>
//       )}
//     </div>
//   );
// }

// export default MonthlyDataGrid;


import React, { useState } from "react";
import { DatePicker, Modal, message, Slider, Radio } from "antd";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "./MonthlyDataGrid.css";

dayjs.extend(isSameOrBefore);

const { RangePicker } = DatePicker;

const regions = [
  { name: "EHV", subItems: ["Impulse", "LMS", "Others"] },
  { name: "NORTH", subItems: ["Impulse", "LMS", "Others"] },
  { name: "SOUTH", subItems: ["Impulse", "LMS", "Others"] },
];

const shifts = [3, 1, 2];

const TEST_STYLES = {
  SfraA1: { color: "red", text: "SfraA1" },
  SfraA2: { color: "yellow", text: "SfraA2" },
  TestA1: { color: "lightblue", text: "Test A1" },
};

const SHIFT_ORDER = [3, 1, 2];
const nextShiftAndDate = (shift, date) => {
  const idx = SHIFT_ORDER.indexOf(shift);
  if (idx === -1 || idx === SHIFT_ORDER.length - 1) {
    return { shift: SHIFT_ORDER[0], date: date.add(1, "day") };
  }
  return { shift: SHIFT_ORDER[idx + 1], date };
};

function MonthlyDataGrid() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [tempRange, setTempRange] = useState([]);
  const [eventList, setEventList] = useState([]);

  const [daysArray, setDaysArray] = useState(() => {
    const base = dayjs("2025-11-01");
    return Array.from({ length: base.daysInMonth() }, (_, i) =>
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

  const applyDateRange = () => {
    if (!tempRange || tempRange.length !== 2) {
      message.error("Please select both start and end dates!");
      return;
    }
    const [start, end] = tempRange;
    let current = start.startOf("day");

    if (end.diff(start, "day") + 1 > 28) {
      message.error("Date range cannot exceed 28 days.");
      return;
    }

    const selectedDays = [];
    while (current.isSameOrBefore(end, "day")) {
      selectedDays.push(current);
      current = current.add(1, "day");
    }

    setDaysArray(selectedDays);
    setShowCalendar(false);
  };

  const handleCancel = () => {
    setTempRange([]);
    setShowCalendar(false);
  };

  const weeks = getWeeks(daysArray);

  const [showCreateTest, setShowCreateTest] = useState(false);
  const [testForm, setTestForm] = useState({
    name: "",
    date: null,
    region: "",
    hours: "",
    shift: "",
  });

  const handleCreateTest = () => {
    const { name, date, region, hours, shift } = testForm;

    if (!name || !TEST_STYLES[name]) {
      message.error("Please select a test.");
      return;
    }
    if (!date) {
      message.error("Please select a start date.");
      return;
    }
    if (date.isBefore(dayjs("2025-09-01"), "day")) {
      message.error("Start date must be on/after 01-08-2025.");
      return;
    }
    if (!region.includes("-")) {
      message.error("Please select region and sub item.");
      return;
    }
    const hrs = Number(hours);
    if (!hrs || hrs <= 0) {
      message.error("Hours must be positive.");
      return;
    }
    const shiftNum = Number(shift);
    if (!SHIFT_ORDER.includes(shiftNum)) {
      message.error("Invalid shift.");
      return;
    }

    const [regionName, subItemName] = region.split("-");

    let remaining = hrs;
    let currentDate = date.startOf("day");
    let currentShift = shiftNum;
    const toAdd = [];

    while (remaining > 0) {
      const allot = Math.min(8, remaining);
      toAdd.push({
        date: currentDate,
        shift: currentShift,
        region: regionName,
        subItem: subItemName,
        test: name,
        color: TEST_STYLES[name].color,
        label: TEST_STYLES[name].text,
        hours: allot,
      });
      remaining -= allot;
      const next = nextShiftAndDate(currentShift, currentDate);
      currentShift = next.shift;
      currentDate = next.date;
    }

    setEventList((prev) => [...prev, { merged: true, parts: toAdd }]);
    setShowCreateTest(false);
    setTestForm({ name: "", date: null, region: "", hours: "", shift: "" });
  };

  // 🔹 Customer Witness
  const [witnessActive, setWitnessActive] = useState(false);
  const [witnessTests, setWitnessTests] = useState(new Set());

  const handleToggleWitness = () => {
    setWitnessActive((prev) => !prev);
  };

  const handleToggleStar = (eventKey) => {
    if (!witnessActive) return;
    setWitnessTests((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventKey)) newSet.delete(eventKey);
      else newSet.add(eventKey);
      return newSet;
    });
  };

  // 🔹 Split Event Logic
  

  const [splitActive, setSplitActive] = useState(false);

  const handleToggleSplit = () => {
    setSplitActive((prev) => !prev);
  };

  // ---- split modal state ----
  const [splitModalVisible, setSplitModalVisible] = useState(false);
  const [splitPercent, setSplitPercent] = useState(50); 
  const [splitSide, setSplitSide] = useState("left"); 
  const [eventToSplit, setEventToSplit] = useState(null);

  const handleSplitEvent = (eventKey, mergedEvent) => {
    const fullEvent =
      mergedEvent._original ||
      eventList.find(
        (ev) =>
          ev.merged &&
          ev.parts[0].date.isSame(
            (mergedEvent.parts &&
              mergedEvent.parts[0] &&
              mergedEvent.parts[0].date) ||
              mergedEvent.parts[0].date,
            "day"
          ) &&
          ev.parts[0].shift === mergedEvent.parts[0].shift &&
          ev.parts[0].region === mergedEvent.parts[0].region &&
          ev.parts[0].subItem === mergedEvent.parts[0].subItem &&
          ev.parts[0].test === mergedEvent.parts[0].test
      );

    if (!fullEvent) return;

    if (fullEvent.split) {
      Modal.confirm({
        title: "Reset Split",
        content:
          "This event is already split. Do you want to reset it back to original?",
        onOk: () => {
          setEventList((prev) =>
            prev.map((ev) =>
              ev === fullEvent ? { ...ev, split: false, splitAt: null } : ev
            )
          );
          message.success("Event reset to original!");
        },
        onCancel: () => {
          message.info("This is not able to split because it is already split.");
        },
      });
      return;
    }

    setEventToSplit(fullEvent);
    setSplitPercent(50);
    setSplitSide("left");
    setSplitModalVisible(true);
  };

  const applySplitFromModal = () => {
    const fullEvent = eventToSplit;
    if (!fullEvent) {
      setSplitModalVisible(false);
      return;
    }

    const totalHours = fullEvent.parts.reduce((s, p) => s + p.hours, 0);
    const pct = Math.max(1, Math.min(99, Number(splitPercent || 50)));
    let leftHours;
    if (splitSide === "left") {
      leftHours = Math.round((totalHours * pct) / 100);
    } else {
      const rightHours = Math.round((totalHours * pct) / 100);
      leftHours = totalHours - rightHours;
    }

    if (leftHours < 1) leftHours = 1;
    if (leftHours > totalHours - 1) leftHours = totalHours - 1;

    const rightHoursFinal = totalHours - leftHours;

    if (leftHours <= 0 || rightHoursFinal <= 0) {
      message.error("Split results in invalid hour distribution. Choose different percentage.");
      return;
    }

    setEventList((prev) =>
      prev.map((ev) =>
        ev === fullEvent ? { ...ev, split: true, splitAt: leftHours } : ev
      )
    );

    setSplitModalVisible(false);
    setEventToSplit(null);
    message.success(
      `Test split applied: left ${leftHours}h / right ${rightHoursFinal}h (${pct}% on ${splitSide})`
    );
  };

  // ⭐ Manual Drag/Drop state
  const [dragModalVisible, setDragModalVisible] = useState(false);
  const [eventToMove, setEventToMove] = useState(null);
  const [dragForm, setDragForm] = useState({
    date: null,
    region: "",
    shift: "",
  });

  const handleEventDoubleClick = (mergedEvent) => {
    const p0 = mergedEvent.parts[0];
    setEventToMove(mergedEvent);
    setDragForm({
      date: p0.date,
      region: `${p0.region}-${p0.subItem}`,
      shift: String(p0.shift),
    });
    setDragModalVisible(true);
  };

  // ✅ FIX: re-sequence parts when moving so block length stays constant (prevents extra cells)
  const handleApplyDragDrop = () => {
    if (!eventToMove) return;

    const { date, region, shift } = dragForm;
    if (!date || !region || !shift) {
      message.error("Please fill all fields before applying.");
      return;
    }

    const [regionName, subItemName] = region.split("-");
    const shiftNum = Number(shift);

    setEventList((prev) =>
      prev.map((ev) => {
        if (ev === eventToMove._original || ev === eventToMove) {
          let newParts = [];
          let curDate = date.startOf("day");
          let curShift = shiftNum;
          for (let i = 0; i < ev.parts.length; i++) {
            newParts.push({
              ...ev.parts[i],
              date: curDate,
              shift: curShift,
              region: regionName,
              subItem: subItemName,
            });
            const next = nextShiftAndDate(curShift, curDate);
            curDate = next.date;
            curShift = next.shift;
          }
          return { ...ev, parts: newParts };
        }
        return ev;
      })
    );

    setDragModalVisible(false);
    setEventToMove(null);
    message.success("✅ Event moved successfully!");
  };

  return (
    <div className="monthly-grid-container">
      <h2 className="title">Monthly Data</h2>

      <div className="buttons">
        <button
          onClick={handleToggleWitness}
          style={{ position: "relative", paddingRight: "20px" }}
        >
          Add Customer Witness
          {witnessActive && <span className="witness-dot"></span>}
        </button>

        <button
          onClick={handleToggleSplit}
          style={{ position: "relative", paddingRight: "20px" }}
        >
          Split Selected Vertically
          {splitActive && <span className="witness-dot"></span>}
        </button>

        <button onClick={() => setShowCalendar(true)}>Calendar</button>
        <button onClick={() => setShowCreateTest(true)}>Create Test</button>
        <button>Delete Test</button>
      </div>

      {/* Calendar Modal */}
      <Modal
        title="Select Date Range"
        open={showCalendar}
        onOk={applyDateRange}
        onCancel={handleCancel}
        okText="OK"
      >
        <RangePicker
          value={tempRange}
          onChange={(values) => setTempRange(values || [])}
          defaultPickerValue={[dayjs("2025-08-01"), dayjs("2025-08-01")]}
          disabledDate={(current) =>
            current && current.isBefore(dayjs("2025-08-01"), "day")
          }
        />
      </Modal>

      {/* Create Test Modal */}
      <Modal
        title="Create Test"
        open={showCreateTest}
        onOk={handleCreateTest}
        onCancel={() => setShowCreateTest(false)}
        okText="Create"
        className="create-test-modal"
      >
        <div className="form-group">
          <label>Name of the Test</label>
          <select
            className="form-control"
            value={testForm.name}
            onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
          >
            <option value="">Select Test</option>
            <option value="SfraA1">SfraA1</option>
            <option value="SfraA2">SfraA2</option>
            <option value="TestA1">TestA1</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date to Start</label>
          <DatePicker
            value={testForm.date}
            onChange={(date) => setTestForm({ ...testForm, date })}
            disabledDate={(current) =>
              current && current.isBefore(dayjs("2025-08-01"), "day")
            }
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Region</label>
          <select
            className="form-control"
            value={testForm.region}
            onChange={(e) =>
              setTestForm({ ...testForm, region: e.target.value })
            }
          >
            <option value="">Select Region</option>
            {regions.map((reg) => (
              <optgroup key={reg.name} label={reg.name}>
                {reg.subItems.map((sub) => (
                  <option key={`${reg.name}-${sub}`} value={`${reg.name}-${sub}`}>
                    {sub}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Test Hours</label>
          <input
            type="number"
            className="form-control"
            value={testForm.hours}
            onChange={(e) =>
              setTestForm({ ...testForm, hours: parseInt(e.target.value, 10) })
            }
            placeholder="Enter hours"
            min={1}
          />
        </div>

        <div className="form-group">
          <label>Shift</label>
          <select
            className="form-control"
            value={testForm.shift}
            onChange={(e) =>
              setTestForm({ ...testForm, shift: e.target.value })
            }
          >
            <option value="">Select Shift</option>
            <option value="3">3</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
      </Modal>

      {/* Split-percentage Modal (new) */}
      <Modal
        title={
          eventToSplit
            ? `Split "${eventToSplit.parts[0].label || eventToSplit.parts[0].test}"`
            : "Split Test"
        }
        open={splitModalVisible}
        onOk={applySplitFromModal}
        onCancel={() => {
          setSplitModalVisible(false);
          setEventToSplit(null);
        }}
        okText="Apply Split"
      >
        <div style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 8 }}>
            <strong>Choose percentage (1 - 99)</strong>
          </div>
          <Slider
            min={1}
            max={99}
            value={splitPercent}
            onChange={(val) => setSplitPercent(val)}
            tooltipVisible
          />
          <div style={{ marginTop: 8, textAlign: "center" }}>
            <span style={{ fontWeight: 600 }}>{splitPercent}%</span>
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <div style={{ marginBottom: 8 }}>
            <strong>Apply percentage to</strong>
          </div>
          <Radio.Group
            onChange={(e) => setSplitSide(e.target.value)}
            value={splitSide}
          >
            <Radio value="left">Left</Radio>
            <Radio value="right">Right</Radio>
          </Radio.Group>
        </div>

        <div style={{ marginTop: 12, color: "#666", fontSize: 13 }}>
          <div>
            Example: if total hours = 24 and you choose <b>{splitPercent}%</b> on{" "}
            <b>{splitSide}</b>, distribution will be computed in hours and stored.
          </div>
        </div>
      </Modal>

      {/* ⭐ Manual Drag & Drop Modal */}
      <Modal
        title={
          eventToMove
            ? `Move "${eventToMove.parts[0].label || eventToMove.parts[0].test}" to…`
            : "Move Event"
        }
        open={dragModalVisible}
        onOk={handleApplyDragDrop}
        onCancel={() => setDragModalVisible(false)}
        okText="Apply"
        cancelText="Cancel"
      >
        <div className="form-group">
          <label>Date to Drag and Drop</label>
          <DatePicker
            value={dragForm.date}
            onChange={(val) => setDragForm({ ...dragForm, date: val })}
            style={{ width: "100%" }}
          />
        </div>

        <div className="form-group" style={{ marginTop: 10 }}>
          <label>Region</label>
          <select
            className="form-control"
            value={dragForm.region}
            onChange={(e) => setDragForm({ ...dragForm, region: e.target.value })}
          >
            <option value="">Select Region</option>
            {regions.map((reg) => (
              <optgroup key={reg.name} label={reg.name}>
                {reg.subItems.map((sub) => (
                  <option key={`${reg.name}-${sub}`} value={`${reg.name}-${sub}`}>
                    {sub}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginTop: 10 }}>
          <label>Shift</label>
          <select
            className="form-control"
            value={dragForm.shift}
            onChange={(e) => setDragForm({ ...dragForm, shift: e.target.value })}
          >
            <option value="">Select Shift</option>
            <option value="3">3</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
      </Modal>

      {weeks.length > 0 ? (
        weeks.map((weekDays, weekIdx) => (
          <table className="schedule-table" key={weekIdx}>
            <thead>
              <tr>
                <th rowSpan="3" className="region-col">
                  Region
                </th>
                <th rowSpan="3" className="sub-col">
                  Sub Item
                </th>
                {weekDays.map((d, i) => (
                  <th key={i} colSpan={shifts.length} className="day-header">
                    {d.format("dddd")}
                  </th>
                ))}
              </tr>
              <tr>
                {weekDays.map((d, i) => (
                  <th key={i} colSpan={shifts.length} className="date-cell">
                    {d.format("DD-MM")}
                  </th>
                ))}
              </tr>
              <tr className="shift-row">
                {weekDays.map((_, i) =>
                  shifts.map((s, idx) => (
                    <th
                      key={`${i}-${s}`}
                      className={`shift-cell ${idx === 2 ? "black-separator" : ""}`}
                    >
                      {s}
                    </th>
                  ))
                )}
              </tr>
            </thead>

            <tbody>
              {regions.map((region) =>
                region.subItems.map((sub, i) => (
                  <tr key={`${region.name}-${sub}`}>
                    {i === 0 && (
                      <td rowSpan={region.subItems.length} className="region-name">
                        {region.name}
                      </td>
                    )}
                    <td className="sub-name">{sub}</td>

                    {weekDays.map((d, dayIdx) =>
                      shifts.map((s, shiftIdx) => {
                        let mergedEvent = null;

                        const evContaining = eventList.find((ev) =>
                          ev.merged &&
                          ev.parts.some(
                            (p) =>
                              p.date.isSame(d, "day") &&
                              p.shift === s &&
                              p.region === region.name &&
                              p.subItem === sub
                          )
                        );

                        if (evContaining) {
                          const currentWeekStart = weekDays[0];
                          const currentWeekEnd = weekDays[weekDays.length - 1];

                          const indicesInWeek = evContaining.parts
                            .map((p, idx) => ({ p, idx }))
                            .filter(
                              ({ p }) =>
                                !p.date.isBefore(currentWeekStart, "day") &&
                                !p.date.isAfter(currentWeekEnd, "day")
                            )
                            .map(({ idx }) => idx);

                          if (indicesInWeek.length > 0) {
                            const firstWeekPartIdx = indicesInWeek[0];
                            const lastWeekPartIdx = indicesInWeek[indicesInWeek.length - 1];

                            const currentPartIndex = evContaining.parts.findIndex(
                              (p) =>
                                p.date.isSame(d, "day") &&
                                p.shift === s &&
                                p.region === region.name &&
                                p.subItem === sub
                            );

                            if (currentPartIndex === firstWeekPartIdx) {
                              const partsFromHere = evContaining.parts.slice(
                                firstWeekPartIdx,
                                lastWeekPartIdx + 1
                              );
                              mergedEvent = { ...evContaining, parts: partsFromHere, _original: evContaining };
                            }
                          }
                        }

                        if (mergedEvent) {
                          const totalCells = mergedEvent.parts.length;
                          const totalHours = mergedEvent.parts.reduce(
                            (sum, p) => sum + p.hours,
                            0
                          );
                          const firstPart = mergedEvent.parts[0];

                          const lastPart =
                            mergedEvent.parts[mergedEvent.parts.length - 1];
                          const coversShift2 = lastPart && lastPart.shift === 2;

                          const originalEv = mergedEvent._original || mergedEvent;
                          const eventKey = `${region.name}-${sub}-${originalEv.parts[0].date.format(
                            "YYYY-MM-DD"
                          )}-${originalEv.parts[0].test}`;

                          const isSplit = Boolean(originalEv.split);
                          const splitAtGlobal = originalEv.splitAt ?? null;

                          let shouldRenderSplitHere = false;
                          let leftPct = 50;
                          let rightPct = 50;

                          if (isSplit && splitAtGlobal != null) {
                            const idxInOriginal = originalEv.parts.findIndex(
                              (p) =>
                                p.date.isSame(firstPart.date, "day") &&
                                p.shift === firstPart.shift &&
                                p.region === firstPart.region &&
                                p.subItem === firstPart.subItem &&
                                p.test === firstPart.test
                            );

                            let prefixHours = 0;
                            for (let k = 0; k < idxInOriginal; k++) {
                              prefixHours += originalEv.parts[k].hours;
                            }

                            const sliceHours = mergedEvent.parts.reduce((s, p) => s + p.hours, 0);

                            if (splitAtGlobal > prefixHours && splitAtGlobal < prefixHours + sliceHours) {
                              shouldRenderSplitHere = true;
                              const localSplitHours = splitAtGlobal - prefixHours;
                              leftPct = (localSplitHours / sliceHours) * 100;
                              rightPct = 100 - leftPct;
                            } else {
                              shouldRenderSplitHere = false;
                            }
                          }

                          if (isSplit && shouldRenderSplitHere) {
                            const colorLeft = mergedEvent.parts[0].color;
                            const colorRight = mergedEvent.parts[0].color;

                            const leftKey = `${eventKey}-left`;
                            const rightKey = `${eventKey}-right`;

                            return (
                              <td
                                key={`${dayIdx}-${s}`}
                                colSpan={totalCells}
                                className={`cell shift-cell ${coversShift2 ? "black-separator" : ""}`}
                                style={{ padding: 0 }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    width: `${(totalHours / (8 * totalCells)) * 100}%`,
                                    height: "100%",
                                  }}
                                  onDoubleClick={() => handleEventDoubleClick(mergedEvent)}
                                >
                                  <div
                                    onClick={() => {
                                      if (witnessActive) handleToggleStar(leftKey);
                                      if (splitActive) handleSplitEvent(eventKey, mergedEvent);
                                    }}
                                    style={{
                                      width: `${leftPct}%`,
                                      height: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      backgroundColor: colorLeft,
                                      boxSizing: "border-box",
                                      textAlign: "center",
                                      borderRadius: "4px",
                                      cursor:
                                        witnessActive || splitActive ? "pointer" : "default",
                                    }}
                                  >
                                    <span className="event-text">
                                      {firstPart.label}
                                      {witnessTests.has(leftKey) && (
                                        <span className="event-star">⭐</span>
                                      )}
                                    </span>
                                  </div>

                                  <div
                                    onClick={() => {
                                      if (witnessActive) handleToggleStar(rightKey);
                                      if (splitActive) handleSplitEvent(eventKey, mergedEvent);
                                    }}
                                    style={{
                                      width: `${rightPct}%`,
                                      height: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      backgroundColor: colorRight,
                                      boxSizing: "border-box",
                                      textAlign: "center",
                                      borderRadius: "4px",
                                      borderLeft: "1px solid black",
                                      cursor:
                                        witnessActive || splitActive ? "pointer" : "default",
                                    }}
                                  >
                                    <span className="event-text">
                                      {firstPart.label}
                                      {witnessTests.has(rightKey) && (
                                        <span className="event-star">⭐</span>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </td>
                            );
                          }

                          return (
                            <td
                              key={`${dayIdx}-${s}`}
                              colSpan={totalCells}
                              className={`cell shift-cell ${
                                coversShift2 ? "black-separator" : ""
                              }`}
                            >
                              <div
                                className="event-block"
                                style={{
                                  backgroundColor: firstPart.color,
                                  color: "black",
                                  height: "100%",
                                  width: `${(totalHours / (8 * totalCells)) * 100}%`,
                                  textAlign: "left",
                                  cursor:
                                    witnessActive || splitActive ? "pointer" : "default",
                                }}
                                onClick={() => {
                                  if (witnessActive) handleToggleStar(eventKey);
                                  if (splitActive) handleSplitEvent(eventKey, mergedEvent);
                                }}
                                onDoubleClick={() => handleEventDoubleClick(mergedEvent)}
                              >
                                <span className="event-text">
                                  {firstPart.label}
                                  {witnessTests.has(eventKey) && (
                                    <span className="event-star">⭐</span>
                                  )}
                                </span>
                              </div>
                            </td>
                          );
                        }

                        const insideSpan = eventList.some(
                          (ev) =>
                            ev.merged &&
                            ev.parts.some(
                              (p) =>
                                p.date.isSame(d, "day") &&
                                p.shift === s &&
                                p.region === region.name &&
                                p.subItem === sub
                            )
                        );
                        if (insideSpan) return null;

                        return (
                          <td
                            key={`${dayIdx}-${s}`}
                            className={`cell shift-cell ${
                              shiftIdx === 2 ? "black-separator" : ""
                            }`}
                          />
                        );
                      })
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ))
      ) : (
        <p>No dates to show</p>
      )}
    </div>
  );
}

export default MonthlyDataGrid;













































































// // //--------------------------------------- 20-10-2025---------------------

// import React, { useState, useRef, useEffect } from "react";
// import ReactDOM from "react-dom";

// import { DatePicker, Modal, message, Slider, Radio, Anchor } from "antd";
// import dayjs from "dayjs";
// import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
// import { Stage, Layer, Rect, Text ,Group} from "react-konva";
// import "./MonthlyDataGrid.css";


// dayjs.extend(isSameOrBefore);

// const { RangePicker } = DatePicker;

// function KonvaEvent({
//   color,
//   label,
//   widthPercent,
//   hasStar,
//   onClick,
//   isClickable,
//   offsetPercent = 0,
//   borderLeft = false,
//   witnessActive = false,
//   splitActive = false,
//   onDropToDate,
// }) {
//   const containerRef = useRef(null);
//   const stageRef = useRef(null);
//   const [size, setSize] = useState({ w: 0, h: 0 });
//   const [showProp, setShowProp] = useState(false);
//   const [isDraggable, setIsDraggable] = useState(false);
//   const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
//   const [bounds, setBounds] = useState(null);

//   // --- ResizeObserver ---
//   useEffect(() => {
//     if (!containerRef.current) return;
//     const updateSize = () => {
//       const rect = containerRef.current.getBoundingClientRect();
//       setSize({ w: rect.width, h: rect.height });
//     };
//     updateSize();
//     const obs = new ResizeObserver(updateSize);
//     obs.observe(containerRef.current);
//     return () => obs.disconnect();
//   }, []);

//   const blockW = (widthPercent / 100) * size.w || 0;
//   const offsetX = (offsetPercent / 100) * size.w || 0;

//   // --- Bounds calculation ---
//   useEffect(() => {
//     if (!isDraggable) return;
//     const table =
//       containerRef.current?.closest(".schedule-table") ||
//       document.querySelector(".schedule-table");
//     const stageNode = stageRef.current;
//     if (!table || !stageNode) return;

//     const stageRect = stageNode.container().getBoundingClientRect();
//     const shiftRow = table.querySelector("tr.shift-row");
//     const shiftHeads = shiftRow?.querySelectorAll("th.shift-cell");
//     if (!shiftHeads || shiftHeads.length === 0) return;

//     // take first and last columns (01-10-2025 to 07-10-2025)
//     const firstShiftRect = shiftHeads[0].getBoundingClientRect();
//     const lastShiftRect =
//       shiftHeads[shiftHeads.length - 1].getBoundingClientRect();

//     const daysLeftPx = firstShiftRect.left;
//     const daysRightPx = lastShiftRect.right;
//     const totalDaysWidth = daysRightPx - daysLeftPx;
//     const dayWidthPx = totalDaysWidth / 7;

//     const leftEdgeStageX = daysLeftPx - stageRect.left;
//     const rightEdgeStageX = daysRightPx - stageRect.left;

//     // ✅ Extend bounds both backward & forward (entire week)
//     const minX = leftEdgeStageX;
//     const maxX = rightEdgeStageX - blockW;

//     setBounds({ minX, maxX, daysLeftPx, dayWidthPx });
//   }, [isDraggable, size.w, size.h, widthPercent]);

//   // --- Modal logic ---
//   const handleDoubleClick = () => {
//     if (!witnessActive && !splitActive) setShowProp(true);
//   };

//   const handleYes = () => {
//     if (witnessActive || splitActive) {
//       message.error("This item cannot be dragged right now.");
//       setShowProp(false);
//       return;
//     }
//     setShowProp(false);
//     setIsDraggable(true);
//     message.success("Drag mode enabled.");
//   };

//   const handleNo = () => {
//     setShowProp(false);
//     message.info("Cancelled drag mode.");
//   };

//   // --- Drop ---
//   const getDropDayIndex = (e) => {
//     const b = bounds;
//     if (!b) return null;
//     const clientX = e.evt.clientX;
//     const rel = clientX - b.daysLeftPx;
//     const idx = Math.floor(rel / b.dayWidthPx);
//     return Math.max(0, Math.min(6, idx));
//   };

//   const handleDrop = (e) => {
//     const dayIndex = getDropDayIndex(e);
//     if (dayIndex !== null && onDropToDate) {
//       onDropToDate(dayIndex);
//       message.success(`Dropped on Day ${dayIndex + 1}`);
//     }
//     setIsDraggable(false);
//     setDragPos({ x: 0, y: 0 });
//   };

//   // ✅ Make stage width cover the full table (01–07 Oct)
//   const table = containerRef.current?.closest(".schedule-table");
//   const tableWidth = table
//     ? table.querySelector("tr.shift-row").getBoundingClientRect().width
//     : size.w;

//   return (
//     <>
//       <div
//         ref={containerRef}
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           overflow: "visible",
//           zIndex: isDraggable ? 9999 : "auto",
//         }}
//         onDoubleClick={handleDoubleClick}
//       >
//         {size.w > 0 && size.h > 0 && (
//           <Stage
//             ref={stageRef}
//             // ✅ Full canvas width (covers all 7 days)
//             width={tableWidth}
//             height={Math.floor(size.h)}
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               background: "transparent",
//               overflow: "hidden",
//             }}
//           >
//             <Layer>
//               {borderLeft && (
//                 <Rect
//                   x={offsetX}
//                   y={0}
//                   width={1}
//                   height={size.h}
//                   fill="black"
//                   listening={false}
//                 />
//               )}

//               {/* ✅ Event group (drag within full week) */}
//               <Group
//                 x={offsetX + dragPos.x}
//                 y={0}
//                 draggable={isDraggable}
//                 dragBoundFunc={(pos) => {
//                   if (!bounds) return { x: pos.x, y: 0 };
//                   const clampedX = Math.max(
//                     bounds.minX,
//                     Math.min(bounds.maxX, pos.x)
//                   );
//                   return { x: clampedX, y: 0 };
//                 }}
//                 onDragMove={(e) => {
//                   setDragPos({ x: e.target.x() - offsetX, y: 0 });
//                 }}
//                 onDragEnd={handleDrop}
//               >
//                 <Rect
//                   x={0}
//                   y={0}
//                   width={blockW}
//                   height={size.h}
//                   fill={color}
//                   cornerRadius={4}
//                   strokeEnabled={false}
//                   shadowBlur={2}
//                   shadowOpacity={0.3}
//                 />
//                 <Text
//                   x={6}
//                   y={0}
//                   width={Math.max(0, blockW - 12)}
//                   height={size.h}
//                   verticalAlign="middle"
//                   align="center"
//                   text={`${label}${hasStar ? " ⭐" : ""}`}
//                   fontSize={12}
//                   fill="black"
//                 />
//               </Group>
//             </Layer>
//           </Stage>
//         )}
//       </div>

//       <Modal
//         title="Ready for drag & drop?"
//         open={showProp}
//         onOk={handleYes}
//         onCancel={handleNo}
//         okText="Yes"
//         cancelText="No"
//       >
//         <p>Do you want to enable dragging for this item?</p>
//       </Modal>
//     </>
//   );
// }







// const regions = [
//   { name: "EHV", subItems: ["Impulse", "LMS", "Others"] },
//   { name: "NORTH", subItems: ["Impulse", "LMS", "Others"] },
//   { name: "SOUTH", subItems: ["Impulse", "LMS", "Others"] },
// ];

// const shifts = [3, 1, 2];

// const TEST_STYLES = {
//   SfraA1: { color: "red", text: "SfraA1" },
//   SfraA2: { color: "yellow", text: "SfraA2" },
//   TestA1: { color: "lightblue", text: "Test A1" },
// };

// const SHIFT_ORDER = [3, 1, 2];
// const nextShiftAndDate = (shift, date) => {
//   const idx = SHIFT_ORDER.indexOf(shift);
//   if (idx === -1 || idx === SHIFT_ORDER.length - 1) {
//     return { shift: SHIFT_ORDER[0], date: date.add(1, "day") };
//   }
//   return { shift: SHIFT_ORDER[idx + 1], date };
// };

// function MonthlyDataGrid() {
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [tempRange, setTempRange] = useState([]);
//   const [eventList, setEventList] = useState([]);

//   const [daysArray, setDaysArray] = useState(() => {
//     const base = dayjs("2025-10-01");
//     return Array.from({ length: base.daysInMonth() }, (_, i) =>
//       base.date(i + 1)
//     );
//   });

//   const getWeeks = (days) => {
//     const weeks = [];
//     for (let i = 0; i < days.length; i += 7) {
//       weeks.push(days.slice(i, i + 7));
//     }
//     return weeks;
//   };

//   const applyDateRange = () => {
//     if (!tempRange || tempRange.length !== 2) {
//       message.error("Please select both start and end dates!");
//       return;
//     }
//     const [start, end] = tempRange;
//     let current = start.startOf("day");

//     if (end.diff(start, "day") + 1 > 28) {
//       message.error("Date range cannot exceed 28 days.");
//       return;
//     }

//     const selectedDays = [];
//     while (current.isSameOrBefore(end, "day")) {
//       selectedDays.push(current);
//       current = current.add(1, "day");
//     }

//     setDaysArray(selectedDays);
//     setShowCalendar(false);
//   };

//   const handleCancel = () => {
//     setTempRange([]);
//     setShowCalendar(false);
//   };

//   const weeks = getWeeks(daysArray);

//   const [showCreateTest, setShowCreateTest] = useState(false);
//   const [testForm, setTestForm] = useState({
//     name: "",
//     date: null,
//     region: "",
//     hours: "",
//     shift: "",
//   });

//   const handleCreateTest = () => {
//     const { name, date, region, hours, shift } = testForm;

//     if (!name || !TEST_STYLES[name]) {
//       message.error("Please select a test.");
//       return;
//     }
//     if (!date) {
//       message.error("Please select a start date.");
//       return;
//     }
//     if (date.isBefore(dayjs("2025-08-01"), "day")) {
//       message.error("Start date must be on/after 01-08-2025.");
//       return;
//     }
//     if (!region.includes("-")) {
//       message.error("Please select region and sub item.");
//       return;
//     }
//     const hrs = Number(hours);
//     if (!hrs || hrs <= 0) {
//       message.error("Hours must be positive.");
//       return;
//     }
//     const shiftNum = Number(shift);
//     if (!SHIFT_ORDER.includes(shiftNum)) {
//       message.error("Invalid shift.");
//       return;
//     }

//     const [regionName, subItemName] = region.split("-");

//     let remaining = hrs;
//     let currentDate = date.startOf("day");
//     let currentShift = shiftNum;
//     const toAdd = [];

//     while (remaining > 0) {
//       const allot = Math.min(8, remaining);
//       toAdd.push({
//         date: currentDate,
//         shift: currentShift,
//         region: regionName,
//         subItem: subItemName,
//         test: name,
//         color: TEST_STYLES[name].color,
//         label: TEST_STYLES[name].text,
//         hours: allot,
//       });
//       remaining -= allot;
//       const next = nextShiftAndDate(currentShift, currentDate);
//       currentShift = next.shift;
//       currentDate = next.date;
//     }

//     setEventList((prev) => [...prev, { merged: true, parts: toAdd }]);
//     setShowCreateTest(false);
//     setTestForm({ name: "", date: null, region: "", hours: "", shift: "" });
//   };


//   const [witnessActive, setWitnessActive] = useState(false);
//   const [witnessTests, setWitnessTests] = useState(new Set());

 
//   const checkModeConflict = () => {
//     if (witnessActive && splitActive) {
//       message.error(
//         "Please deactivate one mode. Only one functionality can be active at a time."
//       );
//       return true;
//     }
//     return false;
//   };

//   const handleToggleWitness = () => {
//     if (splitActive) {
//       message.error("Please turn off Split mode before enabling Witness mode.");
//       return;
//     }
//     setWitnessActive((prev) => !prev);
//   };

//   const handleToggleStar = (eventKey) => {
//     if (!witnessActive) return;
//     setWitnessTests((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(eventKey)) newSet.delete(eventKey);
//       else newSet.add(eventKey);
//       return newSet;
//     });
//   };

//   const [splitActive, setSplitActive] = useState(false);


//   const handleToggleSplit = () => {
//     if (witnessActive) {
//       message.error("Please turn off Witness mode before enabling Split mode.");
//       return;
//     }
//     setSplitActive((prev) => !prev);
//   };

//   const [splitModalVisible, setSplitModalVisible] = useState(false);
//   const [splitPercent, setSplitPercent] = useState(50);
//   const [splitSide, setSplitSide] = useState("left");
//   const [eventToSplit, setEventToSplit] = useState(null);

//   const handleSplitEvent = (eventKey, mergedEvent) => {
//     const fullEvent =
//       mergedEvent._original ||
//       eventList.find(
//         (ev) =>
//           ev.merged &&
//           ev.parts[0].date.isSame(
//             (mergedEvent.parts &&
//               mergedEvent.parts[0] &&
//               mergedEvent.parts[0].date) ||
//               mergedEvent.parts[0].date,
//             "day"
//           ) &&
//           ev.parts[0].shift === mergedEvent.parts[0].shift &&
//           ev.parts[0].region === mergedEvent.parts[0].region &&
//           ev.parts[0].subItem === mergedEvent.parts[0].subItem &&
//           ev.parts[0].test === mergedEvent.parts[0].test
//       );

//     if (!fullEvent) return;

//     if (fullEvent.split) {
//       Modal.confirm({
//         title: "Reset Split",
//         content:
//           "This event is already split. Do you want to reset it back to original?",
//         onOk: () => {
//           setEventList((prev) =>
//             prev.map((ev) =>
//               ev === fullEvent ? { ...ev, split: false, splitAt: null } : ev
//             )
//           );
//           message.success("Event reset to original!");
//         },
//         onCancel: () => {
//           message.info("This is not able to split because it is already split.");
//         },
//       });
//       return;
//     }

//     setEventToSplit(fullEvent);
//     setSplitPercent(50);
//     setSplitSide("left");
//     setSplitModalVisible(true);
//   };

//   const applySplitFromModal = () => {
//     const fullEvent = eventToSplit;
//     if (!fullEvent) {
//       setSplitModalVisible(false);
//       return;
//     }

//     const totalHours = fullEvent.parts.reduce((s, p) => s + p.hours, 0);
//     const pct = Math.max(1, Math.min(99, Number(splitPercent || 50)));
//     let leftHours;
//     if (splitSide === "left") {
//       leftHours = Math.round((totalHours * pct) / 100);
//     } else {
//       const rightHours = Math.round((totalHours * pct) / 100);
//       leftHours = totalHours - rightHours;
//     }

//     if (leftHours < 1) leftHours = 1;
//     if (leftHours > totalHours - 1) leftHours = totalHours - 1;

//     const rightHoursFinal = totalHours - leftHours;

//     if (leftHours <= 0 || rightHoursFinal <= 0) {
//       message.error(
//         "Split results in invalid hour distribution. Choose different percentage."
//       );
//       return;
//     }

//     setEventList((prev) =>
//       prev.map((ev) =>
//         ev === fullEvent ? { ...ev, split: true, splitAt: leftHours } : ev
//       )
//     );

//     setSplitModalVisible(false);
//     setEventToSplit(null);
//     message.success(
//       `Test split applied: left ${leftHours}h / right ${rightHoursFinal}h (${pct}% on ${splitSide})`
//     );
//   };

//   return (
//     <div className="monthly-grid-container">
    
//       <h2 className="title">Monthly Data</h2>

//       <div className="buttons">
//         <button
//           onClick={handleToggleWitness}
//           style={{ position: "relative", paddingRight: "20px" }}
//         >
//           Add Customer Witness
//           {witnessActive && <span className="witness-dot"></span>}
//         </button>

//         <button
//           onClick={handleToggleSplit}
//           style={{ position: "relative", paddingRight: "20px" }}
//         >
//           Split Selected Vertically
//           {splitActive && <span className="witness-dot"></span>}
//         </button>

//         <button onClick={() => setShowCalendar(true)}>Calendar</button>
//         <button onClick={() => setShowCreateTest(true)}>Create Test</button>
//         <button>Delete Test</button>
//       </div>

//       {/* Calendar Modal */}
//       <Modal
//         title="Select Date Range"
//         open={showCalendar}
//         onOk={applyDateRange}
//         onCancel={handleCancel}
//         okText="OK"
//       >
//         <RangePicker
//           value={tempRange}
//           onChange={(values) => setTempRange(values || [])}
//           defaultPickerValue={[dayjs("2025-08-01"), dayjs("2025-08-01")]}
//           disabledDate={(current) =>
//             current && current.isBefore(dayjs("2025-08-01"), "day")
//           }
//         />
//       </Modal>

//       {/* Create Test Modal */}
//       <Modal
//         title="Create Test"
//         open={showCreateTest}
//         onOk={handleCreateTest}
//         onCancel={() => setShowCreateTest(false)}
//         okText="Create"
//         className="create-test-modal"
//       >
//         <div className="form-group">
//           <label>Name of the Test</label>
//           <select
//             className="form-control"
//             value={testForm.name}
//             onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
//           >
//             <option value="">Select Test</option>
//             <option value="SfraA1">SfraA1</option>
//             <option value="SfraA2">SfraA2</option>
//             <option value="TestA1">TestA1</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Date to Start</label>
//           <DatePicker
//             value={testForm.date}
//             onChange={(date) => setTestForm({ ...testForm, date })}
//             disabledDate={(current) =>
//               current && current.isBefore(dayjs("2025-08-01"), "day")
//             }
//             className="form-control"
//           />
//         </div>

//         <div className="form-group">
//           <label>Region</label>
//           <select
//             className="form-control"
//             value={testForm.region}
//             onChange={(e) =>
//               setTestForm({ ...testForm, region: e.target.value })
//             }
//           >
//             <option value="">Select Region</option>
//             {regions.map((reg) => (
//               <optgroup key={reg.name} label={reg.name}>
//                 {reg.subItems.map((sub) => (
//                   <option key={`${reg.name}-${sub}`} value={`${reg.name}-${sub}`}>
//                     {sub}
//                   </option>
//                 ))}
//               </optgroup>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Test Hours</label>
//           <input
//             type="number"
//             className="form-control"
//             value={testForm.hours}
//             onChange={(e) =>
//               setTestForm({ ...testForm, hours: parseInt(e.target.value, 10) })
//             }
//             placeholder="Enter hours"
//             min={1}
//           />
//         </div>

//         <div className="form-group">
//           <label>Shift</label>
//           <select
//             className="form-control"
//             value={testForm.shift}
//             onChange={(e) =>
//               setTestForm({ ...testForm, shift: e.target.value })
//             }
//           >
//             <option value="">Select Shift</option>
//             <option value="3">3</option>
//             <option value="1">1</option>
//             <option value="2">2</option>
//           </select>
//         </div>
//       </Modal>

//       {/* Split-percentage Modal (new) */}
//       <Modal
//         title={
//           eventToSplit
//             ? `Split "${eventToSplit.parts[0].label || eventToSplit.parts[0].test}"`
//             : "Split Test"
//         }
//         open={splitModalVisible}
//         onOk={applySplitFromModal}
//         onCancel={() => {
//           setSplitModalVisible(false);
//           setEventToSplit(null);
//         }}
//         okText="Apply Split"
//       >
//         <div style={{ marginBottom: 12 }}>
//           <div style={{ marginBottom: 8 }}>
//             <strong>Choose percentage (1 - 99)</strong>
//           </div>
//           <Slider
//             min={1}
//             max={99}
//             value={splitPercent}
//             onChange={(val) => setSplitPercent(val)}
//             tooltipVisible
//           />
//           <div style={{ marginTop: 8, textAlign: "center" }}>
//             <span style={{ fontWeight: 600 }}>{splitPercent}%</span>
//           </div>
//         </div>

//         <div style={{ marginTop: 8 }}>
//           <div style={{ marginBottom: 8 }}>
//             <strong>Apply percentage to</strong>
//           </div>
//           <Radio.Group
//             onChange={(e) => setSplitSide(e.target.value)}
//             value={splitSide}
//           >
//             <Radio value="left">Left</Radio>
//             <Radio value="right">Right</Radio>
//           </Radio.Group>
//         </div>

//         <div style={{ marginTop: 12, color: "#666", fontSize: 13 }}>
//           <div>
//             Example: if total hours = 24 and you choose <b>{splitPercent}%</b> on{" "}
//             <b>{splitSide}</b>, distribution will be computed in hours and stored.
//           </div>
//         </div>
//       </Modal>

//       {weeks.length > 0 ? (
//         weeks.map((weekDays, weekIdx) => (
//           <table className="schedule-table" key={weekIdx}>
//             <thead>
//               <tr>
//                 <th rowSpan="3" className="region-col">
//                   Region
//                 </th>
//                 <th rowSpan="3" className="sub-col">
//                   Sub Item
//                 </th>
//                 {weekDays.map((d, i) => (
//                   <th key={i} colSpan={shifts.length} className="day-header">
//                     {d.format("dddd")}
//                   </th>
//                 ))}
//               </tr>
//               <tr>
//                 {weekDays.map((d, i) => (
//                   <th key={i} colSpan={shifts.length} className="date-cell">
//                     {d.format("DD-MM")}
//                   </th>
//                 ))}
//               </tr>
//               <tr className="shift-row">
//                 {weekDays.map((_, i) =>
//                   shifts.map((s, idx) => (
//                     <th
//                       key={`${i}-${s}`}
//                       className={`shift-cell ${idx === 2 ? "black-separator" : ""}`}
//                     >
//                       {s}
//                     </th>
//                   ))
//                 )}
//               </tr>
//             </thead>

//             <tbody>
//               {regions.map((region) =>
//                 region.subItems.map((sub, i) => (
//                   <tr key={`${region.name}-${sub}`}>
//                     {i === 0 && (
//                       <td rowSpan={region.subItems.length} className="region-name">
//                         {region.name}
//                       </td>
//                     )}
//                     <td className="sub-name">{sub}</td>

//                     {weekDays.map((d, dayIdx) =>
//                       shifts.map((s, shiftIdx) => {
//                         // === NEW merged-event selection (robust & week-sliced) ===
//                         let mergedEvent = null;

//                         // find any event that contains a part for this exact cell
//                         const evContaining = eventList.find((ev) =>
//                           ev.merged &&
//                           ev.parts.some(
//                             (p) =>
//                               p.date.isSame(d, "day") &&
//                               p.shift === s &&
//                               p.region === region.name &&
//                               p.subItem === sub
//                           )
//                         );

//                         if (evContaining) {
//                           // limit rendering to the contiguous parts that fall inside this WEEK
//                           const currentWeekStart = weekDays[0];
//                           const currentWeekEnd = weekDays[weekDays.length - 1];

//                           // get indices of all parts that fall inside this week
//                           const indicesInWeek = evContaining.parts
//                             .map((p, idx) => ({ p, idx }))
//                             .filter(
//                               ({ p }) =>
//                                 !p.date.isBefore(currentWeekStart, "day") &&
//                                 !p.date.isAfter(currentWeekEnd, "day")
//                             )
//                             .map(({ idx }) => idx);

//                           if (indicesInWeek.length > 0) {
//                             const firstWeekPartIdx = indicesInWeek[0];
//                             const lastWeekPartIdx = indicesInWeek[indicesInWeek.length - 1];

//                             // index of this specific cell inside the event parts
//                             const currentPartIndex = evContaining.parts.findIndex(
//                               (p) =>
//                                 p.date.isSame(d, "day") &&
//                                 p.shift === s &&
//                                 p.region === region.name &&
//                                 p.subItem === sub
//                             );

//                             // Only render a merged block at the FIRST visible part inside the week
//                             if (currentPartIndex === firstWeekPartIdx) {
//                               const partsFromHere = evContaining.parts.slice(
//                                 firstWeekPartIdx,
//                                 lastWeekPartIdx + 1
//                               );
//                               mergedEvent = { ...evContaining, parts: partsFromHere, _original: evContaining };
//                             }
//                             // otherwise: this cell is inside the block but not the first visible part -> we will return null later
//                           }
//                         }
// // 🔹 Handles actual re-assignment of event date on drop
// const handleDropToDate = (originalEvent, newDay) => {
//   setEventList((prevEvents) =>
//     prevEvents.map((ev) => {
//       if (ev === originalEvent._original || ev === originalEvent) {
//         const dayShiftDiff = newDay.diff(ev.parts[0].date, "day");
//         // shift all parts by same number of days
//         const newParts = ev.parts.map((p) => ({
//           ...p,
//           date: p.date.add(dayShiftDiff, "day"),
//         }));
//         return { ...ev, parts: newParts };
//       }
//       return ev;
//     })
//   );
//   message.success(`✅ Event moved to ${newDay.format("DD-MM-YYYY")}`);
// };
              

//                         if (mergedEvent) {
//                           const totalCells = mergedEvent.parts.length;
//                           const totalHours = mergedEvent.parts.reduce(
//                             (sum, p) => sum + p.hours,
//                             0
//                           );
//                           const firstPart = mergedEvent.parts[0];

//                           const lastPart =
//                             mergedEvent.parts[mergedEvent.parts.length - 1];
//                           const coversShift2 = lastPart && lastPart.shift === 2;

//                           const originalEv = mergedEvent._original || mergedEvent;
//                           const eventKey = `${region.name}-${sub}-${originalEv.parts[0].date.format(
//                             "YYYY-MM-DD"
//                           )}-${originalEv.parts[0].test}`;

//                           // handle split rendering: show split only if the global split point falls inside THIS visible slice
//                           const isSplit = Boolean(originalEv.split);
//                           const splitAtGlobal = originalEv.splitAt ?? null;

//                           let shouldRenderSplitHere = false;
//                           let leftPct = 50;
//                           let rightPct = 50;

//                           if (isSplit && splitAtGlobal != null) {
                         
//                             const idxInOriginal = originalEv.parts.findIndex(
//                               (p) =>
//                                 p.date.isSame(firstPart.date, "day") &&
//                                 p.shift === firstPart.shift &&
//                                 p.region === firstPart.region &&
//                                 p.subItem === firstPart.subItem &&
//                                 p.test === firstPart.test
//                             );

                       
//                             let prefixHours = 0;
//                             for (let k = 0; k < idxInOriginal; k++) {
//                               prefixHours += originalEv.parts[k].hours;
//                             }

//                             const sliceHours = mergedEvent.parts.reduce((s, p) => s + p.hours, 0);

//                             // split 
//                             if (splitAtGlobal > prefixHours && splitAtGlobal < prefixHours + sliceHours) {
//                               shouldRenderSplitHere = true;
//                               const localSplitHours = splitAtGlobal - prefixHours;
//                               leftPct = (localSplitHours / sliceHours) * 100;
//                               rightPct = 100 - leftPct;
//                             } else {
//                               shouldRenderSplitHere = false;
//                             }
//                           }



// if (isSplit && shouldRenderSplitHere) {
//   const colorLeft = mergedEvent.parts[0].color;
//   const colorRight = mergedEvent.parts[0].color;

//   const leftKey = `${eventKey}-left`;
//   const rightKey = `${eventKey}-right`;

//   const baseWidthPercent = (totalHours / (8 * totalCells)) * 100;
//   const leftWidthPercent = (baseWidthPercent * leftPct) / 100;
//   const rightWidthPercent = (baseWidthPercent * rightPct) / 100;

//   return (
//     <td
//       key={`${dayIdx}-${s}`}
//       colSpan={totalCells}
//       className={`cell shift-cell ${coversShift2 ? "black-separator" : ""}`}
//       style={{ padding: 0 }}
//     >
//       <div style={{ display: "flex", width: `${baseWidthPercent}%`, height: "100%" }}>
      
//         <div
//           onClick={() => {
//             if (witnessActive) handleToggleStar(leftKey);
//             if (splitActive) handleSplitEvent(eventKey, mergedEvent);
//           }}
//           style={{
//             width: `${leftWidthPercent}%`,
//             height: "100%",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             backgroundColor: colorLeft,
//             borderRadius: "4px 0 0 4px",
//             cursor: witnessActive || splitActive ? "pointer" : "default",
//           }}
//         >
//           <span className="event-text">
//             {firstPart.label}
//             {witnessTests.has(leftKey) && <span className="event-star">⭐</span>}
//           </span>
//         </div>

//         <div
//           onClick={() => {
//             if (witnessActive) handleToggleStar(rightKey);
//             if (splitActive) handleSplitEvent(eventKey, mergedEvent);
//           }}
//           style={{
//             width: `${rightWidthPercent}%`,
//             height: "100%",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             backgroundColor: colorRight,
//             borderRadius: "0 4px 4px 0",
//             borderLeft: "1px solid black",
//             cursor: witnessActive || splitActive ? "pointer" : "default",
//           }}
//         >
//           <span className="event-text">
//             {firstPart.label}
//             {witnessTests.has(rightKey) && <span className="event-star">⭐</span>}
//           </span>
//         </div>
//       </div>
//     </td>
//   );
// }

//                           return (
//                             <td
//                               key={`${dayIdx}-${s}`}
//                               colSpan={totalCells}
//                               className={`cell shift-cell ${
//                                 coversShift2 ? "black-separator" : ""
//                               }`}
//                             >
                              
                                
// <KonvaEvent
//   color={firstPart.color}
//   label={firstPart.label}
//   widthPercent={(totalHours / (8 * totalCells)) * 100}
//   hasStar={witnessTests.has(eventKey)}
//   onClick={() => {
//     if (witnessActive) handleToggleStar(eventKey);
//     if (splitActive) handleSplitEvent(eventKey, mergedEvent);
//   }}
//   witnessActive={witnessActive}
//   splitActive={splitActive}
//   onDropToDate={(dayIndex) => {
//     const droppedDate = weekDays[dayIndex];
//     console.log(`Dropped to: ${droppedDate.format("DD-MM-YYYY")}`);
//     handleDropToDate(mergedEvent, droppedDate);
//   }}
// />


                                


//                             </td>
//                           );
//                         }

//                         const insideSpan = eventList.some(
//                           (ev) =>
//                             ev.merged &&
//                             ev.parts.some(
//                               (p) =>
//                                 p.date.isSame(d, "day") &&
//                                 p.shift === s &&
//                                 p.region === region.name &&
//                                 p.subItem === sub
//                             )
//                         );
//                         if (insideSpan) return null;

//                         return (
//                           <td
//                             key={`${dayIdx}-${s}`}
//                             className={`cell shift-cell ${
//                               shiftIdx === 2 ? "black-separator" : ""
//                             }`} 
//                           />
//                         );
//                       })
//                     )}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         ))
//             ) : (
//         <p>No dates to show</p>
//       )}
      
//     </div>
//   );
// }

// export default MonthlyDataGrid;

