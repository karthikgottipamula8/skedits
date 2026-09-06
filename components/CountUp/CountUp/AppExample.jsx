import CountUp from './CountUp';
import './CountUp.css';

export default function AppExample() {
  return (
    <div style={{ padding: '40px', background: '#0a0a0a', color: '#fff', textAlign: 'center' }}>
      <h2>Special Coach Offer</h2>
      <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#E50914' }}>
        ₹
        <CountUp
          from={0}
          to={499}
          separator=","
          direction="up"
          duration={2}
          className="count-up-text"
          delay={0.5}
        />
      </div>
    </div>
  );
}
