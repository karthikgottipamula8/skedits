import CountUp from './CountUp';

export default function AppExample() {
  return (
    <div style={{ padding: '40px', background: '#0A0A0A', color: '#fff', textAlign: 'center' }}>
      <h2>Special Offer Pricing</h2>
      <div style={{ fontSize: '3rem', fontWeight: 800, color: '#E50914' }}>
        ₹<CountUp from={0} to={499} separator="," direction="up" duration={2} delay={0.5} className="count-up-text" />
      </div>
    </div>
  );
}
