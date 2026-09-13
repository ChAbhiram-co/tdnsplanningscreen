import React from "react";
import {
  DatePicker,
  Select,
  Button,
  Input,
  message,
} from "antd";

const PlannerSetup = ({
  selectedMonth,
  selectedWeekRange,
  selectedTransformers,
  selectedVersion,

  handleMonthChange,
  setSelectedWeekRange,
  setDaysArray,
  setSelectedDate,
  setIsSelectingWeekRange,

  setSelectedTransformer,
  setPendingEvents,
  loadAllTransformerTests,

  setSelectedVersion,
  handleSetupSave,

  TRANSFORMERS,
}) => {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "79vh",
        background: "#f5f7fa",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          background: "#fff",
          border: "1px solid #ececec",
          borderRadius: "4px",
          padding: "30px",
          width: "96%",
          overflow: "hidden",
        }}
      >

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr 1fr 1fr",
            gap: "12px",
            alignItems: "end",
          }}
        >

          <div
            style={{
              width: "100%",

            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <span style={{ color: "red" }}>*</span> Month
            </label>

            <DatePicker
              picker="month"
              placeholder="Select Month"
              value={selectedMonth}
              onChange={handleMonthChange}
              style={{ width: "100%" }}
            />
          </div>

          <div
            style={{
              width: "100%",
              // height: "40px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <span style={{ color: "red" }}>*</span> Week Range
            </label>

            <DatePicker.RangePicker
              picker="week"
              value={selectedWeekRange}
              onChange={(value) => {

                if (!value || value.length !== 2) {
                  return;
                }

                const startWeek =
                  value[0].startOf("isoWeek");

                const endWeek =
                  value[1].startOf("isoWeek");

                const totalWeeks =
                  endWeek.diff(
                    startWeek,
                    "week"
                  ) + 1;

                if (
                  totalWeeks !== 4 &&
                  totalWeeks !== 5
                ) {
                  message.error({
                    content:
                      `You selected ${totalWeeks} weeks. Please select only 4 or 5 weeks.`,
                    key: "week-range-error",
                  });

                  return;
                }
                setSelectedWeekRange([
                  startWeek,
                  endWeek,
                ]);

                const totalDays =
                  totalWeeks * 7;

                const newDays =
                  Array.from(
                    { length: totalDays },
                    (_, i) =>
                      startWeek.add(i, "day")
                  );

                setDaysArray(newDays);

                setSelectedDate(startWeek);

                setIsSelectingWeekRange(false);
              }}
              style={{ width: "100%" }}
            />
          </div>

          <div
            style={{
              width: "100%",
              // height:"40px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <span style={{ color: "red" }}>*</span> Transformers
            </label>

            <Select
              mode="multiple"
              size="large"
              placeholder="Select Transformers"
              value={selectedTransformers}
              onChange={(value) => {

                setSelectedTransformer(value);

                if (value.length === 0) {

                  setPendingEvents([]);

                  return;
                }

                loadAllTransformerTests(value);
              }}
              style={{
                width: "100%",
                // height: "40px",
              }}
              maxTagCount={2}
              options={TRANSFORMERS.map((tr) => ({
                label: tr,
                value: tr,
              }))}
            />
          </div>

          <div
            style={{
              width: "100%",
              // height:"40px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <span style={{ color: "red" }}>*</span> version
            </label>

            <Input
              size="large"
              placeholder="Enter Version"
              value={selectedVersion}
              onChange={(e) => {

                const value = e.target.value;

                if (/^\d*\.?\d*$/.test(value)) {
                  setSelectedVersion(value);
                }

              }}
            />
          </div>

        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "15px",
          }}
        >
          <Button
            type="primary"
            onClick={handleSetupSave}
            style={{ minWidth: "110px" }}
          >
            Proceed
          </Button>
        </div>

      </div>
    </div>
  );
};

export default PlannerSetup;