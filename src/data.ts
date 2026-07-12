import { Lighter, Review, FAQ } from './types';

export const lightersData: Lighter[] = [
  {
    id: 'gatsby-gold',
    name: 'The Gatsby Gold',
    tagline: 'Gilded Roaring Twenties Splendor',
    description: 'Carved from solid brass blocks with precise 1.2mm vertical grooves, this petrol lighter delivers a heavy, satisfying double-clack on open. A masterpiece of traditional flint-wheel ignition, evoking the luxurious jazz club atmosphere.',
    price: 145,
    category: 'Luxury',
    fuelType: 'Petrol',
    material: 'Premium Solid Brass with 18K Gold Plating',
    weight: '110g',
    dimensions: '62mm x 37mm x 11mm',
    features: [
      'Authentic flint-wheel ignition with soft candle-flame',
      'Solid brass interior construction for lifetime durability',
      'Double-groove Art Deco linear exterior etching',
      'Windproof chimney shield with 16 geometric ports'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600&h=600',
    isCustomizable: true,
    stock: 7
  },
  {
    id: 'obsidian-noir',
    name: 'The Obsidian Noir',
    tagline: 'Modern High-Frequency Plasma',
    description: 'Designed for the future. Coated in a matte, fingerprint-resistant aerospace obsidian black finish, this rechargeable lighter produces 110kHz high-frequency plasma cross-arcs. Windproof up to gale forces with no flame, smell, or fossil fuel.',
    price: 89,
    category: 'Electric',
    fuelType: 'USB Rechargeable',
    material: 'Zinc Alloy with Matte Obsidian Cerakote',
    weight: '95g',
    dimensions: '74mm x 35mm x 12mm',
    features: [
      'Dual-arc purple high-frequency plasma ignition',
      'LED battery-indicator panel with geometric sidebars',
      'Type-C rapid charging (fully charged in 45 minutes)',
      '10-second automatic shutoff safety lock'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=600&h=600',
    isCustomizable: true,
    stock: 12
  },
  {
    id: 'steampunk-chrono',
    name: 'The Steampunk Chrono',
    tagline: 'Visible Brass & Copper Clockwork',
    description: 'An tribute to Victorian craftsmanship. Utilizing a complex semi-automatic spring arm, pressing the trigger pops the lid and spins the flint wheel simultaneously. Transparent casing parts let you witness the interlocking copper gears in action.',
    price: 125,
    category: 'Vintage',
    fuelType: 'Petrol',
    material: 'Red Copper and Polished Rose-Gold Brass',
    weight: '135g',
    dimensions: '68mm x 42mm x 15mm',
    features: [
      'Semi-automatic spring-lever instant-flick mechanism',
      'Exposed skeleton movement with copper clockwork gears',
      'Sealed wick chamber prevents petrol evaporation for 30+ days',
      'Replaceable flint chamber with brass thumbscrew'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=600&h=600',
    isCustomizable: false,
    stock: 4
  },
  {
    id: 'prism-iridescent',
    name: 'The Prism Jet',
    tagline: 'Triple-Torch High-Velocity Blue Flame',
    description: 'Engaged with a smooth pull-down trigger, this heavy-duty lighter unleashes triple blue jet torch flames focused to a single pinpoint. Built for harsh climates, the windproof jet operates seamlessly at high altitude or freezing temperatures.',
    price: 99,
    category: 'Windproof',
    fuelType: 'Butane Jet',
    material: 'Titanium-coated Alloy with Rainbow Chrome Finish',
    weight: '115g',
    dimensions: '78mm x 38mm x 14mm',
    features: [
      'High-velocity triple-jet windproof blue flame',
      'Built-in slide-out 8mm stainless steel cigar punch',
      'Refillable butane valve with solid brass wheel adjuster',
      'Translucent blue fuel level inspection window'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=600&h=600',
    isCustomizable: true,
    stock: 15
  },
  {
    id: 'heritage-silver',
    name: 'The Heritage Silver',
    tagline: 'Deep Relief Hand-Engraved Scrollwork',
    description: 'For the serious collector. Hand-carved by master artisans, the sterling silver casing features scrolling acanthus vines in deep relief. A heavy pocket-worn weight combined with a classic soft golden flame makes this the pinnacle of smoking accessories.',
    price: 195,
    category: 'Luxury',
    fuelType: 'Petrol',
    material: '925 Sterling Silver Casing',
    weight: '125g',
    dimensions: '60mm x 38mm x 12mm',
    features: [
      'Each piece unique, featuring deep relief hand engraving',
      'Genuine 925 solid sterling silver high-grade outer shell',
      'Crisp signature clicking chime on opening lid',
      'Comes packaged in a heavy leather presentation pouch'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=600&h=600',
    isCustomizable: true,
    stock: 3
  }
];

export const reviewsData: Review[] = [
  {
    id: 'rev-1',
    name: 'Victoria Vance',
    rating: 5,
    comment: 'The Gatsby Gold has an incredible heft. Opening it feels like a ritual — the heavy metal click is music to my ears. The gold plating is pristine, and the custom engraving came out exactly as requested in Art Deco font.',
    date: 'July 2026',
    verified: true
  },
  {
    id: 'rev-2',
    name: 'Darius Thorne',
    rating: 5,
    comment: 'I am a collector, and the Steampunk Chrono is a remarkable piece of engineering. You can actually see the gear ratios rotating when the lid triggers. Extremely well sealed too, no fuel odor or dry wicks!',
    date: 'June 2026',
    verified: true
  },
  {
    id: 'rev-3',
    name: 'Nate H.',
    rating: 4,
    comment: 'The Obsidian Noir plasma lighter is perfect for golf courses. Literally cannot be blown out by wind, charges in my golf cart, and has a battery gauge. Super stealthy, premium satin-matte texture.',
    date: 'May 2026',
    verified: true
  }
];

export const faqsData: FAQ[] = [
  {
    question: 'Are lighters shipped pre-fueled due to safety regulations?',
    answer: 'No. Following international aviation safety rules, all petrol and butane lighters are shipped empty (without fuel). You will need to purchase standard lighter fluid (for Gatsby, Steampunk, and Heritage) or premium butane gas (for Prism Jet) locally before first ignition.',
    category: 'Shipping & Safety'
  },
  {
    question: 'How do electronic plasma lighters work?',
    answer: 'Our plasma lighters (like the Obsidian Noir) use electricity to produce high-voltage cross-beams of plasma. These arcs generate high heat instantly to light cigarettes, candles, or incense, and require zero gas or flint. Just plug them in with any standard USB-C cable.',
    category: 'Technology'
  },
  {
    question: 'What is the customization process for personal engravings?',
    answer: 'We offer precision laser engraving on selected brass, silver, and alloy models. You can enter up to 20 characters and choose between classic, modern, or vintage typographic styles. Because we hand-finish custom items, please allow an additional 24 hours for shipment processing.',
    category: 'Customization'
  },
  {
    question: 'What is your warranty and return policy?',
    answer: 'We provide an unconditional Lifetime Mechanical Warranty on all our lighters. If the hinge, trigger, or wheel fails due to craftsmanship, we will repair or replace it free of charge. Non-customized items can be returned in original packaging within 30 days.',
    category: 'Warranty & Returns'
  }
];
