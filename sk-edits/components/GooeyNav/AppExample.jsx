import GooeyNav from './GooeyNav';

const coachNavItems = [
  { label: "Overview", href: "#" },
  { label: "Services", href: "#services" },
  { label: "100M+ Portfolio", href: "#portfolio" },
  { label: "Why Us", href: "#comparison" },
  { label: "Packs (₹499)", href: "#pricing" },
  { label: "Contact", href: "#contact" }
];

export default function AppExample() {
  return (
    <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', background: '#E2F0CC', minHeight: '300px' }}>
      <GooeyNav
        items={coachNavItems}
        particleCount={15}
        particleDistances={[90, 10]}
        particleR={100}
        initialActiveIndex={0}
        animationTime={600}
        timeVariance={300}
        colors={[1, 2, 3, 1, 2, 3, 1, 4]}
      />
    </div>
  );
}
