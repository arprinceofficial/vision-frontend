const blogCategories = ['All', 'Markets', 'Build Notes', 'Ownership', 'Events'] as const

type BlogCategory = (typeof blogCategories)[number]

type BlogPostCategory = Exclude<BlogCategory, 'All'>

type BlogPost = {
  slug: string
  category: BlogPostCategory
  date: string
  readTime: string
  image: string
  title: string
  excerpt: string
  author: string
  stat: string
  body: string[]
  takeaways: string[]
}

type FeaturedBlogPost = {
  slug: string
  category: string
  date: string
  readTime: string
  image: string
  title: string
  excerpt: string
  author: string
  body: string[]
  takeaways: string[]
}

type BlogArticle = BlogPost | FeaturedBlogPost

const featuredBlogPost: FeaturedBlogPost = {
  slug: 'documented-modern-classics',
  category: 'Market Thesis',
  date: 'July 18, 2026',
  readTime: '6 min read',
  image: '/generated/hero-aston-studio.png',
  title: 'Why Documented Modern Classics Are Becoming the Serious Collector Segment',
  excerpt:
    'The next wave of collectible cars is being shaped by provenance, mechanical honesty, usable mileage, and the communities that keep each asset visible long after acquisition.',
  author: 'The Car Crowd Research Desk',
  body: [
    'Modern classics are no longer being judged only by headline mileage or nostalgic appeal. The strongest examples are the cars with clean ownership files, specialist maintenance, sympathetic use, and a visible story that can be verified by future buyers.',
    'That matters for syndicate ownership because every member decision leaves a paper trail. Storage, servicing, event use, and valuation updates all become part of the asset history rather than informal notes held by one private owner.',
    'The result is a more disciplined collector segment. Buyers want cars they can understand quickly, compare fairly, and trust when conditions change. Documentation is becoming the bridge between emotional demand and investment discipline.'
  ],
  takeaways: ['Provenance is becoming easier to price', 'Shared ownership benefits from stronger reporting', 'Usable condition can be more valuable than static perfection']
}

const blogPosts: BlogPost[] = [
  {
    slug: 'manual-conversion-premium',
    category: 'Markets',
    date: 'July 12, 2026',
    readTime: '5 min read',
    image: '/frontend/assets/images/AstonMartin.jpg',
    title: 'The Manual Conversion Premium Is No Longer a Niche Collector Signal',
    excerpt:
      'Low-mileage V12 cars with carefully documented manual conversions are pulling attention from both traditional collectors and newer enthusiast investors.',
    author: 'David Miller',
    stat: 'V12 focus',
    body: [
      'Manual conversions used to sit in a difficult corner of the market. Purists worried about originality, while drivers understood the appeal but often lacked confidence in the quality of the work.',
      'That gap is closing when conversions are handled by respected specialists and supported by invoices, inspection reports, and clear before-and-after documentation. For certain V12 cars, the manual experience has become a key part of the ownership thesis.',
      'The important distinction is quality. A conversion does not automatically create a premium. The market rewards the cars where the engineering, parts selection, and documentation can survive serious scrutiny.'
    ],
    takeaways: ['Specialist provenance matters more than the conversion label', 'Manual V12 cars are attracting broader collector demand', 'Incomplete documentation can quickly weaken the premium']
  },
  {
    slug: 'restomod-build-file',
    category: 'Build Notes',
    date: 'July 4, 2026',
    readTime: '4 min read',
    image: '/generated/restoration-workshop.png',
    title: 'What Belongs in a Proper Restomod Build File?',
    excerpt:
      'From teardown images to parts invoices and road-test sheets, the build archive is becoming as important as the finished car.',
    author: 'Sarah Holmes',
    stat: 'Archive led',
    body: [
      'A strong restomod file starts before the first panel comes off. Intake photos, condition notes, ownership checks, and parts decisions give future reviewers a clear view of why the project was scoped the way it was.',
      'During the build, the file should capture fabrication work, paint stages, mechanical upgrades, wiring decisions, supplier records, and quality-control notes. These records protect both the workshop and the owner.',
      'The finished car then needs road-test reports, final specifications, setup sheets, and maintenance guidance. That archive turns a custom build from a subjective object into a documented asset.'
    ],
    takeaways: ['Start documenting before teardown', 'Capture decisions, not only finished photos', 'Final setup sheets help protect long-term value']
  },
  {
    slug: 'porsche-997-turbo',
    category: 'Markets',
    date: 'June 28, 2026',
    readTime: '7 min read',
    image: '/frontend/assets/images/porsche.png',
    title: 'Porsche 997 Turbo Demand and the Mezger Engine Effect',
    excerpt:
      'The 997 generation is moving from usable performance bargain into a more disciplined collector category as supply tightens.',
    author: 'Aaron Carter',
    stat: '997 watch',
    body: [
      'The 997 Turbo sits in a useful position for collectors: modern enough to use, analogue enough to feel distinct, and supported by a deep specialist ecosystem.',
      'Demand is being helped by the reputation of the Mezger engine, but the best cars still separate themselves through specification, service history, originality, and condition. Buyers are becoming less forgiving of gaps.',
      'For syndicate evaluation, the main question is not whether the model is desirable. It is whether a specific example has the history, cost basis, and custody plan to justify long-term ownership.'
    ],
    takeaways: ['Specification remains a major value driver', 'Service history is non-negotiable', 'The strongest examples are increasingly hard to replace']
  },
  {
    slug: 'member-voting',
    category: 'Ownership',
    date: 'June 18, 2026',
    readTime: '5 min read',
    image: '/frontend/assets/images/ferrari_berlinetta.png',
    title: 'How Member Voting Keeps Syndicate Decisions Transparent',
    excerpt:
      'Ownership works better when restoration scope, storage, drive days, and exit windows are discussed openly with members.',
    author: 'Nadia Collins',
    stat: 'Member first',
    body: [
      'Collector assets work best when decisions are made with context. A vote without clear information creates friction, while a vote supported by costs, risks, and specialist advice creates alignment.',
      'Member voting is especially useful around restoration scope, usage access, insurance changes, and exit timing. These decisions directly affect both enjoyment and value preservation.',
      'The process is not about making every operational detail slow. It is about giving members structured input where the outcome materially changes the asset journey.'
    ],
    takeaways: ['Good voting depends on clear briefing notes', 'Members should influence material asset decisions', 'Operational discipline still needs a defined manager']
  },
  {
    slug: 'summer-preview',
    category: 'Events',
    date: 'June 9, 2026',
    readTime: '3 min read',
    image: '/frontend/assets/images/first_car_carousel.jpg',
    title: 'Summer Preview: Private Viewings, Drive Days, and Build Shop Access',
    excerpt:
      'A preview of the member calendar, including workshop walk-throughs, private asset inspections, and small-group drives.',
    author: 'The Car Crowd',
    stat: 'Access',
    body: [
      'The summer calendar is built around smaller groups and closer access. Members consistently get more value from direct time with specialists, build records, and the cars themselves.',
      'Private viewings will focus on condition walkthroughs and valuation context. Drive days will remain limited so usage can be controlled and properly recorded.',
      'Workshop access is also being structured around specific build milestones. That gives members a better understanding of the work without disrupting the people responsible for it.'
    ],
    takeaways: ['Small groups create better access', 'Usage should be controlled and documented', 'Build milestones make workshop visits more useful']
  },
  {
    slug: 'ferrari-328-context',
    category: 'Markets',
    date: 'May 30, 2026',
    readTime: '6 min read',
    image: '/frontend/assets/images/ferrari_328_GS.png',
    title: 'Ferrari 328 GTS: The Quiet Case for Analogue Usability',
    excerpt:
      'A practical, beautiful, and increasingly well-understood entry point into classic Ferrari ownership and shared stewardship.',
    author: 'Marcus Reid',
    stat: 'Analogue',
    body: [
      'The 328 GTS has always had beauty on its side, but its strongest argument may be usability. It gives owners a recognisably classic Ferrari experience without some of the complexity attached to larger flagship cars.',
      'Market confidence is helped by strong specialist support, clear parts knowledge, and a collector base that understands what good condition looks like.',
      'The best examples are not simply the lowest-mileage cars. They are the cars that have been serviced correctly, stored carefully, and used enough to remain mechanically honest.'
    ],
    takeaways: ['Usability supports long-term demand', 'Condition should be judged beyond mileage', 'Specialist support keeps ownership practical']
  },
  {
    slug: 'asset-storage',
    category: 'Ownership',
    date: 'May 21, 2026',
    readTime: '4 min read',
    image: '/frontend/assets/images/assetsmarket.png',
    title: 'Storage, Insurance, and the Hidden Discipline Behind Collector Assets',
    excerpt:
      'Professional custody is not cosmetic. It protects value, keeps paperwork clean, and makes member reporting easier to trust.',
    author: 'Elena Ward',
    stat: 'Custody',
    body: [
      'Collector asset custody starts with the basics: environment, security, battery care, tyre management, fluid checks, and controlled access. None of this is glamorous, but it protects value.',
      'Insurance and storage records also matter for reporting. Members need to know where the car is, how it is covered, who can move it, and what procedures exist when it leaves storage.',
      'Good custody makes future sale preparation easier because the asset history stays clean. Every movement, inspection, and maintenance action can be explained.'
    ],
    takeaways: ['Custody is a value-preservation function', 'Movement logs improve transparency', 'Insurance details belong in member reporting']
  },
  {
    slug: 'aston-preview-notes',
    category: 'Build Notes',
    date: 'May 8, 2026',
    readTime: '5 min read',
    image: '/frontend/assets/images/aston_martin_vanquish.png',
    title: 'Inspection Notes From the Aston Martin Vanquish S Intake',
    excerpt:
      'Paint depth readings, service documents, interior wear, and specialist checks all shape the final acquisition thesis.',
    author: 'David Miller',
    stat: 'Due diligence',
    body: [
      'The intake process starts by separating presentation from condition. A car can photograph beautifully while still needing close inspection of paint, trim, suspension, electronics, and service history.',
      'For the Vanquish S, the focus areas include transmission history, V12 service records, clutch condition, body alignment, and the quality of any specialist work already completed.',
      'The final thesis should be clear enough for a member to understand why the car was selected, what risks remain, and how those risks are being managed.'
    ],
    takeaways: ['Condition checks must go beyond presentation', 'Specialist inspection shapes the acquisition thesis', 'Members should see both strengths and risks']
  },
  {
    slug: 'breakfast-meet',
    category: 'Events',
    date: 'April 26, 2026',
    readTime: '3 min read',
    image: '/frontend/assets/images/car-carosel.png',
    title: 'Breakfast Meet Notes: What Members Asked About Most',
    excerpt:
      'Liquidity, usage access, workshop standards, and exit planning led the conversation at our latest member morning.',
    author: 'The Car Crowd',
    stat: 'Community',
    body: [
      'Member questions at the latest breakfast meet focused less on headline performance and more on process. That is a healthy signal for a maturing ownership community.',
      'Liquidity, exit planning, usage access, and workshop standards led the conversation. Members wanted to understand how decisions are made after the initial allocation closes.',
      'Those questions are now feeding into clearer education content and sharper onboarding materials for future syndicates.'
    ],
    takeaways: ['Members want clarity after allocation', 'Exit planning should be discussed early', 'Events are useful feedback loops']
  }
]

const blogIssueNotes = [
  {
    label: 'Watchlist',
    value: 'Manual V12s',
    detail: 'Supply is thin, but buyer discipline still matters.'
  },
  {
    label: 'Build Desk',
    value: 'Archive quality',
    detail: 'Documentation is moving from nice-to-have to value signal.'
  },
  {
    label: 'Members',
    value: 'Drive access',
    detail: 'Smaller sessions are performing better than large-format events.'
  }
]

export const useBlogPosts = () => {
  const getBlogPostBySlug = (slug: string) => blogPosts.find((post) => post.slug === slug)
  const getBlogArticleBySlug = (slug: string): BlogArticle | undefined => {
    if (featuredBlogPost.slug === slug) {
      return featuredBlogPost
    }

    return getBlogPostBySlug(slug)
  }

  const getRelatedBlogPosts = (slug: string, category?: string) => {
    const related = blogPosts.filter((post) => post.slug !== slug && post.category === category)
    const fallback = blogPosts.filter((post) => post.slug !== slug && post.category !== category)

    return [...related, ...fallback].slice(0, 3)
  }

  return {
    categories: blogCategories,
    featuredPost: featuredBlogPost,
    posts: blogPosts,
    issueNotes: blogIssueNotes,
    getBlogPostBySlug,
    getBlogArticleBySlug,
    getRelatedBlogPosts
  }
}

export type { BlogArticle, BlogCategory, BlogPost, BlogPostCategory, FeaturedBlogPost }
