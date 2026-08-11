import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Spin } from "antd";
import { dashboardService } from "../api/admin";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .stats()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" />;

  const cards = [
    { title: "İstifadəçilər", value: stats.users_count },
    { title: "Mağazalar", value: stats.shops_count },
    { title: "Elanlar (cəmi)", value: stats.ads_count },
    { title: "Aktiv elanlar", value: stats.active_ads_count },
    { title: "Gözləyən elanlar", value: stats.pending_ads_count },
    { title: "Satışlar", value: stats.sales_count },
  ];

  return (
    <Row gutter={[16, 16]}>
      {cards.map((c) => (
        <Col xs={24} sm={12} md={8} key={c.title}>
          <Card>
            <Statistic title={c.title} value={c.value} />
          </Card>
        </Col>
      ))}
    </Row>
  );
}
