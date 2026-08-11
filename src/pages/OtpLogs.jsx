import { useEffect, useState } from "react";
import { Table, Input, Button, Space } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { otpLogsService } from "../api/admin";
import { toast } from "../utils/toast";

export default function OtpLogs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = () => {
    setLoading(true);
    otpLogsService
      .list({ search, page })
      .then((res) => {
        setData(res.data.data);
        setTotal(res.data.total);
      })
      .catch(() => toast.error("Yüklənmə zamanı xəta baş verdi"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [search, page]);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Kod kopyalandı");
  };

  const isExpired = (record) => new Date(record.expires_at) < new Date();

  const dim = (record) => (isExpired(record) ? { color: "#bfbfbf" } : undefined);

  const columns = [
    {
      title: "E-poçt",
      dataIndex: "email",
      render: (v, record) => <span style={dim(record)}>{v}</span>,
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      render: (v, record) => <span style={dim(record)}>{v}</span>,
    },
    {
      title: "Kod",
      dataIndex: "code",
      render: (code, record) => (
        <Space>
          <code style={{ fontSize: 16, fontWeight: 600, ...dim(record) }}>{code}</code>
          <Button
            size="small"
            icon={<CopyOutlined />}
            onClick={() => copyCode(code)}
            disabled={isExpired(record)}
          />
        </Space>
      ),
    },
    {
      title: "Vaxtı bitir",
      dataIndex: "expires_at",
      render: (v, record) => (
        <span style={dim(record)}>{new Date(v).toLocaleString("az-AZ")}</span>
      ),
    },
    {
      title: "Göndərilib",
      dataIndex: "created_at",
      render: (v, record) => (
        <span style={dim(record)}>{new Date(v).toLocaleString("az-AZ")}</span>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
      <Input.Search
        placeholder="E-poçt, telefon axtar..."
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
