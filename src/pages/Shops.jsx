import { useEffect, useState } from "react";
import { Table, Input, Switch, Popconfirm, Button, Space, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { shopsService } from "../api/admin";
import { toast } from "../utils/toast";

export default function Shops() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = () => {
    setLoading(true);
    shopsService
      .list({ search, page })
      .then((res) => {
        setData(res.data.data);
        setTotal(res.data.total);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [search, page]);

  const toggleVerified = async (record) => {
    await shopsService.update(record.id, { is_verified: !record.is_verified });
    toast.success("Yeniləndi");
    load();
  };

  const remove = async (id) => {
    await shopsService.remove(id);
    toast.success("Silindi");
    load();
  };

  const columns = [
    { title: "Mağaza adı", dataIndex: "shop_name" },
    { title: "Şəhər", dataIndex: "city" },
    { title: "Sahib", render: (_, r) => r.user?.name },
    {
      title: "Paket",
      dataIndex: "package_type",
      render: (v) => <Tag>{v}</Tag>,
    },
    {
      title: "Təsdiqlənib",
      dataIndex: "is_verified",
      render: (v, record) => <Switch checked={!!v} onChange={() => toggleVerified(record)} />,
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
        placeholder="Mağaza adı, şəhər axtar..."
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
