import React from 'react';
import CardNav from './CardNav';
import logo from './logo.svg';

const AppExample = () => {
  const coachItems = [
    {
      label: "Coaching Edits",
      bgColor: "#012F13",
      textColor: "#E2F0CC",
      links: [
        { label: "Talking Head Reels", href: "#services", ariaLabel: "Authority Talking Head Reels" },
        { label: "Client Acquisition Shorts", href: "#services", ariaLabel: "Client Acquisition Shorts" },
        { label: "Zoom & Podcast Repurposing", href: "#services", ariaLabel: "Zoom Repurposing" }
      ]
    },
    {
      label: "100M+ Showcase", 
      bgColor: "#053b19",
      textColor: "#E2F0CC",
      links: [
        { label: "Coach Reels Slider", href: "#portfolio", ariaLabel: "100M Views Portfolio" },
        { label: "Before / After Grade", href: "#before-after", ariaLabel: "Color Grading Comparison" },
        { label: "Why SK Edits", href: "#comparison", ariaLabel: "Why Choose Us" }
      ]
    },
    {
      label: "Packs & Booking",
      bgColor: "linear-gradient(135deg, #8BC53D 0%, #6fa62b 100%)", 
      textColor: "#011207",
      links: [
        { label: "₹499 Starter Offer", href: "#pricing", ariaLabel: "₹499 Offer Pack" },
        { label: "₹1500 Authority Pro", href: "#pricing", ariaLabel: "Authority Pro Pack" },
        { label: "WhatsApp Direct Line", href: "https://wa.me/919876543210", ariaLabel: "Chat on WhatsApp" }
      ]
    }
  ];

  const handleCta = () => {
    const bookingModal = document.getElementById('booking-modal');
    if (bookingModal) {
      bookingModal.classList.add('active');
    } else {
      window.open("https://wa.me/919876543210?text=Hi%20SK%20Edits!%20I%20want%20to%20claim%20the%20%E2%82%B9499%20Offer.", "_blank");
    }
  };

  return (
    <CardNav
      logo={logo}
      logoAlt="SK Edits — For Coaches"
      items={coachItems}
      baseColor="rgba(255, 255, 255, 0.88)"
      menuColor="#012F13"
      buttonBgColor="linear-gradient(135deg, #8BC53D 0%, #72a62e 100%)"
      buttonTextColor="#012F13"
      buttonText="Claim ₹499 Deal"
      onCtaClick={handleCta}
      ease="power3.out"
    />
  );
};

export default AppExample;
