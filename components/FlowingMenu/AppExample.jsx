import FlowingMenu from './FlowingMenu';

const coachItems = [
  { link: '#portfolio', text: 'Coaching Hook Mastery', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&h=400&fit=crop&auto=format' },
  { link: '#before-after', text: 'Dynamic Viral Captions', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&h=400&fit=crop&auto=format' },
  { link: '#pricing', text: '1.5x Revenue Strategy', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&h=400&fit=crop&auto=format' },
  { link: '#contact', text: '24h WhatsApp Turnaround', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&h=400&fit=crop&auto=format' }
];

export default function AppExample() {
  return (
    <div style={{ height: '500px', position: 'relative', width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
      <FlowingMenu
        items={coachItems}
        speed={14}
        textColor="#E2F0CC"
        bgColor="#012F13"
        marqueeBgColor="#8BC53D"
        marqueeTextColor="#011207"
        borderColor="rgba(139, 197, 61, 0.25)"
      />
    </div>
  );
}
