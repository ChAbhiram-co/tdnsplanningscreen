import React from "react";
import { Select, message } from "antd";

const PlannerToolbar = ({
  witnessActive,
  retestActive,
  splitPercentage,
  blockSelectionActive,
  deleteActive,
  selectedEvents,

  handleToggleWitness,
  handleToggleRetest,
  handleSplitTask,
  handlePrintPlanner,
  handleGroupTest,
  handleUngroup,
  handleToggleDelete,
  handleBlock,
  handleUnBlock,
}) => {
  return (
    <div className="buttons">

      <button
        onClick={handleToggleWitness}
        style={{
          position: "relative",
          paddingRight: "20px",
        }}
      >
        Customer Witness

        {witnessActive && (
          <span className="witness-dot"></span>
        )}
      </button>

      <button
        onClick={handleToggleRetest}
        style={{
          position: "relative",
          paddingRight: "20px",
        }}
      >
        Retest

        {retestActive && (
          <span className="witness-dot"></span>
        )}
      </button>

      <Select
        className="split-task-select"
        placeholder="Split the Event"
        style={{
          width: 150,
        }}
        value={splitPercentage}
        onChange={(value) => {
          handleSplitTask(value);
        }}
        options={[
          {
            label: "12.5%",
            value: 12.5,
          },
          {
            label: "25%",
            value: 25,
          },
          {
            label: "50%",
            value: 50,
          },
        ]}
      />

      <button onClick={handlePrintPlanner}>
        Export / Print PDF
      </button>

      <button onClick={handleGroupTest}>
        Group Test
      </button>

      <button onClick={handleUngroup}>
        Ungroup
      </button>

      <button
        onClick={handleToggleDelete}
        style={{
          position: "relative",
          paddingRight: "20px",

          background: deleteActive
            ? "#ffffff"
            : "#ffffff",

          color: deleteActive
            ? "#ff4d4f"
            : "#ff4d4f",

          border: "1px solid #ff4d4f",
          borderRadius: "6px",
          height: "38px",
          fontWeight: "500",
          outline: "none",
          boxShadow: "none",
        }}
      >
        Delete Test

        {deleteActive && (
          <span className="witness-dot"></span>
        )}
      </button>

      <button
        disabled={!blockSelectionActive}
        onClick={handleBlock}
      >
        Block (holiday/Maintenance)
      </button>

      <button
        disabled={!blockSelectionActive}
        onClick={handleUnBlock}
      >
        Un Block
      </button>

      <button>
        Parking
      </button>

    </div>
  );
};

export default PlannerToolbar;