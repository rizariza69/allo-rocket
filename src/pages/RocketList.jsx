import { useEffect, useState } from "react";
import { getRockets } from "../services/api";
import RocketCard from "../components/RocketCard";
import {
  Row,
  Col,
  Input,
  Button,
  Spin,
  Alert,
  Modal,
  Form,
  Typography,
  Layout,
  Select,
  message,
} from "antd";
import { getLocalRockets, addLocalRocket } from "../utils/localStorage";

const { Title } = Typography;
const { Content, Header } = Layout;

const RocketList = () => {
  const [rockets, setRockets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedName, setSelectedName] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [names, setNames] = useState([]);
  const [countries, setCountries] = useState([]);

  const fetchRockets = async () => {
    try {
      setLoading(true);
      const res = await getRockets();
      const local = getLocalRockets();
      const all = [...res.data, ...local];
      setRockets(all);
      setFiltered(all);
      updateDropdownOptions(all);
      setError(false);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const updateDropdownOptions = (data) => {
    const uniqueNames = [...new Set(data.map((r) => r.name).filter(Boolean))];
    const uniqueCountries = [
      ...new Set(data.map((r) => r.country).filter(Boolean)),
    ];
    setNames(uniqueNames);
    setCountries(uniqueCountries);
  };

  useEffect(() => {
    fetchRockets();
  }, []);

  useEffect(() => {
    filterRockets();
  }, [searchKeyword, selectedName, selectedCountry, rockets]);

  const filterRockets = () => {
    let result = rockets;

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(
        (r) =>
          r.name?.toLowerCase().includes(keyword) ||
          r.description?.toLowerCase().includes(keyword)
      );
    }

    if (selectedName) {
      result = result.filter((r) => r.name === selectedName);
    }

    if (selectedCountry) {
      result = result.filter((r) => r.country === selectedCountry);
    }

    setFiltered(result);
  };

  const onFinishAdd = (values) => {
    const newRocket = {
      ...values,
      id: `local-${Date.now()}`,
      flickr_images: [values.image],
    };
    addLocalRocket(newRocket);
    message.success("✅ Roket berhasil ditambahkan!");
    fetchRockets();
    setIsModalOpen(false);
  };

  const defaultImage = filtered[0]?.flickr_images[0];
  console.log(defaultImage);

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "100px", textAlign: "center" }}>
          <Spin size="large" tip="Memuat data roket..." />
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "100px", textAlign: "center" }}>
          <Alert
            message="Gagal memuat data roket."
            description="Silakan coba lagi dengan klik tombol Retry."
            type="error"
            showIcon
          />
          <Button
            type="primary"
            style={{ marginTop: 16 }}
            onClick={fetchRockets}
          >
            🔄 Retry
          </Button>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Header style={{ background: "#001529", padding: "0 24px" }}>
        <Title
          level={3}
          style={{ color: "white", margin: 0, paddingTop: "12px" }}
        >
          🚀 Allo Rockets
        </Title>
      </Header>

      <Content style={{ padding: "24px" }}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Input.Search
              placeholder="Search name or description"
              allowClear
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              size="large"
            />
          </Col>
          <Col xs={24} sm={8}>
            <Select
              placeholder="Filter by Name"
              allowClear
              value={selectedName}
              onChange={setSelectedName}
              options={names.map((name) => ({ label: name, value: name }))}
              style={{ width: "100%" }}
              size="large"
            />
          </Col>
          <Col xs={24} sm={8}>
            <Select
              placeholder="Filter by Country"
              allowClear
              value={selectedCountry}
              onChange={setSelectedCountry}
              options={countries.map((c) => ({ label: c, value: c }))}
              style={{ width: "100%" }}
              size="large"
            />
          </Col>
        </Row>

        <Row justify="end" style={{ marginBottom: 16 }}>
          <Col>
            <Button
              type="primary"
              size="large"
              onClick={() => setIsModalOpen(true)}
            >
              + Add Rocket
            </Button>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {filtered.length > 0 ? (
            filtered.map((rocket) => (
              <Col key={rocket.id} xs={24} sm={12} md={8} lg={6}>
                <RocketCard rocket={rocket} defaultImage={defaultImage} />
              </Col>
            ))
          ) : (
            <Col span={24}>
              <Alert
                message="Tidak ada roket yang sesuai filter atau pencarian."
                type="info"
                showIcon
              />
            </Col>
          )}
        </Row>
        <Modal
          title="Add New Rocket"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinishAdd}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Nama roket wajib diisi" }]}
            >
              <Input placeholder="e.g. Falcon X" />
            </Form.Item>
            <Form.Item name="country" label="Country">
              <Input placeholder="e.g. USA" />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} placeholder="Describe the rocket..." />
            </Form.Item>
            <Form.Item name="image" label="Image URL">
              <Input placeholder="https://..." />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save Rocket
            </Button>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default RocketList;
