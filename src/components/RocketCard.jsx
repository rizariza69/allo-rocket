import { Card } from "antd";
import { useNavigate } from "react-router-dom";

const RocketCard = ({ rocket, defaultImage }) => {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      style={{ width: "100%", height: "100%" }}
      cover={
        <img
          alt="rocket"
          src={rocket?.flickr_images?.[0] || defaultImage}
          style={{ height: 200, objectFit: "cover" }}
        />
      }
      onClick={() => navigate(`/rocket/${rocket.id}`)}
    >
      <Card.Meta
        title={rocket.name}
        description={
          rocket.description ? (
            <div style={{ marginTop: 8 }}>
              {rocket.description?.slice(0, 100)}...
            </div>
          ) : (
            <div style={{ marginTop: 8 }}>Belum Ada Deskripsi</div>
          )
        }
      />
    </Card>
  );
};

export default RocketCard;
