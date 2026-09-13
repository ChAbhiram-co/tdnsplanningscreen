import React from "react";
import { Modal, Select } from "antd";

const TransformerModal = ({
  addTransformerModalOpen,
  setAddTransformerModalOpen,

  modalTransformers,
  setModalTransformers,

  selectedTransformers,
  setSelectedTransformer,

  setPlannerTransformers,

  loadAllTransformerTests,

  TRANSFORMERS,
  transformerCustomerMap,
}) => {

  return (
    <Modal
      title="Add Transformer"
      open={addTransformerModalOpen}
      width={520}
      className="add-transformer-modal"

      onCancel={() => {

        setModalTransformers([]);

        setAddTransformerModalOpen(false);

      }}

      onOk={() => {

        if (modalTransformers.length === 0) {

          setAddTransformerModalOpen(false);

          return;
        }

        const updatedTransformers = [
          ...selectedTransformers,
          ...modalTransformers,
        ];

        setSelectedTransformer(
          updatedTransformers
        );

        setPlannerTransformers(prev => [
          ...prev,
          ...modalTransformers,
        ]);

        loadAllTransformerTests(
          updatedTransformers
        );

        setModalTransformers([]);

        setAddTransformerModalOpen(false);

      }}

      okText="OK"
      cancelText="Cancel"
    >

      <Select
        mode="multiple"
        allowClear
        showSearch
        optionFilterProp="label"
        placeholder="Select Transformer"

        value={modalTransformers}

        onChange={
          setModalTransformers
        }

        style={{
          width: "100%",
        }}

        maxTagCount={2}

        options={TRANSFORMERS.map((tr) => {

          const customerName =
            transformerCustomerMap[tr] || "-";

          return {

            value: tr,

            disabled:
              selectedTransformers.includes(tr),

            label:
              `${tr} (${customerName})`,

            children: (

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "6px 0",
                  lineHeight: "18px",
                }}
              >

                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#262626",
                  }}
                >
                  {tr}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#8c8c8c",
                    marginTop: "2px",
                    whiteSpace: "normal",
                    lineHeight: "16px",
                  }}
                >
                  {customerName}
                </div>

              </div>

            ),

          };

        })}

      />

    </Modal>
  );
};

export default TransformerModal;