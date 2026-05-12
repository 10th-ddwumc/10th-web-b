// src/components/lp/LpCard.tsx
import { useNavigate } from "react-router-dom";
import type { Lp } from "../../types/lp";

type LpCardProps = {
  lp: Lp;
};

const getLikeCount = (lp: Lp) => lp.likes?.length ?? 0;

const getTimeText = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 1000 / 60);

  if (minutes < 60) return `${Math.max(minutes, 1)} mins ago`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)} hours ago`;
  return `${Math.floor(minutes / 60 / 24)} days ago`;
};

const LpCard = ({ lp }: LpCardProps) => {
  const navigate = useNavigate();

  return (
    <article className="lp-card" onClick={() => navigate(`/lp/${lp.id}`)}>
      <img src={lp.thumbnail} alt={lp.title} className="lp-card-image" />

      <div className="lp-card-overlay">
        <h3>{lp.title}</h3>
        <div className="lp-card-meta">
          <span>{getTimeText(lp.createdAt)}</span>
          <span>♥ {getLikeCount(lp)}</span>
        </div>
      </div>
    </article>
  );
};

export default LpCard;