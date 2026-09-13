import React from "react";
import {
  Group,
  Rect,
  Text,
} from "react-konva";

const TestQueue = ({
  gridWidth,
  queueWidth,
  totalStageHeight,
  headerHeight,
  cellWidth,
  cellHeight,
  singleWeekHeight,

  groupedPendingEvents,
  expandedTransformers,
  toggleTransformer,

  draggingQueueEvent,
  handleQueueDrop,
}) => {
  return (
    <Group>

      {/* BOTTOM */}
      <Rect
        x={gridWidth}
        y={totalStageHeight - 1}
        width={queueWidth}
        height={1}
        fill="#000"
      />


      {/* Queue Header */}
      <Rect
        x={gridWidth}
        y={46}
        width={queueWidth}
        height={1}
        fill="#000"
      />

      <Text
        x={gridWidth + 10}
        y={12}
        width={queueWidth - 20}
        text="Tests"
        align="left"
        fontStyle="bold"
        fontSize={16}
      />


      {Object.entries(groupedPendingEvents).map(
        ([transformer, tests], groupIndex) => {

          let headerY = 60;

          Object.entries(groupedPendingEvents)
            .slice(0, groupIndex)
            .forEach(([tr, list]) => {

              headerY += 42;

              if (expandedTransformers[tr]) {
                headerY += list.length * 45;
              }

            });


          return (
            <Group key={transformer}>

              {/* Transformer Header */}
              <Text
                x={gridWidth + 10}
                y={headerY + 8}
                width={250}
                height={24}
                text={(() => {

                  const transformerData =
                    tests[0];

                  const transformerType =
                    transformerData?.transformerType || "";

                  const customerName =
                    transformerData?.customerName || "";

                  const customerShort =
                    customerName.substring(0, 5);

                  return `${
                    expandedTransformers[transformer]
                      ? "▼"
                      : "▶"
                  } ${transformer} (${transformerType}) (${customerShort})`;

                })()}
                fontStyle="bold"
                fontSize={14}
                fill="#262626"
                onClick={() =>
                  toggleTransformer(transformer)
                }
              />


              {/* Tests */}
              {expandedTransformers[transformer] &&
                tests.map((ev, index) => {

                  const cardY =
                    headerY + 42 + (index * 44);

                  return (

                    <Group
                      key={ev.id}
                      x={gridWidth + 85}
                      y={cardY}
                      draggable
                      offsetX={0}
                      offsetY={0}

                      dragBoundFunc={(pos) => {

                        const cardWidth = 120;

                        if (
                          (pos.x + cardWidth) >
                          gridWidth
                        ) {
                          return pos;
                        }

                        const minX =
                          2 * cellWidth;

                        const maxX =
                          gridWidth - cardWidth;

                        const fullWeekHeight =
                          singleWeekHeight + 20;

                        const weekIndex =
                          Math.floor(
                            pos.y /
                            fullWeekHeight
                          );

                        const weekStartY =
                          weekIndex *
                          fullWeekHeight;

                        const insideWeekY =
                          pos.y - weekStartY;

                        const clampedInsideY =
                          Math.max(
                            headerHeight,
                            Math.min(
                              insideWeekY,
                              singleWeekHeight -
                              cellHeight
                            )
                          );

                        return {
                          x: Math.max(
                            minX,
                            Math.min(
                              pos.x,
                              maxX
                            )
                          ),

                          y:
                            weekStartY +
                            clampedInsideY,
                        };

                      }}


                      onDragStart={(e) => {

                        ev._queueStartX =
                          e.target.x();

                        ev._queueStartY =
                          e.target.y();

                        draggingQueueEvent.current =
                          ev;

                      }}


                      onDragEnd={(e) => {

                        const pos =
                          e.target
                            .getAbsolutePosition();

                        const cardWidth = 120;

                        const isInsideGridBody =
                          pos.x >=
                            (2 * cellWidth) &&
                          (pos.x + cardWidth) <=
                            gridWidth &&
                          pos.y >=
                            headerHeight &&
                          pos.y <=
                            totalStageHeight;

                        if (
                          isInsideGridBody
                        ) {

                          handleQueueDrop(
                            pos.x,
                            pos.y,
                            ev
                          );

                        }


                        e.target.position({
                          x: ev._queueStartX,
                          y: ev._queueStartY,
                        });

                        e.target
                          .getLayer()
                          ?.batchDraw();

                      }}

                    >

                      <Rect
                        width={120}
                        height={40}
                        fill={ev.color}
                        cornerRadius={3}
                      />

                      <Text
                        width={120}
                        height={40}
                        align="center"
                        verticalAlign="middle"
                        fontSize={12}
                        fontStyle="bold"
                        text={`${
                          ev.label
                        } (${
                          ev.durationHours
                        } hrs)`}
                      />

                    </Group>

                  );

                })}


              <Rect
                x={gridWidth + 10}
                y={
                  expandedTransformers[transformer]
                    ? headerY +
                      42 +
                      tests.length * 44
                    : headerY + 36
                }
                width={250}
                height={1}
                fill="#d9d9d9"
              />

            </Group>
          );

        }
      )}

    </Group>
  );
};

export default TestQueue;