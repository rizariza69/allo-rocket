import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRockets } from "../services/api";
import { getLocalRockets } from "../utils/localStorage";
import { Card, Spin, Alert, Typography, Layout, Button } from "antd";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const RocketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rocket, setRocket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getRockets();
        const local = getLocalRockets();
        const all = [...res.data, ...local];
        const found = all.find((value) => value.id === id);
        setRocket(found);
      } catch {
        setRocket(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Spin fullscreen />;
  if (!rocket) return <Alert message="Rocket not found" type="error" />;

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5", padding: 24 }}>
      <Content style={{ maxWidth: 900, margin: "auto" }}>
        <Card
          cover={
            <img
              alt="rocket"
              src={rocket.flickr_images?.[0] || "https://imgur.com/DaCfMsj.jpg"}
              style={{ maxHeight: 400, objectFit: "cover" }}
            />
          }
        >
          <Title level={2}>{rocket.name}</Title>
          <Paragraph>
            <strong>Description:</strong> {rocket.description || "-"}
          </Paragraph>
          <Paragraph>
            <strong>Cost per Launch:</strong> ${rocket.cost_per_launch || "-"}
          </Paragraph>
          <Paragraph>
            <strong>Country:</strong> {rocket.country || "-"}
          </Paragraph>
          <Paragraph>
            <strong>First Flight:</strong> {rocket.first_flight || "-"}
          </Paragraph>
          <Button
            type="primary"
            onClick={() => navigate("/")}
            style={{ marginTop: 24 }}
          >
            Back to List
          </Button>
        </Card>
      </Content>
    </Layout>
  );
};

export default RocketDetail;
