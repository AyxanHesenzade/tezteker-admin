import { useEffect, useState } from "react";
import { Table, Input, Select, Popconfirm, Button, Space, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { adsService } from "../api/admin";
import { toast } from "../utils/toast";

const STATUS_OPTIONS = ["active", "pending", "expired", "archived", "sold_out"];

export default function Ads() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = () => {
    setLoading(true);
    adsService
      .list({ search, status, page })
      .then((res) => {
        setData(res.data.data);
        setTotal(res.data.total);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [search, status, page]);

  const changeStatus = async (record, value) => {
    await adsService.update(record.id, { status: value });
    toast.success("Yeniləndi");
    load();
  };

  const remove = async (id) => {
    await adsService.remove(id);
    toast.success("Silindi");
    load();
  };

  const columns = [
    { title: "Başlıq", dataIndex: "title" },
    { title: "Satıcı", render: (_, r) => r.user?.name },
    { title: "Şəhər", dataIndex: "city" },
    { title: "Qiymət", dataIndex: "price", render: (v) => `${v} AZN` },
    {
      title: "Status",
      dataIndex: "status",
      render: (v, record) => (
        <Select
          value={v}
          size="small"
          style={{ width: 120 }}
          options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
          onChange={(val) => changeStatus(record, val)}
        />
      ),
    },
    {
      title: "Premium",
      dataIndex: "is_premium",
      render: (v) => (v ? <Tag color="gold">Premium</Tag> : null),
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
      <Space>
        <Input.Search
          placeholder="Elan başlığı axtar..."
          onSearch={(v) => {
            setPage(1);
            setSearch(v);
          }}
          style={{ width: 280 }}
        />
        <Select
          placeholder="Status filtri"
          allowClear
          style={{ width: 160 }}
          options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
          onChange={(v) => {
            setPage(1);
            setStatus(v);
          }}
        />
      </Space>
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
