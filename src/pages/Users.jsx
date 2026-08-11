import { useEffect, useState } from "react";
import { Table, Input, Switch, Popconfirm, Button, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { usersService } from "../api/admin";
import { toast } from "../utils/toast";

export default function Users() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = () => {
    setLoading(true);
    usersService
      .list({ search, page })
      .then((res) => {
        setData(res.data.data);
        setTotal(res.data.total);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [search, page]);

  const toggleField = async (record, field) => {
    await usersService.update(record.id, { [field]: !record[field] });
    toast.success("Yeniləndi");
    load();
  };

  const remove = async (id) => {
    await usersService.remove(id);
    toast.success("Silindi");
    load();
  };

  const columns = [
    { title: "Ad", dataIndex: "name" },
    { title: "E-poçt", dataIndex: "email" },
    { title: "Telefon", dataIndex: "phone" },
    { title: "Tip", dataIndex: "user_type" },
    {
      title: "Aktiv",
      dataIndex: "is_active",
      render: (v, record) => (
        <Switch checked={!!v} onChange={() => toggleField(record, "is_active")} />
      ),
    },
    {
      title: "Təsdiqlənib",
      dataIndex: "is_verified",
      render: (v, record) => (
        <Switch checked={!!v} onChange={() => toggleField(record, "is_verified")} />
      ),
    },
    {
      title: "Əməliyyat",
      render: (_, record) => (
        <Popconfirm title="Silinsin?" onConfirm={() => remove(record.id)}>
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
      <Input.Search
        placeholder="Ad, e-poçt, telefon axtar..."
        onSearch={(v) => {
          setPage(1);
          setSearch(v);
        }}
        style={{ maxWidth: 320 }}
      />
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{
          current: page,
          total,
          pageSize: 20,
          onChange: setPage,
        }}
      />
    </Space>
  );
}
