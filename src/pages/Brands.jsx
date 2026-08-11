import { useEffect, useState } from "react";
import {
  Table,
  Input,
  Select,
  Popconfirm,
  Button,
  Space,
  Tag,
  Modal,
  Form,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { brandsService } from "../api/admin";
import { toast } from "../utils/toast";

const TYPE_OPTIONS = ["tire", "rim", "both"];
const CATEGORY_OPTIONS = ["premium", "orta", "budce", "replica", "off-road"];

export default function Brands() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    brandsService
      .list({ search, page })
      .then((res) => {
        setData(res.data.data);
        setTotal(res.data.total);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [search, page]);

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
    await brandsService.remove(id);
    toast.success("Silindi");
    load();
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await brandsService.update(editing.id, values);
      toast.success("Yeniləndi");
    } else {
      await brandsService.create(values);
      toast.success("Əlavə edildi");
    }
    setModalOpen(false);
    load();
  };

  const columns = [
    { title: "Ad", dataIndex: "name" },
    { title: "Tip", dataIndex: "type", render: (v) => <Tag>{v}</Tag> },
    { title: "Kateqoriya", dataIndex: "category", render: (v) => <Tag color="blue">{v}</Tag> },
    { title: "Ölkə", dataIndex: "country" },
    { title: "Modellər", dataIndex: "models_count" },
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
      <Space>
        <Input.Search
          placeholder="Marka axtar..."
          onSearch={(v) => {
            setPage(1);
            setSearch(v);
          }}
          style={{ width: 280 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Yeni marka
        </Button>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{
          current: page,
          total,
          pageSize: 50,
          onChange: setPage,
        }}
      />

      <Modal
        title={editing ? "Marka redaktə et" : "Yeni marka"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        okText="Yadda saxla"
        cancelText="Ləğv et"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Ad" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Tip" rules={[{ required: true }]}>
            <Select options={TYPE_OPTIONS.map((t) => ({ value: t, label: t }))} />
          </Form.Item>
          <Form.Item name="category" label="Kateqoriya" rules={[{ required: true }]}>
            <Select options={CATEGORY_OPTIONS.map((c) => ({ value: c, label: c }))} />
          </Form.Item>
          <Form.Item name="country" label="Ölkə">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
