import { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Modal,
  Popconfirm,
  Image,
  Descriptions,
  Tag,
  Empty,
} from "antd";
import { CheckOutlined, CloseOutlined, EyeOutlined } from "@ant-design/icons";
import { adsService } from "../api/admin";
import { toast } from "../utils/toast";

export default function PendingAds() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionId, setActionId] = useState(null);

  const load = () => {
    setLoading(true);
    adsService
      .getPendingAds({ search, page })
      .then((res) => {
        setData(res.data.data);
        setTotal(res.data.total);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [search, page]);

  const openDetail = (id) => {
    setDetailLoading(true);
    setDetail({});
    adsService
      .getAdDetail(id)
      .then((res) => setDetail(res.data))
      .finally(() => setDetailLoading(false));
  };

  const approve = async (id) => {
    setActionId(id);
    try {
      await adsService.approveAd(id);
      toast.success("Elan təsdiqləndi");
      setDetail(null);
      load();
    } catch {
      // toast göstərilir axios interceptor-da
    } finally {
      setActionId(null);
    }
  };

  const reject = async (id) => {
    setActionId(id);
    try {
      await adsService.rejectAd(id);
      toast.success("Elan imtina edildi və silindi");
      setDetail(null);
      load();
    } catch {
      // toast göstərilir axios interceptor-da
    } finally {
      setActionId(null);
    }
  };

  const columns = [
    {
      title: "Şəkil",
      render: (_, r) => {
        const img = r.images?.[0]?.url || r.images?.[0] || r.image;
        return img ? (
          <Image src={img} width={56} height={56} style={{ objectFit: "cover" }} />
        ) : (
          "—"
        );
      },
    },
    { title: "Başlıq", dataIndex: "title" },
    { title: "Kateqoriya", dataIndex: "category" },
    { title: "Qiymət", dataIndex: "price", render: (v) => `${v} AZN` },
    {
      title: "Satıcı",
      render: (_, r) => r.user?.name || r.user?.shop_name || "—",
    },
    {
      title: "Tip",
      render: (_, r) => r.user?.user_type || "—",
    },
    { title: "Tarix", dataIndex: "created_at", render: (v) => v?.slice(0, 10) },
    {
      title: "Əməliyyat",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => openDetail(record.id)}>
            Bax
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            loading={actionId === record.id}
            onClick={() => approve(record.id)}
          >
            Təsdiq et
          </Button>
          <Popconfirm
            title="Elan imtina edilsin?"
            description="Bu əməliyyat elanı bazadan tam siləcək, geri qaytarıla bilməz."
            okText="Bəli, imtina et"
            cancelText="Ləğv et"
            okButtonProps={{ danger: true }}
            onConfirm={() => reject(record.id)}
          >
            <Button danger icon={<CloseOutlined />} loading={actionId === record.id}>
              İmtina et
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const images = detail?.images?.map((i) => i.url || i) ?? [];
  const specs = detail?.tags ?? detail?.specs ?? [];

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
      <Input.Search
        placeholder="Başlıq axtar..."
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

      <Modal
        open={!!detail}
        onCancel={() => setDetail(null)}
        footer={
          detail?.id
            ? [
                <Popconfirm
                  key="reject"
                  title="Elan imtina edilsin?"
                  description="Bu əməliyyat elanı bazadan tam siləcək, geri qaytarıla bilməz."
                  okText="Bəli, imtina et"
                  cancelText="Ləğv et"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => reject(detail.id)}
                >
                  <Button danger icon={<CloseOutlined />} loading={actionId === detail.id}>
                    İmtina et
                  </Button>
                </Popconfirm>,
                <Button
                  key="approve"
                  type="primary"
                  icon={<CheckOutlined />}
                  loading={actionId === detail.id}
                  onClick={() => approve(detail.id)}
                >
                  Təsdiq et
                </Button>,
              ]
            : null
        }
        width={720}
        title={detail?.title || "Elan detalları"}
        loading={detailLoading}
      >
        {detailLoading || !detail?.id ? (
          <Empty description={detailLoading ? "Yüklənir..." : "Məlumat yoxdur"} />
        ) : (
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            {images.length > 0 && (
              <Image.PreviewGroup>
                <Space wrap>
                  {images.map((src, i) => (
                    <Image key={i} src={src} width={100} height={100} style={{ objectFit: "cover" }} />
                  ))}
                </Space>
              </Image.PreviewGroup>
            )}
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Kateqoriya">{detail.category || "—"}</Descriptions.Item>
              <Descriptions.Item label="Qiymət">{detail.price} AZN</Descriptions.Item>
              <Descriptions.Item label="Şəhər">{detail.city || "—"}</Descriptions.Item>
              <Descriptions.Item label="Satıcı">
                {detail.user?.name || detail.user?.shop_name || "—"} ({detail.user?.user_type || "—"})
              </Descriptions.Item>
              <Descriptions.Item label="Tarix">{detail.created_at?.slice(0, 10)}</Descriptions.Item>
            </Descriptions>
            {specs.length > 0 && (
              <div>
                {specs.map((s, i) => (
                  <Tag key={i}>{typeof s === "string" ? s : s.name || s.label}</Tag>
                ))}
              </div>
            )}
            {detail.description && (
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Təsvir">{detail.description}</Descriptions.Item>
              </Descriptions>
            )}
          </Space>
        )}
      </Modal>
    </Space>
  );
}
