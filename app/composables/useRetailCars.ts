type RetailCarGallery = {
  exterior: string[]
  interior: string[]
}

type RetailSpec = {
  label: string
  value: string
}

type RetailContentSection = {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
}

type RetailCar = {
  slug: string
  status: string
  title: string
  subtitle: string
  price: string
  year: string
  make: string
  model: string
  mileage: string
  engine: string
  transmission: string
  drive: string
  body: string
  exteriorColour: string
  interiorColour: string
  location: string
  vin: string
  heroImage: string
  cardImage: string
  excerpt: string
  highlights: string[]
  specs: RetailSpec[]
  sections: RetailContentSection[]
  gallery: RetailCarGallery
}

const retailCars: RetailCar[] = [
  {
    slug: '1986-ford-sierra-rs-cosworth',
    status: 'Open to enquiries',
    title: '1986 Ford Sierra RS Cosworth',
    subtitle: 'A highly original two-owner homologation icon with exceptional provenance.',
    price: 'Price on application',
    year: '1986',
    make: 'Ford',
    model: 'Sierra RS Cosworth',
    mileage: '40,000 miles',
    engine: '2.0-litre turbocharged inline-four',
    transmission: '5-speed manual',
    drive: 'RWD',
    body: 'Saloon',
    exteriorColour: 'Black',
    interiorColour: 'Black and red Recaro cloth',
    location: 'London, UK',
    vin: 'Available on request',
    heroImage: '/generated/retail/ford-sierra-card.png',
    cardImage: '/generated/retail/ford-sierra-card.png',
    excerpt:
      'An exceptional, fully documented Sierra RS Cosworth with careful custody, original panels, and a rare ownership file.',
    highlights: [
      '40,000 miles from new',
      'Two former keepers',
      'Complete history file and retained MOT record',
      'Original panels with factory stampings',
      'Stored and maintained by The Car Crowd since 2021'
    ],
    specs: [
      { label: 'Year', value: '1986' },
      { label: 'Engine', value: '2.0 turbo' },
      { label: 'Drive', value: 'RWD' },
      { label: 'Exterior colour', value: 'Black' },
      { label: 'Make', value: 'Ford' },
      { label: 'Transmission', value: '5-speed manual' },
      { label: 'RHD / LHD', value: 'RHD' },
      { label: 'Interior colour', value: 'Black / red Recaro' },
      { label: 'Model', value: 'Sierra RS Cosworth' },
      { label: 'Body', value: 'Saloon' },
      { label: 'Odometer', value: '40,000 miles' },
      { label: 'VIN', value: 'Available on request' }
    ],
    sections: [
      {
        heading: 'Open to enquiries',
        paragraphs: [
          'An exceptional, highly original Sierra RS Cosworth with only 40,000 miles, two owners, and a fully documented provenance file. This is the kind of car where condition, records, and long-term custody matter as much as the model itself.'
        ]
      },
      {
        heading: 'Condition and originality',
        bullets: [
          'Factory-correct engine bay and components',
          'Original Ford-stamped body panels and structure',
          'Clean underside presentation with no visible corrosion concerns',
          'Recaro seats in excellent condition with light driver bolster wear',
          'Refurbished original alloys with matching spare'
        ]
      },
      {
        heading: 'Mechanical',
        bullets: [
          'Turbocharged YB engine pulls strongly and performs as intended',
          'Starts cleanly and drives true to factory specification',
          'OEM suspension and chassis components recently checked',
          'Dry-ice underside treatment applied for long-term preservation'
        ]
      },
      {
        heading: 'History and provenance',
        bullets: [
          'Full service history with stamped book and invoices',
          'MOT records retained from early ownership',
          'Original tax discs present in the file',
          'Featured in period enthusiast coverage'
        ]
      },
      {
        heading: 'Summary',
        paragraphs: [
          'A truly standout RS Cosworth that meets the benchmarks for top-tier collectability: originality, provenance, low mileage, and expert preservation. Cars of this calibre are increasingly scarce and highly sought after among serious Ford collectors.'
        ]
      }
    ],
    gallery: {
      exterior: [
        '/generated/retail/ford-sierra-exterior-1.png',
        '/generated/retail/ford-sierra-exterior-2.png',
        '/generated/retail/ford-sierra-exterior-3.png',
        '/generated/retail/ford-sierra-exterior-4.png',
        '/generated/retail/ford-sierra-exterior-5.png'
      ],
      interior: [
        '/generated/retail/ford-sierra-interior-1.png',
        '/generated/retail/ford-sierra-interior-2.png',
        '/generated/retail/ford-sierra-interior-3.png'
      ]
    }
  },
  {
    slug: '1989-vauxhall-nova-13-sr',
    status: 'Under offer',
    title: '1989 Vauxhall Nova 1.3 SR',
    subtitle: 'A light, honest, and increasingly hard-to-find hot hatch survivor.',
    price: 'Guide: GBP 18,000 - GBP 22,000',
    year: '1989',
    make: 'Vauxhall',
    model: 'Nova 1.3 SR',
    mileage: '58,500 miles',
    engine: '1.3-litre inline-four',
    transmission: '5-speed manual',
    drive: 'FWD',
    body: 'Hatchback',
    exteriorColour: 'Red',
    interiorColour: 'Grey cloth',
    location: 'Birmingham, UK',
    vin: 'Available on request',
    heroImage: '/generated/retail/vauxhall-nova-card.png',
    cardImage: '/generated/retail/vauxhall-nova-card.png',
    excerpt:
      'A period-correct Nova SR with strong history, smart presentation, and the right lightweight hot hatch character.',
    highlights: [
      'Rare surviving SR specification',
      'Recent recommissioning inspection',
      'Original interior trim retained',
      'Strong service invoice file',
      'Dry stored by a long-term enthusiast'
    ],
    specs: [
      { label: 'Year', value: '1989' },
      { label: 'Engine', value: '1.3 petrol' },
      { label: 'Drive', value: 'FWD' },
      { label: 'Exterior colour', value: 'Red' },
      { label: 'Make', value: 'Vauxhall' },
      { label: 'Transmission', value: '5-speed manual' },
      { label: 'RHD / LHD', value: 'RHD' },
      { label: 'Interior colour', value: 'Grey cloth' },
      { label: 'Model', value: 'Nova 1.3 SR' },
      { label: 'Body', value: 'Hatchback' },
      { label: 'Odometer', value: '58,500 miles' },
      { label: 'VIN', value: 'Available on request' }
    ],
    sections: [
      {
        heading: 'Collector context',
        paragraphs: [
          'The Nova SR is moving from nostalgic memory into the serious survivor category. This example presents with the right period stance, a strong maintenance file, and the honest driving character that made these cars so loved.'
        ]
      },
      {
        heading: 'Key highlights',
        bullets: [
          'SR trim and period-correct detailing',
          'Clean interior plastics and original cloth presentation',
          'Recent mechanical inspection and fluid service',
          'No heavy modification programme recorded'
        ]
      },
      {
        heading: 'Next steps',
        paragraphs: [
          'Private inspection is available by appointment. A refundable holding deposit can secure access to the full file and third-party inspection report.'
        ]
      }
    ],
    gallery: {
      exterior: [
        '/generated/retail/vauxhall-nova-card.png',
        '/frontend/assets/images/first_car_carousel.jpg',
        '/frontend/assets/images/car-carosel.png',
        '/generated/restoration-workshop.png'
      ],
      interior: [
        '/frontend/assets/images/ferrari_328_GS.png',
        '/frontend/assets/images/aston_martin_vanquish.png',
        '/frontend/assets/images/porsche.png'
      ]
    }
  },
  {
    slug: '2003-mini-cooper-s-jcw-r53',
    status: 'Open to offers',
    title: '2003 MINI Cooper S JCW R53',
    subtitle: 'A supercharged modern classic with desirable JCW upgrades and usable performance.',
    price: 'Guide: GBP 16,000 - GBP 20,000',
    year: '2003',
    make: 'MINI',
    model: 'Cooper S JCW R53',
    mileage: '34,800 miles',
    engine: '1.6-litre supercharged inline-four',
    transmission: '6-speed manual',
    drive: 'FWD',
    body: 'Hatchback',
    exteriorColour: 'Dark silver',
    interiorColour: 'Black leather',
    location: 'Manchester, UK',
    vin: 'Available on request',
    heroImage: '/generated/retail/mini-cooper-card.png',
    cardImage: '/generated/retail/mini-cooper-card.png',
    excerpt:
      'A low-mileage R53 Cooper S JCW with sharp driver appeal, strong specification, and fast-growing collector interest.',
    highlights: [
      'Factory JCW performance package',
      'Six-speed manual gearbox',
      'Low mileage for age',
      'Comprehensive specialist service history',
      'Clean original cabin and strong paint presentation'
    ],
    specs: [
      { label: 'Year', value: '2003' },
      { label: 'Engine', value: '1.6 supercharged' },
      { label: 'Drive', value: 'FWD' },
      { label: 'Exterior colour', value: 'Dark silver' },
      { label: 'Make', value: 'MINI' },
      { label: 'Transmission', value: '6-speed manual' },
      { label: 'RHD / LHD', value: 'RHD' },
      { label: 'Interior colour', value: 'Black leather' },
      { label: 'Model', value: 'Cooper S JCW R53' },
      { label: 'Body', value: 'Hatchback' },
      { label: 'Odometer', value: '34,800 miles' },
      { label: 'VIN', value: 'Available on request' }
    ],
    sections: [
      {
        heading: 'Why it matters',
        paragraphs: [
          'The R53 Cooper S JCW has the right mix of analogue scale, supercharged response, and usability. The best cars are already separating from ordinary examples through history, mileage, and originality.'
        ]
      },
      {
        heading: 'Condition notes',
        bullets: [
          'Paint and trim present cleanly',
          'Interior bolsters and switchgear remain smart',
          'Supercharger service recorded',
          'Tyres and brakes recently checked'
        ]
      },
      {
        heading: 'Summary',
        paragraphs: [
          'A smart, usable modern classic for the collector who wants genuine driver engagement without stepping into fragile or impractical territory.'
        ]
      }
    ],
    gallery: {
      exterior: [
        '/generated/retail/mini-cooper-card.png',
        '/frontend/assets/images/porsche.jpeg',
        '/generated/porsche-studio.png',
        '/frontend/assets/images/car-carosel.png'
      ],
      interior: [
        '/frontend/assets/images/AstonMartin.jpg',
        '/frontend/assets/images/aston_martin_vanquish.png',
        '/frontend/assets/images/ferrari_berlinetta.png'
      ]
    }
  },
  {
    slug: '1987-peugeot-205-gti-16',
    status: 'Private sale',
    title: '1987 Peugeot 205 GTI 1.6',
    subtitle: 'A beautifully balanced 1980s hot hatch with the right history and presentation.',
    price: 'Guide: GBP 24,000 - GBP 28,000',
    year: '1987',
    make: 'Peugeot',
    model: '205 GTI 1.6',
    mileage: '71,200 miles',
    engine: '1.6-litre inline-four',
    transmission: '5-speed manual',
    drive: 'FWD',
    body: 'Hatchback',
    exteriorColour: 'Black',
    interiorColour: 'Half leather and cloth',
    location: 'Surrey, UK',
    vin: 'Available on request',
    heroImage: '/generated/retail/peugeot-205-card.png',
    cardImage: '/generated/retail/peugeot-205-card.png',
    excerpt:
      'A collector-grade 205 GTI with strong originality, careful maintenance, and the lightweight response that defines the model.',
    highlights: [
      'Desirable early 1.6-litre GTI',
      'Original cabin presentation',
      'Strong maintenance file',
      'Recent specialist setup',
      'Private sale with inspection available'
    ],
    specs: [
      { label: 'Year', value: '1987' },
      { label: 'Engine', value: '1.6 petrol' },
      { label: 'Drive', value: 'FWD' },
      { label: 'Exterior colour', value: 'Black' },
      { label: 'Make', value: 'Peugeot' },
      { label: 'Transmission', value: '5-speed manual' },
      { label: 'RHD / LHD', value: 'RHD' },
      { label: 'Interior colour', value: 'Half leather / cloth' },
      { label: 'Model', value: '205 GTI 1.6' },
      { label: 'Body', value: 'Hatchback' },
      { label: 'Odometer', value: '71,200 miles' },
      { label: 'VIN', value: 'Available on request' }
    ],
    sections: [
      {
        heading: 'Driving appeal',
        paragraphs: [
          'The 205 GTI remains one of the clearest examples of why lightweight analogue cars continue to command attention. It is quick enough, compact enough, and communicative in a way modern hot hatches rarely match.'
        ]
      },
      {
        heading: 'File highlights',
        bullets: [
          'Specialist maintenance invoices retained',
          'Original interior details preserved',
          'Recent geometry and suspension check',
          'Inspection report available to serious buyers'
        ]
      },
      {
        heading: 'Summary',
        paragraphs: [
          'An appealing private-sale 205 GTI for buyers who value originality, honest presentation, and proper mechanical setup.'
        ]
      }
    ],
    gallery: {
      exterior: [
        '/generated/retail/peugeot-205-card.png',
        '/frontend/assets/images/ferrari_berlinetta.png',
        '/generated/ferrari-studio.png',
        '/frontend/assets/images/first_car_carousel.jpg'
      ],
      interior: [
        '/frontend/assets/images/aston_martin_vanquish.png',
        '/frontend/assets/images/AstonMartin.jpg',
        '/frontend/assets/images/porsche.png'
      ]
    }
  }
]

const retailTestimonials = [
  {
    name: 'Harry',
    role: 'Investor',
    quote:
      'The team sourced multiple cars for our shortlist, explained the trade-offs clearly, and kept the process disciplined from first call to final inspection.'
  },
  {
    name: 'Adam',
    role: 'Investor',
    quote:
      'The due-diligence pack made the decision easier. It covered condition, provenance, storage, and the realistic ownership costs before we moved forward.'
  },
  {
    name: 'Liam',
    role: 'Investor',
    quote:
      'Access to off-market conversations was the difference. The Car Crowd knew which cars were worth inspecting and which ones to leave alone.'
  }
]

const retailExpertiseCards = [
  {
    title: 'Network',
    image: '/frontend/assets/images/AstonMartin.jpg',
    text: 'Relationships with collectors, specialists, storage providers, and private sellers help uncover cars before they reach public channels.'
  },
  {
    title: 'Curation',
    image: '/frontend/assets/images/ferrari_berlinetta.png',
    text: 'Every candidate is filtered through provenance, condition, specification, cost basis, and the long-term ownership case.'
  },
  {
    title: 'Expectations',
    image: '/frontend/assets/images/porsche.png',
    text: 'Clear guidance keeps buyers focused on suitable cars, realistic budgets, and the standards required for investment-grade ownership.'
  }
]

const retailProcessSteps = [
  {
    number: '01',
    title: 'Vision and strategy',
    text: 'We define budget, intended use, desired holding period, and the level of originality or usability required before sourcing starts.'
  },
  {
    number: '02',
    title: 'Market intelligence',
    text: 'We activate private conversations and benchmark candidates against recent public and off-market evidence.'
  },
  {
    number: '03',
    title: 'Due diligence',
    text: 'Shortlisted cars are reviewed through inspection, history analysis, ownership checks, and specialist input.'
  },
  {
    number: '04',
    title: 'Secure the asset',
    text: 'We support negotiation, collection, storage, and post-purchase planning so the asset is handled properly.'
  }
]

export const useRetailCars = () => {
  const getRetailCarBySlug = (slug: string) => retailCars.find((car) => car.slug === slug)
  const getRelatedRetailCars = (slug: string) => retailCars.filter((car) => car.slug !== slug).slice(0, 3)

  return {
    cars: retailCars,
    testimonials: retailTestimonials,
    expertiseCards: retailExpertiseCards,
    processSteps: retailProcessSteps,
    getRetailCarBySlug,
    getRelatedRetailCars
  }
}

export type { RetailCar, RetailCarGallery, RetailContentSection, RetailSpec }
