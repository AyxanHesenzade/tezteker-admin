import { useEffect, useState } from "react";
import {
  Table,
  Input,
  Popconfirm,
  Button,
  Space,
  Modal,
  Form,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { carMakesService } from "../api/admin";
import { toast } from "../utils/toast";

export default function CarMakes() {
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
    carMakesService
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
    await carMakesService.remove(id);
    toast.success("Silindi");
    load();
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await carMakesService.update(editing.id, values);
      toast.success("Yeniləndi");
    } else {
      await carMakesService.create(values);
      toast.success("Əlavə edildi");
    }
    setModalOpen(false);
    load();
  };

  const columns = [
    {
      title: "Marka",
      dataIndex: "name",
      render: (v, r) => <Link to={`/car-makes/${r.id}/models`}>{v}</Link>,
    },
    { title: "Modellər", dataIndex: "models_count" },
    {
      title: "Əməliyyat",
      render: (_, record) => (
        <Space>
          <Link to={`/car-makes/${record.id}/models`}>
            <Button>Modellər</Button>
          </Link>
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
          pageSize: 100,
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
            <Input placeholder="Toyota" />
          </Form.Item>
          <Form.Item name="logo_url" label="Loqo URL">
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
