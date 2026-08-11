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
import { brandsService, productModelsService } from "../api/admin";
import { toast } from "../utils/toast";

const TYPE_OPTIONS = ["tire", "rim"];
const SEASON_OPTIONS = ["summer", "winter", "all_season"];

export default function ProductModels() {
  const [data, setData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [brandId, setBrandId] = useState();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    productModelsService
      .list({ search, brand_id: brandId, page })
      .then((res) => {
        setData(res.data.data);
        setTotal(res.data.total);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [search, brandId, page]);

  useEffect(() => {
    brandsService.list({ per_page: 200 }).then((res) => setBrands(res.data.data));
  }, []);

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
    await productModelsService.remove(id);
    toast.success("Silindi");
    load();
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await productModelsService.update(editing.id, values);
      toast.success("Yeniləndi");
    } else {
      await productModelsService.create(values);
      toast.success("Əlavə edildi");
    }
    setModalOpen(false);
    load();
  };

  const brandOptions = brands.map((b) => ({ value: b.id, label: b.name }));

  const columns = [
    { title: "Ad", dataIndex: "name" },
    { title: "Marka", render: (_, r) => r.brand?.name },
    { title: "Tip", dataIndex: "type", render: (v) => <Tag>{v}</Tag> },
    {
      title: "Sezon",
      dataIndex: "season",
      render: (v) => (v ? <Tag color="blue">{v}</Tag> : null),
    },
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
          placeholder="Model axtar..."
          onSearch={(v) => {
            setPage(1);
            setSearch(v);
          }}
          style={{ width: 280 }}
        />
        <Select
          placeholder="Marka filtri"
          allowClear
          style={{ width: 200 }}
          options={brandOptions}
          onChange={(v) => {
            setPage(1);
            setBrandId(v);
          }}
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
        pagination={{
          current: page,
          total,
          pageSize: 50,
          onChange: setPage,
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
          <Form.Item name="brand_id" label="Marka" rules={[{ required: true }]}>
            <Select options={brandOptions} showSearch optionFilterProp="label" />
          </Form.Item>
          <Form.Item name="name" label="Ad" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Tip" rules={[{ required: true }]}>
            <Select options={TYPE_OPTIONS.map((t) => ({ value: t, label: t }))} />
          </Form.Item>
          <Form.Item name="season" label="Sezon">
            <Select
              allowClear
              options={SEASON_OPTIONS.map((s) => ({ value: s, label: s }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
