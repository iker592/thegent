'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Network } from 'vis-network'
import { DataSet } from 'vis-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, MessageSquare, BookOpen, Compass, Search, User, ChevronRight, ChevronLeft, Moon, Sun } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { useTheme } from 'next-themes'

type Resource = {
  id: string
  title: string
  url: string
  description?: string
}

type Node = {
  id: string
  label: string
  resources: Resource[]
  children?: string[]
}
const mockData: { [key: string]: Node } = {
  root: { id: "root", label: "", resources: [], children: ["tech", "science", "business", "fitness"] },
  
  // Technology
  tech: { id: "tech", label: "Technology", resources: [
    { id: "tech1", title: "Future of Tech", url: "https://example.com/future-tech", description: "Exploring emerging technologies and their potential impact" },
    { id: "tech2", title: "Tech Ethics", url: "https://example.com/tech-ethics", description: "Ethical considerations in technology development and implementation" },
  ], children: ["ai", "web", "cybersecurity", "blockchain"] },
  
  ai: { id: "ai", label: "Artificial Intelligence", resources: [
    { id: "ai1", title: "Understanding Neural Networks", url: "https://example.com/neural-networks", description: "A comprehensive guide to neural network architectures and their applications in modern AI" },
    { id: "ai2", title: "Future of AI", url: "https://example.com/future-ai", description: "Exploring the potential impact and developments in artificial intelligence" },
  ], children: ["ml", "nlp", "cv"] },
  
  ml: { id: "ml", label: "Machine Learning", resources: [
    { id: "ml1", title: "Introduction to Machine Learning", url: "https://example.com/intro-ml", description: "Basic concepts and fundamental principles of machine learning algorithms" },
    { id: "ml2", title: "Deep Learning Fundamentals", url: "https://example.com/deep-learning", description: "Core concepts of deep learning and neural network training" },
  ], children: ["supervised", "unsupervised", "reinforcement"] },
  
  supervised: { id: "supervised", label: "Supervised Learning", resources: [
    { id: "supervised1", title: "Classification Algorithms", url: "https://example.com/classification", description: "Overview of popular classification algorithms in machine learning" },
    { id: "supervised2", title: "Regression Techniques", url: "https://example.com/regression", description: "In-depth look at various regression methods for predictive modeling" },
  ]},
  
  unsupervised: { id: "unsupervised", label: "Unsupervised Learning", resources: [
    { id: "unsupervised1", title: "Clustering Methods", url: "https://example.com/clustering", description: "Exploration of different clustering algorithms and their applications" },
    { id: "unsupervised2", title: "Dimensionality Reduction", url: "https://example.com/dim-reduction", description: "Techniques for reducing data complexity while preserving important features" },
  ]},
  
  reinforcement: { id: "reinforcement", label: "Reinforcement Learning", resources: [
    { id: "reinforcement1", title: "Q-Learning", url: "https://example.com/q-learning", description: "Understanding the fundamentals of Q-learning in reinforcement learning" },
    { id: "reinforcement2", title: "Policy Gradients", url: "https://example.com/policy-gradients", description: "Exploring policy gradient methods for reinforcement learning tasks" },
  ]},
  
  nlp: { id: "nlp", label: "Natural Language Processing", resources: [
    { id: "nlp1", title: "NLP Techniques", url: "https://example.com/nlp-techniques", description: "Overview of various NLP techniques and their applications" },
    { id: "nlp2", title: "Transformers in NLP", url: "https://example.com/transformers", description: "Deep dive into transformer models and their impact on NLP tasks" },
  ], children: ["sentiment-analysis", "machine-translation"] },
  
  "sentiment-analysis": { id: "sentiment-analysis", label: "Sentiment Analysis", resources: [
    { id: "sentiment1", title: "Sentiment Classification", url: "https://example.com/sentiment-classification", description: "Methods for classifying text sentiment using machine learning" },
    { id: "sentiment2", title: "Aspect-Based Sentiment Analysis", url: "https://example.com/aspect-sentiment", description: "Techniques for analyzing sentiment towards specific aspects of a product or service" },
  ]},
  
  "machine-translation": { id: "machine-translation", label: "Machine Translation", resources: [
    { id: "translation1", title: "Neural Machine Translation", url: "https://example.com/neural-mt", description: "Understanding neural network-based approaches to machine translation" },
    { id: "translation2", title: "Low-Resource MT", url: "https://example.com/low-resource-mt", description: "Strategies for machine translation in low-resource language pairs" },
  ]},
  
  cv: { id: "cv", label: "Computer Vision", resources: [
    { id: "cv1", title: "Image Recognition Basics", url: "https://example.com/image-recognition", description: "Fundamentals of image recognition and classification techniques" },
    { id: "cv2", title: "Advanced CV Applications", url: "https://example.com/advanced-cv", description: "Cutting-edge applications of computer vision in various industries" },
  ]},
  
  web: { id: "web", label: "Web Development", resources: [
    { id: "web1", title: "Modern Web Architecture", url: "https://example.com/web-architecture", description: "Overview of current web development architectures and best practices" },
    { id: "web2", title: "Web Performance Optimization", url: "https://example.com/web-performance", description: "Techniques for improving web application performance and user experience" },
  ], children: ["frontend", "backend"] },
  
  frontend: { id: "frontend", label: "Frontend Development", resources: [
    { id: "frontend1", title: "React Best Practices", url: "https://example.com/react-best-practices", description: "Optimizing React applications for performance and maintainability" },
    { id: "frontend2", title: "CSS Architecture", url: "https://example.com/css-architecture", description: "Strategies for organizing and scaling CSS in large applications" },
  ], children: ["react", "vue", "angular"] },
  
  react: { id: "react", label: "React", resources: [
    { id: "react1", title: "React Hooks", url: "https://example.com/react-hooks", description: "Deep dive into React Hooks and their use cases" },
    { id: "react2", title: "React Performance", url: "https://example.com/react-performance", description: "Techniques for optimizing React application performance" },
  ]},
  
  vue: { id: "vue", label: "Vue.js", resources: [
    { id: "vue1", title: "Vue 3 Composition API", url: "https://example.com/vue-composition", description: "Understanding and using the Vue 3 Composition API" },
    { id: "vue2", title: "Vuex State Management", url: "https://example.com/vuex", description: "Managing application state with Vuex in Vue.js applications" },
  ]},
  
  angular: { id: "angular", label: "Angular", resources: [
    { id: "angular1", title: "Angular Components", url: "https://example.com/angular-components", description: "Building and organizing Angular components effectively" },
    { id: "angular2", title: "RxJS in Angular", url: "https://example.com/rxjs-angular", description: "Leveraging RxJS for reactive programming in Angular applications" },
  ]},
  
  backend: { id: "backend", label: "Backend Development", resources: [
    { id: "backend1", title: "API Design Principles", url: "https://example.com/api-design", description: "Best practices for designing robust and scalable APIs" },
    { id: "backend2", title: "Database Optimization", url: "https://example.com/db-optimization", description: "Techniques for improving database performance and query efficiency" },
  ], children: ["nodejs", "python-backend", "java-backend"] },
  
  nodejs: { id: "nodejs", label: "Node.js", resources: [
    { id: "nodejs1", title: "Node.js Performance", url: "https://example.com/nodejs-performance", description: "Optimizing Node.js applications for high performance" },
    { id: "nodejs2", title: "Node.js Microservices", url: "https://example.com/nodejs-microservices", description: "Building scalable microservices architectures with Node.js" },
  ]},
  
  "python-backend": { id: "python-backend", label: "Python Backend", resources: [
    { id: "python1", title: "Django vs Flask", url: "https://example.com/django-vs-flask", description: "Comparing Django and Flask for backend development in Python" },
    { id: "python2", title: "Python Async Programming", url: "https://example.com/python-async", description: "Asynchronous programming techniques in Python for backend development" },
  ]},
  
  "java-backend": { id: "java-backend", label: "Java Backend", resources: [
    { id: "java1", title: "Spring Boot Essentials", url: "https://example.com/spring-boot", description: "Core concepts and best practices for Spring Boot development" },
    { id: "java2", title: "Java Concurrency", url: "https://example.com/java-concurrency", description: "Advanced concurrency patterns in Java for high-performance backends" },
  ]},
  
  cybersecurity: { id: "cybersecurity", label: "Cybersecurity", resources: [
    { id: "cyber1", title: "Network Security Fundamentals", url: "https://example.com/network-security", description: "Essential concepts and practices in network security" },
    { id: "cyber2", title: "Ethical Hacking", url: "https://example.com/ethical-hacking", description: "Introduction to ethical hacking and penetration testing" },
  ], children: ["web-security", "network-security", "cryptography"] },
  
  "web-security": { id: "web-security", label: "Web Security", resources: [
    { id: "websec1", title: "OWASP Top 10", url: "https://example.com/owasp-top-10", description: "Understanding and mitigating the OWASP Top 10 web application security risks" },
    { id: "websec2", title: "XSS Prevention", url: "https://example.com/xss-prevention", description: "Techniques for preventing cross-site scripting (XSS) attacks" },
  ]},
  
  "network-security": { id: "network-security", label: "Network Security", resources: [
    { id: "netsec1", title: "Firewall Configuration", url: "https://example.com/firewall-config", description: "Best practices for configuring firewalls to protect networks" },
    { id: "netsec2", title: "Intrusion Detection Systems", url: "https://example.com/ids", description: "Implementing and managing intrusion detection systems" },
  ]},
  
  cryptography: { id: "cryptography", label: "Cryptography", resources: [
    { id: "crypto1", title: "Public Key Cryptography", url: "https://example.com/public-key-crypto", description: "Understanding public key cryptography and its applications" },
    { id: "crypto2", title: "Blockchain Cryptography", url: "https://example.com/blockchain-crypto", description: "Cryptographic principles used in blockchain technology" },
  ]},
  
  blockchain: { id: "blockchain", label: "Blockchain", resources: [
    { id: "blockchain1", title: "Blockchain Basics", url: "https://example.com/blockchain-basics", description: "Fundamental concepts and workings of blockchain technology" },
    { id: "blockchain2", title: "Smart Contracts", url: "https://example.com/smart-contracts", description: "Understanding and implementing smart contracts on blockchain platforms" },
  ], children: ["cryptocurrency", "defi", "nft"] },
  
  cryptocurrency: { id: "cryptocurrency", label: "Cryptocurrency", resources: [
    { id: "crypto1", title: "Bitcoin Whitepaper", url: "https://example.com/bitcoin-whitepaper", description: "Analysis of the original Bitcoin whitepaper by Satoshi Nakamoto" },
    { id: "crypto2", title: "Altcoins", url: "https://example.com/altcoins", description: "Overview of alternative cryptocurrencies and their unique features" },
  ]},
  
  defi: { id: "defi", label: "Decentralized Finance (DeFi)", resources: [
    { id: "defi1", title: "DeFi Protocols", url: "https://example.com/defi-protocols", description: "Exploration of popular DeFi protocols and their functionalities" },
    { id: "defi2", title: "Yield Farming", url: "https://example.com/yield-farming", description: "Understanding yield farming strategies in DeFi" },
  ]},
  
  nft: { id: "nft", label: "Non-Fungible Tokens (NFTs)", resources: [
    { id: "nft1", title: "NFT Standards", url: "https://example.com/nft-standards", description: "Overview of NFT standards like ERC-721 and ERC-1155" },
    { id: "nft2", title: "NFT Marketplaces", url: "https://example.com/nft-marketplaces", description: "Comparison of popular NFT marketplaces and their features" },
  ]},
  
  // Science
  science: { id: "science", label: "Science", resources: [
    { id: "science1", title: "Scientific Method", url: "https://example.com/scientific-method", description: "Understanding the principles and application of the scientific method" },
    { id: "science2", title: "History of Science", url: "https://example.com/science-history", description: "Exploring the major milestones and figures in scientific history" },
  ], children: ["physics", "biology", "chemistry", "astronomy"] },
  
  physics: { id: "physics", label: "Physics", resources: [
    { id: "physics1", title: "Quantum Mechanics", url: "https://example.com/quantum-mechanics", description: "Introduction to the principles of quantum mechanics" },
    { id: "physics2", title: "Relativity Theory", url: "https://example.com/relativity", description: "Understanding Einstein's theories of special and general relativity" },
  ], children: ["classical-mechanics", "quantum-physics", "astrophysics"] },
  
  "classical-mechanics": { id: "classical-mechanics", label: "Classical Mechanics", resources: [
    { id: "cm1", title: "Newtonian Mechanics", url: "https://example.com/newtonian-mechanics", description: "Fundamentals of Newtonian mechanics and its applications" },
    { id: "cm2", title: "Lagrangian Mechanics", url: "https://example.com/lagrangian-mechanics", description: "Introduction to Lagrangian formulation of classical mechanics" },
  ]},
  
  "quantum-physics": { id: "quantum-physics", label: "Quantum Physics", resources: [
    { id: "qp1", title: "Quantum Entanglement", url: "https://example.com/quantum-entanglement", description: "Exploring the phenomenon of quantum entanglement and its implications" },
    { id: "qp2", title: "Quantum Computing", url: "https://example.com/quantum-computing", description: "Introduction to quantum computing principles and potential applications" },
  ]},
  
  astrophysics: { id: "astrophysics", label: "Astrophysics", resources: [
    { id: "astro1", title: "Black Holes", url: "https://example.com/black-holes", description: "Understanding the nature and properties of black holes" },
    { id: "astro2", title: "Cosmic Inflation", url: "https://example.com/cosmic-inflation", description: "Exploring the theory of cosmic inflation in early universe cosmology" },
  ]},
  
  biology: { id: "biology", label: "Biology", resources: [
    { id: "biology1", title: "Genetics Fundamentals", url: "https://example.com/genetics", description: "Basic principles of genetics and heredity" },
    { id: "biology2", title: "Evolutionary Biology", url: "https://example.com/evolution", description: "Exploring the mechanisms and evidence for biological evolution" },
  ], children: ["molecular-biology", "ecology", "neuroscience"] },
  
  "molecular-biology": { id: "molecular-biology", label: "Molecular Biology", resources: [
    { id: "molbio1", title: "DNA Replication", url: "https://example.com/dna-replication", description: "Understanding the process of DNA replication in living organisms" },
    { id: "molbio2", title: "Gene Expression", url: "https://example.com/gene-expression", description: "Exploring the mechanisms of gene expression and regulation" },
  ]},
  
  ecology: { id: "ecology", label: "Ecology", resources: [
    { id: "eco1", title: "Ecosystem Dynamics", url: "https://example.com/ecosystem-dynamics", description: "Study of interactions within ecosystems and their impact on biodiversity" },
    { id: "eco2", title: "Conservation Biology", url: "https://example.com/conservation-biology", description: "Principles and practices in conservation biology for preserving biodiversity" },
  ]},
  
  neuroscience: { id: "neuroscience", label: "Neuroscience", resources: [
    { id: "neuro1", title: "Brain Structure", url: "https://example.com/brain-structure", description: "Overview of brain anatomy and function" },
    { id: "neuro2", title: "Neuroplasticity", url: "https://example.com/neuroplasticity", description: "Understanding brain plasticity and its implications for learning and recovery" },
  ]},
  
  chemistry: { id: "chemistry", label: "Chemistry", resources: [
    { id: "chemistry1", title: "Organic Chemistry Basics", url: "https://example.com/organic-chem", description: "Introduction to organic compounds and reactions" },
    { id: "chemistry2", title: "Biochemistry", url: "https://example.com/biochemistry", description: "Exploring the chemical processes within living organisms" },
  ], children: ["physical-chemistry", "inorganic-chemistry", "analytical-chemistry"] },
  
  "physical-chemistry": { id: "physical-chemistry", label: "Physical Chemistry", resources: [
    { id: "pchem1", title: "Thermodynamics", url: "https://example.com/thermodynamics", description: "Principles of thermodynamics and their applications in chemistry" },
    { id: "pchem2", title: "Quantum Chemistry", url: "https://example.com/quantum-chemistry", description: "Application of quantum mechanics to chemical systems" },
  ]},
  
  "inorganic-chemistry": { id: "inorganic-chemistry", label: "Inorganic Chemistry", resources: [
    { id: "inorganic1", title: "Coordination Compounds", url: "https://example.com/coordination-compounds", description: "Study of coordination compounds and their properties" },
    { id: "inorganic2", title: "Solid State Chemistry", url: "https://example.com/solid-state-chemistry", description: "Exploration of the synthesis, structure, and properties of solid materials" },
  ]},
  
  "analytical-chemistry": { id: "analytical-chemistry", label: "Analytical Chemistry", resources: [
    { id: "analytical1", title: "Spectroscopy", url: "https://example.com/spectroscopy", description: "Overview of spectroscopic techniques in chemical analysis" },
    { id: "analytical2", title: "Chromatography", url: "https://example.com/chromatography", description: "Principles and applications of chromatographic separation techniques" },
  ]},
  
  astronomy: { id: "astronomy", label: "Astronomy", resources: [
    { id: "astronomy1", title: "Solar System Exploration", url: "https://example.com/solar-system", description: "Overview of our solar system and recent discoveries" },
    { id: "astronomy2", title: "Cosmology", url: "https://example.com/cosmology", description: "Study of the origin and evolution of the universe" },
  ], children: ["planetary-science", "stellar-astronomy", "cosmology"] },
  
  "planetary-science": { id: "planetary-science", label: "Planetary Science", resources: [
    { id: "planet1", title: "Exoplanets", url: "https://example.com/exoplanets", description: "Discovery and characterization of planets outside our solar system" },
    { id: "planet2", title: "Planetary Geology", url: "https://example.com/planetary-geology", description: "Study of the geological features and processes on other planets" },
  ]},
  
  "stellar-astronomy": { id: "stellar-astronomy", label: "Stellar Astronomy", resources: [
    { id: "stellar1", title: "Stellar Evolution", url: "https://example.com/stellar-evolution", description: "Understanding the life cycles of stars" },
    { id: "stellar2", title: "Supernovae", url: "https://example.com/supernovae", description: "Exploration of supernova explosions and their impact on the universe" },
  ]},
  
  cosmology: { id: "cosmology", label: "Cosmology", resources: [
    { id: "cosmo1", title: "Big Bang Theory", url: "https://example.com/big-bang", description: "Overview of the Big Bang theory and evidence supporting it" },
    { id: "cosmo2", title: "Dark Matter and Dark Energy", url: "https://example.com/dark-matter-energy", description: "Exploring the mysteries of dark matter and dark energy in the universe" },
  ]},
  
  // Business
  business: { id: "business", label: "Business", resources: [
    { id: "business1", title: "Business Strategy", url: "https://example.com/business-strategy", description: "Fundamentals of developing and implementing business strategies" },
    { id: "business2", title: "Entrepreneurship", url: "https://example.com/entrepreneurship", description: "Guide to starting and growing a successful business" },
  ], children: ["marketing", "finance", "management", "entrepreneurship"] },
  
  marketing: { id: "marketing", label: "Marketing", resources: [
    { id: "marketing1", title: "Digital Marketing", url: "https://example.com/digital-marketing", description: "Strategies for effective online marketing and customer engagement" },
    { id: "marketing2", title: "Brand Management", url: "https://example.com/brand-management", description: "Techniques for building and maintaining strong brands" },
  ], children: ["content-marketing", "seo", "social-media-marketing"] },
  
  "content-marketing": { id: "content-marketing", label: "Content Marketing", resources: [
    { id: "content1", title: "Content Strategy", url: "https://example.com/content-strategy", description: "Developing effective content strategies for business growth" },
    { id: "content2", title: "Storytelling in Marketing", url: "https://example.com/marketing-storytelling", description: "Leveraging storytelling techniques in content marketing" },
  ]},
  
  seo: { id: "seo", label: "Search Engine Optimization", resources: [
    { id: "seo1", title: "On-Page SEO", url: "https://example.com/on-page-seo", description: "Best practices for optimizing web pages for search engines" },
    { id: "seo2", title: "Link Building Strategies", url: "https://example.com/link-building", description: "Effective techniques for building high-quality backlinks" },
  ]},
  
  "social-media-marketing": { id: "social-media-marketing", label: "Social Media Marketing", resources: [
    { id: "social1", title: "Social Media Strategy", url: "https://example.com/social-media-strategy", description: "Developing comprehensive social media marketing strategies" },
    { id: "social2", title: "Influencer Marketing", url: "https://example.com/influencer-marketing", description: "Leveraging influencers for brand promotion and growth" },
  ]},
  
  finance: { id: "finance", label: "Finance", resources: [
    { id: "finance1", title: "Investment Strategies", url: "https://example.com/investment", description: "Overview of various investment strategies and portfolio management" },
    { id: "finance2", title: "Financial Planning", url: "https://example.com/financial-planning", description: "Principles of personal and corporate financial planning" },
  ], children: ["corporate-finance", "personal-finance", "investment-banking"] },
  
  "corporate-finance": { id: "corporate-finance", label: "Corporate Finance", resources: [
    { id: "corp1", title: "Capital Budgeting", url: "https://example.com/capital-budgeting", description: "Techniques for evaluating and selecting investment projects" },
    { id: "corp2", title: "Financial Risk Management", url: "https://example.com/financial-risk", description: "Strategies for managing financial risks in corporations" },
  ]},
  
  "personal-finance": { id: "personal-finance", label: "Personal Finance", resources: [
    { id: "personal1", title: "Budgeting Basics", url: "https://example.com/budgeting", description: "Fundamental principles of personal budgeting and financial management" },
    { id: "personal2", title: "Retirement Planning", url: "https://example.com/retirement-planning", description: "Strategies for effective long-term retirement planning" },
  ]},
  
  "investment-banking": { id: "investment-banking", label: "Investment Banking", resources: [
    { id: "ib1", title: "Mergers and Acquisitions", url: "https://example.com/mergers-acquisitions", description: "Understanding the process and strategies in M&A transactions" },
    { id: "ib2", title: "IPO Process", url: "https://example.com/ipo-process", description: "Detailed look at the initial public offering (IPO) process" },
  ]},
  
  management: { id: "management", label: "Management", resources: [
    { id: "management1", title: "Leadership Skills", url: "https://example.com/leadership", description: "Developing effective leadership skills in business environments" },
    { id: "management2", title: "Project Management", url: "https://example.com/project-management", description: "Best practices for managing complex projects and teams" },
  ], children: ["human-resources", "operations-management", "strategic-management"] },
  
  "human-resources": { id: "human-resources", label: "Human Resources", resources: [
    { id: "hr1", title: "Talent Acquisition", url: "https://example.com/talent-acquisition", description: "Strategies for attracting and recruiting top talent" },
    { id: "hr2", title: "Employee Engagement", url: "https://example.com/employee-engagement", description: "Techniques for improving employee engagement and satisfaction" },
  ]},
  
  "operations-management": { id: "operations-management", label: "Operations Management", resources: [
    { id: "ops1", title: "Supply Chain Management", url: "https://example.com/supply-chain", description: "Optimizing supply chain processes for efficiency and cost-effectiveness" },
    { id: "ops2", title: "Lean Manufacturing", url: "https://example.com/lean-manufacturing", description: "Implementing lean principles in manufacturing processes" },
  ]},
  
  "strategic-management": { id: "strategic-management", label: "Strategic Management", resources: [
    { id: "strategy1", title: "Competitive Analysis", url: "https://example.com/competitive-analysis", description: "Techniques for analyzing and responding to competitive forces" },
    { id: "strategy2", title: "Business Model Innovation", url: "https://example.com/business-model-innovation", description: "Strategies for innovating and adapting business models" },
  ]},
  
  entrepreneurship: { id: "entrepreneurship", label: "Entrepreneurship", resources: [
    { id: "entrepreneurship1", title: "Startup Fundamentals", url: "https://example.com/startup-basics", description: "Essential knowledge for launching and growing a startup" },
    { id: "entrepreneurship2", title: "Venture Capital", url: "https://example.com/venture-capital", description: "Understanding the venture capital process and fundraising strategies" },
  ], children: ["startup-funding", "business-planning", "growth-strategies"] },
  
  "startup-funding": { id: "startup-funding", label: "Startup Funding", resources: [
    { id: "funding1", title: "Seed Funding", url: "https://example.com/seed-funding", description: "Understanding and securing seed funding for early-stage startups" },
    { id: "funding2", title: "Series A Funding", url: "https://example.com/series-a", description: "Preparing for and navigating the Series A funding round" },
  ]},
  
  "business-planning": { id: "business-planning", label: "Business Planning", resources: [
    { id: "planning1", title: "Business Model Canvas", url: "https://example.com/business-model-canvas", description: "Using the Business Model Canvas for startup planning" },
    { id: "planning2", title: "Financial Projections", url: "https://example.com/financial-projections", description: "Creating realistic financial projections for your startup" },
  ]},
  
  "growth-strategies": { id: "growth-strategies", label: "Growth Strategies", resources: [
    { id: "growth1", title: "Customer Acquisition", url: "https://example.com/customer-acquisition", description: "Strategies for acquiring and retaining customers in startups" },
    { id: "growth2", title: "Scaling Operations", url: "https://example.com/scaling-operations", description: "Best practices for scaling startup operations efficiently" },
  ]},
  
  // Fitness
  fitness: { id: "fitness", label: "Fitness", resources: [
    { id: "fitness1", title: "Fitness Fundamentals", url: "https://example.com/fitness-fundamentals", description: "Basic principles of physical fitness and exercise" },
    { id: "fitness2", title: "Nutrition Basics", url: "https://example.com/nutrition-basics", description: "Essential nutritional concepts for a healthy lifestyle" },
  ], children: ["strength-training", "cardio", "nutrition", "yoga"] }
}

export default function KnowledgeGraph() {
const networkRef = useRef<HTMLDivElement>(null)
const [selectedNode, setSelectedNode] = useState<Node | null>(null)
const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["root", "tech", "science", "business", "fitness"]))
const [network, setNetwork] = useState<Network | null>(null)
const [highlightedNode, setHighlightedNode] = useState<string | null>(null)
const [nodeHistory, setNodeHistory] = useState<string[]>([])
const { theme, setTheme } = useTheme()

useEffect(() => {
  setTheme('dark')
}, [])

useEffect(() => {
  if (!networkRef.current) return

  const nodes = new DataSet(
    Array.from(expandedNodes).map(id => {
      const node = mockData[id]
      if (!node) return null
      return {
        id,
        label: id === "root" ? "" : node.label,
        color: id === "root" 
          ? { background: '#6366f1', border: '#4f46e5' }
          : {
              background: id === highlightedNode ? '#3b82f6' : '#1e293b',
              border: id === highlightedNode ? '#2563eb' : '#475569',
              highlight: { background: '#3b82f6', border: '#2563eb' }
            },
        font: { color: '#e2e8f0', size: 16, face: 'Inter, sans-serif' },
        shape: id === "root" ? "dot" : "box",
        size: id === "root" ? 20 : 30,
      }
    }).filter(node => node !== null)
  )

  const edges = new DataSet(
    Array.from(expandedNodes).flatMap(id => {
      const node = mockData[id]
      if (!node || !node.children) return []
      return node.children
        .filter(childId => expandedNodes.has(childId) && mockData[childId])
        .map(childId => ({
          id: `${id}-${childId}`,
          from: id,
          to: childId,
          color: highlightedNode === id 
            ? { color: '#3b82f6', highlight: '#3b82f6', hover: '#3b82f6' }
            : { color: '#64748b', highlight: '#3b82f6', hover: '#3b82f6' },
          width: 2,
          smooth: { enabled: true, type: 'cubicBezier', roundness: 0.5 }
        }))
    })
  )

  const data = { nodes, edges }

  const options = {
    nodes: {
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      borderWidth: 2,
      shadow: true,
    },
    edges: {
      smooth: { enabled: true, type: 'cubicBezier', roundness: 0.5 },
      color: {
        inherit: false,
        highlight: '#3b82f6',
        hover: '#3b82f6'
      }
    },
    layout: {
      improvedLayout: true,
      randomSeed: 42,
    },
    physics: {
      forceAtlas2Based: {
        gravitationalConstant: -50,
        centralGravity: 0.01,
        springConstant: 0.08,
        springLength: 100,
        damping: 0.4,
        avoidOverlap: 0.8
      },
      maxVelocity: 50,
      solver: 'forceAtlas2Based',
      timestep: 0.35,
      stabilization: { iterations: 150 }
    },
    interaction: { 
      hover: true,
      hoverConnectedEdges: true,
      selectConnectedEdges: true
    }
  }

  try {
    const newNetwork = new Network(networkRef.current, data, options)
    setNetwork(newNetwork)

    newNetwork.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0] as string
        const node = mockData[nodeId]
        if (!node) return

        if (nodeId === "root") {
          setExpandedNodes(new Set(["root", ...mockData.root.children || []]))
          setSelectedNode(null)
          setHighlightedNode(null)
          setNodeHistory([])
        } else {
          setSelectedNode(node)
          setHighlightedNode(nodeId)
          setNodeHistory(prev => [...prev, nodeId])
          
          if (node.children?.length) {
            setExpandedNodes(prev => {
              const newSet = new Set(prev)
              node.children!.forEach(childId => newSet.add(childId))
              return newSet
            })
          }
        }
      } else {
        setSelectedNode(null)
        setHighlightedNode(null)
      }
    })
  } catch (error) {
    console.error("Error initializing network:", error)
  }

  return () => {
    if (network) {
      network.destroy()
    }
  }
}, [expandedNodes, highlightedNode, theme])

const handleNodeClick = (nodeId: string) => {
  const node = mockData[nodeId]
  if (node) {
    setSelectedNode(node)
    setHighlightedNode(nodeId)
    setNodeHistory(prev => [...prev, nodeId])
    if (node.children?.length) {
      setExpandedNodes(prev => {
        const newSet = new Set(prev)
        node.children!.forEach(childId => newSet.add(childId))
        return newSet
      })
    }
    network?.selectNodes([nodeId])
  }
}

const handleBackClick = () => {
  if (nodeHistory.length > 1) {
    const newHistory = [...nodeHistory]
    newHistory.pop() // Remove current node
    const previousNodeId = newHistory[newHistory.length - 1]
    setNodeHistory(newHistory)
    handleNodeClick(previousNodeId)
  }
}

const toggleTheme = () => {
  setTheme(theme === 'dark' ? 'light' : 'dark')
}

return (
  <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 dark:bg-gray-900 dark:text-gray-100">
    <header className="bg-gray-800 border-b border-gray-700 dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-indigo-400" />
              <span className="text-2xl font-bold text-indigo-400">thegent</span>
            </div>
            <nav className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" className="text-gray-300 hover:text-white dark:text-gray-300 dark:hover:text-white">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </Button>
              <Button variant="ghost" className="text-gray-300 hover:text-white dark:text-gray-300 dark:hover:text-white">
                <BookOpen className="mr-2 h-4 w-4" />
                Resources
              </Button>
              <Button variant="ghost" className="text-gray-300 hover:text-white dark:text-gray-300 dark:hover:text-white">
                <Compass className="mr-2 h-4 w-4" />
                Explore
              </Button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white dark:text-gray-300 dark:hover:text-white">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white dark:text-gray-300 dark:hover:text-white">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-gray-300 hover:text-white dark:text-gray-300 dark:hover:text-white">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>

    <div className="flex-grow flex">
      <main className="flex-1 p-4">
        <div ref={networkRef} className="w-full h-[calc(100vh-8rem)] bg-gray-800 rounded-lg shadow-xl dark:bg-gray-800" />
      </main>

      <aside className="w-96 border-l border-gray-700 bg-gray-800 overflow-hidden flex flex-col dark:border-gray-700 dark:bg-gray-800">
        <div className="p-4 border-b border-gray-700 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-indigo-300 dark:text-indigo-300">
              {selectedNode ? selectedNode.label : 'Select a node'}
            </h2>
            {nodeHistory.length > 1 && (
              <Button variant="ghost" size="sm" onClick={handleBackClick}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
          </div>
          {selectedNode && (
            <p className="text-sm text-gray-400 mt-1 dark:text-gray-400">
              {selectedNode.resources.length} resources available
            </p>
          )}
        </div>
        <ScrollArea className="flex-1 p-4">
          {selectedNode ? (
            <div className="space-y-4">
              {selectedNode.resources.map((resource) => (
                <Card key={resource.id} className="bg-gray-900 border-gray-700 dark:bg-gray-900 dark:border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">
                      <Button
                        variant="link"
                        className="text-blue-400 hover:text-blue-300 p-0 h-auto font-medium dark:text-blue-400 dark:hover:text-blue-300"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        {resource.title}
                        <ChevronRight className="h-4 w-4 ml-1 inline" />
                      </Button>
                    </CardTitle>
                    {resource.description && (
                      <CardDescription className="text-gray-400 dark:text-gray-400">
                        {resource.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                </Card>
              ))}
              {selectedNode.children && selectedNode.children.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-indigo-300 mb-2 dark:text-indigo-300">Subnodes</h3>
                  {selectedNode.children.map((childId) => {
                    const childNode = mockData[childId]
                    if (!childNode) return null
                    return (
                      <Button
                        key={childId}
                        variant="ghost"
                        className="w-full justify-start text-left mb-2 text-gray-300 hover:text-white dark:text-gray-300 dark:hover:text-white"
                        onClick={() => handleNodeClick(childId)}
                      >
                        {childNode.label}
                      </Button>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-400 mt-8 dark:text-gray-400">
              <p>Select a node from the graph to view its resources</p>
            </div>
          )}
        </ScrollArea>
      </aside>
    </div>
  </div>
)
}