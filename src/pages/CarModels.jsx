import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Table,
  Input,
  Popconfirm,
  Button,
  Space,
  Modal,
  Form,
  Breadcrumb,
  InputNumber,
  Select,
  Tag,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { carMakesService, carModelsService, carTireSizesService } from "../api/admin";
import { toast } from "../utils/toast";

const FITMENT_TYPES = ["stock", "alternative", "staggered_front", "staggered_rear"];

function TireSizeManager({ carModelId }) {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    carTireSizesService
      .list({ car_model_id: carModelId, per_page: 100 })
      .then((res) => setSizes(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [carModelId]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const remove = async (id) => {
    await carTireSizesService.remove(id);
    toast.success("Silindi");
    load();
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    const payload = { ...values, car_model_id: carModelId };
    if (editing) {
      await carTireSizesService.update(editing.id, payload);
      toast.success("Yeniləndi");
    } else {
      await carTireSizesService.create(payload);
      toast.success("Əlavə edildi");
    }
    setModalOpen(false);
    load();
  };

  const columns = [
    {
      title: "İllər",
      render: (_, r) => `${r.year_from ?? "?"} - ${r.year_to ?? "?"}`,
    },
    {
      title: "Təkər ölçüsü",
      render: (_, r) => `${r.width}/${r.profile} R${r.diameter}`,
    },
    { title: "PCD", dataIndex: "pcd" },
    { title: "Center Bore", dataIndex: "center_bore" },
    { title: "Disk eni", dataIndex: "rim_width" },
    {
      title: "Offset",
      render: (_, r) =>
        r.offset_min != null || r.offset_max != null
          ? `${r.offset_min ?? "?"} - ${r.offset_max ?? "?"}`
          : "-",
    },
    { title: "Tip", dataIndex: "type", render: (v) => <Tag>{v}</Tag> },
    { title: "Qeyd", dataIndex: "note" },
    {
      title: "Əməliyyat",
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm title="Silinsin?" onConfirm={() => remove(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 12 }}>
      <Space style={{ marginBottom: 12 }}>
        <Button size="small" type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Yeni ölçü
        </Button>
      </Space>
      <Table
        size="small"
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={sizes}
        pagination={false}
      />

      <Modal
        title={editing ? "Ölçü redaktə et" : "Yeni ölçü"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        okText="Yadda saxla"
        cancelText="Ləğv et"
      >
        <Form form={form} layout="vertical">
          <Space.Compact block>
            <Form.Item name="year_from" label="İldən" style={{ width: "50%" }}>
              <InputNumber style={{ width: "100%" }} placeholder="2015" />
            </Form.Item>
            <Form.Item name="year_to" label="İlədək" style={{ width: "50%" }}>
              <InputNumber style={{ width: "100%" }} placeholder="2020" />
            </Form.Item>
          </Space.Compact>
          <Space.Compact block>
            <Form.Item name="width" label="En" rules={[{ required: true }]} style={{ width: "33%" }}>
              <InputNumber style={{ width: "100%" }} placeholder="205" />
            </Form.Item>
            <Form.Item name="profile" label="Profil" rules={[{ required: true }]} style={{ width: "33%" }}>
              <InputNumber style={{ width: "100%" }} placeholder="55" />
            </Form.Item>
            <Form.Item name="diameter" label="Diametr" rules={[{ required: true }]} style={{ width: "34%" }}>
              <InputNumber style={{ width: "100%" }} placeholder="16" />
            </Form.Item>
          </Space.Compact>
          <Space.Compact block>
            <Form.Item name="pcd" label="PCD" style={{ width: "50%" }}>
              <Input placeholder="5x114.3" />
            </Form.Item>
            <Form.Item name="center_bore" label="Center Bore" style={{ width: "50%" }}>
              <InputNumber style={{ width: "100%" }} placeholder="60.1" step={0.1} />
            </Form.Item>
          </Space.Compact>
          <Space.Compact block>
            <Form.Item name="rim_width" label="Disk eni (düym)" style={{ width: "33%" }}>
              <InputNumber style={{ width: "100%" }} placeholder="7" />
            </Form.Item>
            <Form.Item name="offset_min" label="Offset min" style={{ width: "33%" }}>
              <InputNumber style={{ width: "100%" }} placeholder="35" />
            </Form.Item>
            <Form.Item name="offset_max" label="Offset max" style={{ width: "34%" }}>
              <InputNumber style={{ width: "100%" }} placeholder="45" />
            </Form.Item>
          </Space.Compact>
          <Form.Item name="type" label="Tip" rules={[{ required: true }]} initialValue="stock">
            <Select options={FITMENT_TYPES.map((t) => ({ value: t, label: t }))} />
          </Form.Item>
          <Form.Item name="note" label="Qeyd">
            <Input placeholder="Sport paket, ön təkər və s." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default function CarModels() {
  const { makeId } = useParams();
  const [make, setMake] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    carModelsService
      .list({ car_make_id: makeId, search, per_page: 200 })
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [makeId, search]);

  useEffect(() => {
    carMakesService.list({ per_page: 500 }).then((res) => {
      const found = res.data.data.find((m) => String(m.id) === String(makeId));
      setMake(found);
    });
  }, [makeId]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const remove = async (id) => {
    await carModelsService.remove(id);
    toast.success("Silindi");
    load();
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    const payload = { ...values, car_make_id: makeId };
    if (editing) {
      await carModelsService.update(editing.id, payload);
      toast.success("Yeniləndi");
    } else {
      await carModelsService.create(payload);
      toast.success("Əlavə edildi");
    }
    setModalOpen(false);
    load();
  };

  const columns = [
    { title: "Model", dataIndex: "name" },
    { title: "Ölçü sayı", dataIndex: "tire_sizes_count" },
    {
      title: "Əməliyyat",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm title="Silinsin?" onConfirm={() => remove(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
      <Breadcrumb
        items={[
          { title: <Link to="/car-makes">Markalar</Link> },
          { title: make?.name ?? "..." },
        ]}
      />
      <Space>
        <Input.Search
          placeholder="Model axtar..."
          onSearch={setSearch}
          style={{ width: 280 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Yeni model
        </Button>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={false}
        expandable={{
          expandedRowRender: (record) => <TireSizeManager carModelId={record.id} />,
        }}
      />

      <Modal
        title={editing ? "Model redaktə et" : "Yeni model"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        okText="Yadda saxla"
        cancelText="Ləğv et"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Ad" rules={[{ required: true }]}>
            <Input placeholder="Corolla" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
