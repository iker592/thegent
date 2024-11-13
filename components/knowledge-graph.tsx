'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Network } from 'vis-network'
import { DataSet } from 'vis-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Brain, 
  MessageSquare, 
  BookOpen, 
  Compass, 
  Search, 
  User, 
  ChevronRight, 
  ChevronLeft, 
  Moon, 
  Sun,
  PanelRightOpen,
  PanelRightClose 
} from 'lucide-react'
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
    { id: "tech1", title: "Future of Tech", url: "https://calendar.mit.edu/event/6s099_machine_learning_single-cell_cancer_immunotherapy_competition", description: "Exploring emerging technologies and their potential impact" },
    { id: "tech2", title: "Tech Ethics", url: "https://ethics.berkeley.edu/tech-ethics", description: "Ethical considerations in technology development and implementation" },
  ], children: ["ai", "web", "cybersecurity", "blockchain"] },
  
  ai: { id: "ai", label: "Artificial Intelligence", resources: [
    { id: "ai1", title: "Understanding Neural Networks", url: "https://www.coursera.org/specializations/deep-learning", description: "A comprehensive guide to neural network architectures and their applications in modern AI" },
    { id: "ai2", title: "Future of AI", url: "https://www.edx.org/learn/artificial-intelligence/harvard-university-cs50-s-introduction-to-artificial-intelligence-with-python?webview=false&campaign=CS50%27s+Introduction+to+Artificial+Intelligence+with+Python&source=edx&product_category=course", description: "Exploring the potential impact and developments in artificial intelligence" },
  ], children: ["ml", "nlp", "cv"] },
  
  ml: { id: "ml", label: "Machine Learning", resources: [
    { id: "ml1", title: "Introduction to Machine Learning", url: "https://www.coursera.org/learn/machine-learning", description: "Basic concepts and fundamental principles of machine learning algorithms" },
    { id: "ml2", title: "Deep Learning Fundamentals", url: "https://www.fast.ai", description: "Core concepts of deep learning and neural network training" },
  ], children: ["supervised", "unsupervised", "reinforcement"] },
  
  supervised: { id: "supervised", label: "Supervised Learning", resources: [
    { id: "supervised1", title: "Classification Algorithms", url: "https://www.kaggle.com/learn/intro-to-machine-learning", description: "Overview of popular classification algorithms in machine learning" },
    { id: "supervised2", title: "Regression Techniques", url: "https://www.datacamp.com/courses/supervised-learning-with-scikit-learn", description: "In-depth look at various regression methods for predictive modeling" },
  ]},
  
  unsupervised: { id: "unsupervised", label: "Unsupervised Learning", resources: [
    { id: "unsupervised1", title: "Clustering Methods", url: "https://www.coursera.org/learn/cluster-analysis", description: "Exploration of different clustering algorithms and their applications" },
    { id: "unsupervised2", title: "Dimensionality Reduction", url: "https://scikit-learn.org/stable/modules/unsupervised_reduction.html", description: "Techniques for reducing data complexity while preserving important features" },
  ]},
  
  reinforcement: { id: "reinforcement", label: "Reinforcement Learning", resources: [
    { id: "reinforcement1", title: "Q-Learning", url: "https://www.gymlibrary.dev", description: "Understanding the fundamentals of Q-learning in reinforcement learning" },
    { id: "reinforcement2", title: "Policy Gradients", url: "https://spinningup.openai.com/en/latest/algorithms/ppo.html", description: "Exploring policy gradient methods for reinforcement learning tasks" },
  ]},
  
  nlp: { id: "nlp", label: "Natural Language Processing", resources: [
    { id: "nlp1", title: "NLP Techniques", url: "https://www.coursera.org/specializations/natural-language-processing", description: "Overview of various NLP techniques and their applications" },
    { id: "nlp2", title: "Transformers in NLP", url: "https://huggingface.co/learn/nlp-course", description: "Deep dive into transformer models and their impact on NLP tasks" },
  ], children: ["sentiment-analysis", "machine-translation"] },
  
  "sentiment-analysis": { id: "sentiment-analysis", label: "Sentiment Analysis", resources: [
    { id: "sentiment1", title: "Sentiment Classification", url: "https://www.coursera.org/projects/sentiment-analysis-bert", description: "Methods for classifying text sentiment using machine learning" },
    { id: "sentiment2", title: "Aspect-Based Sentiment Analysis", url: "https://paperswithcode.com/task/aspect-based-sentiment-analysis", description: "Techniques for analyzing sentiment towards specific aspects of a product or service" },
  ]},
  
  "machine-translation": { id: "machine-translation", label: "Machine Translation", resources: [
    { id: "translation1", title: "Neural Machine Translation", url: "https://www.statmt.org/book/", description: "Understanding neural network-based approaches to machine translation" },
    { id: "translation2", title: "Low-Resource MT", url: "https://aclanthology.org/venues/low-resource-mt/", description: "Strategies for machine translation in low-resource language pairs" },
  ]},
  
  cv: { id: "cv", label: "Computer Vision", resources: [
    { id: "cv1", title: "Image Recognition Basics", url: "https://cs231n.github.io", description: "Fundamentals of image recognition and classification techniques" },
    { id: "cv2", title: "Advanced CV Applications", url: "https://www.pyimagesearch.com/free-opencv-computer-vision-deep-learning-crash-course", description: "Cutting-edge applications of computer vision in various industries" },
  ]},
  
  web: { id: "web", label: "Web Development", resources: [
    { id: "web1", title: "Modern Web Architecture", url: "https://web.dev/learn", description: "Overview of current web development architectures and best practices" },
    { id: "web2", title: "Web Performance Optimization", url: "https://web.dev/learn/performance", description: "Techniques for improving web application performance and user experience" },
  ], children: ["frontend", "backend"] },

  frontend: { id: "frontend", label: "Frontend Development", resources: [
    { id: "frontend1", title: "React Best Practices", url: "https://react.dev/learn/thinking-in-react", description: "Optimizing React applications for performance and maintainability" },
    { id: "frontend2", title: "CSS Architecture", url: "https://web.dev/learn/css", description: "Strategies for organizing and scaling CSS in large applications" },
  ], children: ["react", "vue", "angular"] },
  
  react: { id: "react", label: "React", resources: [
    { id: "react1", title: "React Hooks", url: "https://react.dev/reference/react", description: "Deep dive into React Hooks and their use cases" },
    { id: "react2", title: "React Performance", url: "https://react.dev/learn/managing-state", description: "Techniques for optimizing React application performance" },
  ]},
  
  vue: { id: "vue", label: "Vue.js", resources: [
    { id: "vue1", title: "Vue 3 Composition API", url: "https://vuejs.org/guide/introduction.html", description: "Understanding and using the Vue 3 Composition API" },
    { id: "vue2", title: "Vuex State Management", url: "https://vuex.vuejs.org", description: "Managing application state with Vuex in Vue.js applications" },
  ]},
  
  angular: { id: "angular", label: "Angular", resources: [
    { id: "angular1", title: "Angular Components", url: "https://angular.io/guide/component-overview", description: "Building and organizing Angular components effectively" },
    { id: "angular2", title: "RxJS in Angular", url: "https://rxjs.dev/guide/overview", description: "Leveraging RxJS for reactive programming in Angular applications" },
  ]},
  
  backend: { id: "backend", label: "Backend Development", resources: [
    { id: "backend1", title: "API Design Principles", url: "https://github.com/microsoft/api-guidelines", description: "Best practices for designing robust and scalable APIs" },
    { id: "backend2", title: "Database Optimization", url: "https://use-the-index-luke.com", description: "Techniques for improving database performance and query efficiency" },
  ], children: ["nodejs", "python-backend", "java-backend"] },
  
  nodejs: { id: "nodejs", label: "Node.js", resources: [
    { id: "nodejs1", title: "Node.js Performance", url: "https://nodejs.dev/learn", description: "Optimizing Node.js applications for high performance" },
    { id: "nodejs2", title: "Node.js Microservices", url: "https://microservices.io/patterns/microservices.html", description: "Building scalable microservices architectures with Node.js" },
  ]},
  
  "python-backend": { id: "python-backend", label: "Python Backend", resources: [
    { id: "python1", title: "Django vs Flask", url: "https://www.fullstackpython.com/frameworks.html", description: "Comparing Django and Flask for backend development in Python" },
    { id: "python2", title: "Python Async Programming", url: "https://fastapi.tiangolo.com/async", description: "Asynchronous programming techniques in Python for backend development" },
  ]},
  
  "java-backend": { id: "java-backend", label: "Java Backend", resources: [
    { id: "java1", title: "Spring Boot Essentials", url: "https://spring.io/guides", description: "Core concepts and best practices for Spring Boot development" },
    { id: "java2", title: "Java Concurrency", url: "https://docs.oracle.com/javase/tutorial/essential/concurrency", description: "Advanced concurrency patterns in Java for high-performance backends" },
  ]},
  
  cybersecurity: { id: "cybersecurity", label: "Cybersecurity", resources: [
    { id: "cyber1", title: "Network Security Fundamentals", url: "https://www.cybrary.it/course/comptia-network-plus", description: "Essential concepts and practices in network security" },
    { id: "cyber2", title: "Ethical Hacking", url: "https://www.hackthebox.com", description: "Introduction to ethical hacking and penetration testing" },
  ], children: ["web-security", "network-security", "cryptography"] },
  
  "web-security": { id: "web-security", label: "Web Security", resources: [
    { id: "websec1", title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten", description: "Understanding and mitigating the OWASP Top 10 web application security risks" },
    { id: "websec2", title: "XSS Prevention", url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html", description: "Techniques for preventing cross-site scripting (XSS) attacks" },
  ]},
  
  "network-security": { id: "network-security", label: "Network Security", resources: [
    { id: "netsec1", title: "Firewall Configuration", url: "https://www.cisco.com/c/en/us/support/docs/security/asa-5500-x-series-next-generation-firewalls/115904-asa-config-dmz-00.html", description: "Best practices for configuring firewalls to protect networks" },
    { id: "netsec2", title: "Intrusion Detection Systems", url: "https://www.snort.org/documents", description: "Implementing and managing intrusion detection systems" },
  ]},
  
  cryptography: { id: "cryptography", label: "Cryptography", resources: [
    { id: "crypto1", title: "Public Key Cryptography", url: "https://www.coursera.org/learn/crypto", description: "Understanding public key cryptography and its applications" },
    { id: "crypto2", title: "Blockchain Cryptography", url: "https://z.cash/technology/zksnarks", description: "Cryptographic principles used in blockchain technology" },
  ]},
  
  blockchain: { id: "blockchain", label: "Blockchain", resources: [
    { id: "blockchain1", title: "Blockchain Basics", url: "https://ethereum.org/en/developers/learning-tools", description: "Fundamental concepts and workings of blockchain technology" },
    { id: "blockchain2", title: "Smart Contracts", url: "https://cryptozombies.io", description: "Understanding and implementing smart contracts on blockchain platforms" },
  ], children: ["cryptocurrency", "defi", "nft"] },
  
  cryptocurrency: { id: "cryptocurrency", label: "Cryptocurrency", resources: [
    { id: "crypto1", title: "Bitcoin Whitepaper", url: "https://bitcoin.org/bitcoin.pdf", description: "Analysis of the original Bitcoin whitepaper by Satoshi Nakamoto" },
    { id: "crypto2", title: "Altcoins", url: "https://academy.binance.com/en/articles/what-are-altcoins", description: "Overview of alternative cryptocurrencies and their unique features" },
  ]},
  
  defi: { id: "defi", label: "Decentralized Finance (DeFi)", resources: [
    { id: "defi1", title: "DeFi Protocols", url: "https://chain.link/education/defi", description: "Exploration of popular DeFi protocols and their functionalities" },
    { id: "defi2", title: "Yield Farming", url: "https://academy.binance.com/en/articles/what-is-yield-farming-in-decentralized-finance-defi", description: "Understanding yield farming strategies in DeFi" },
  ]},
  
  nft: { id: "nft", label: "Non-Fungible Tokens (NFTs)", resources: [
    { id: "nft1", title: "NFT Standards", url: "https://ethereum.org/en/nft", description: "Overview of NFT standards like ERC-721 and ERC-1155" },
    { id: "nft2", title: "NFT Marketplaces", url: "https://opensea.io/learn", description: "Comparison of popular NFT marketplaces and their features" },
  ]},
  
  // Science
  science: { id: "science", label: "Science", resources: [
    { id: "science1", title: "Scientific Method", url: "https://www.khanacademy.org/science/high-school-biology/hs-biology-foundations/hs-biology-and-the-scientific-method/a/the-science-of-biology", description: "Understanding the principles and application of the scientific method" },
    { id: "science2", title: "History of Science", url: "https://www.britannica.com/science/history-of-science", description: "Exploring the major milestones and figures in scientific history" },
  ], children: ["physics", "biology", "chemistry", "astronomy"] },
   
  physics: { id: "physics", label: "Physics", resources: [
    { id: "physics1", title: "Quantum Mechanics", url: "https://www.edx.org/learn/quantum-mechanics/massachusetts-institute-of-technology-quantum-mechanics", description: "Introduction to the principles of quantum mechanics" },
    { id: "physics2", title: "Relativity Theory", url: "https://www.coursera.org/learn/einstein-relativity", description: "Understanding Einstein's theories of special and general relativity" },
  ], children: ["classical-mechanics", "quantum-physics", "astrophysics"] },
  
  "classical-mechanics": { id: "classical-mechanics", label: "Classical Mechanics", resources: [
    { id: "cm1", title: "Newtonian Mechanics", url: "https://www.khanacademy.org/science/physics/forces-newtons-laws", description: "Fundamentals of Newtonian mechanics and its applications" },
    { id: "cm2", title: "Lagrangian Mechanics", url: "https://www.physics.harvard.edu/files/physics/files/classical_mechanics_chapter1.pdf", description: "Introduction to Lagrangian formulation of classical mechanics" },
  ]},
  
  "quantum-physics": { id: "quantum-physics", label: "Quantum Physics", resources: [
    { id: "qp1", title: "Quantum Entanglement", url: "https://www.quantumphysics.mit.edu/", description: "Exploring the phenomenon of quantum entanglement and its implications" },
    { id: "qp2", title: "Quantum Computing", url: "https://quantum.country/qcvc", description: "Introduction to quantum computing principles and potential applications" },
  ]},
  
  astrophysics: { id: "astrophysics", label: "Astrophysics", resources: [
    { id: "astro1", title: "Black Holes", url: "https://science.nasa.gov/astrophysics/focus-areas/black-holes", description: "Understanding the nature and properties of black holes" },
    { id: "astro2", title: "Cosmic Inflation", url: "https://www.cfa.harvard.edu/research/topic/cosmic-inflation", description: "Exploring the theory of cosmic inflation in early universe cosmology" },
  ]},
  
  biology: { id: "biology", label: "Biology", resources: [
    { id: "biology1", title: "Genetics Fundamentals", url: "https://www.khanacademy.org/science/biology/classical-genetics", description: "Basic principles of genetics and heredity" },
    { id: "biology2", title: "Evolutionary Biology", url: "https://evolution.berkeley.edu/evolibrary/home.php", description: "Exploring the mechanisms and evidence for biological evolution" },
  ], children: ["molecular-biology", "ecology", "neuroscience"] },
  
  "molecular-biology": { id: "molecular-biology", label: "Molecular Biology", resources: [
    { id: "molbio1", title: "DNA Replication", url: "https://www.nature.com/scitable/topic/dna-replication-and-causes-of-mutation-409", description: "Understanding the process of DNA replication in living organisms" },
    { id: "molbio2", title: "Gene Expression", url: "https://www.ncbi.nlm.nih.gov/books/NBK26872/", description: "Exploring the mechanisms of gene expression and regulation" },
  ]},
  
  ecology: { id: "ecology", label: "Ecology", resources: [
    { id: "eco1", title: "Ecosystem Dynamics", url: "https://www.natureserve.org/biodiversity-science/publications", description: "Study of interactions within ecosystems and their impact on biodiversity" },
    { id: "eco2", title: "Conservation Biology", url: "https://conbio.org/publications/conservation-biology", description: "Principles and practices in conservation biology for preserving biodiversity" },
  ]},
  
  neuroscience: { id: "neuroscience", label: "Neuroscience", resources: [
    { id: "neuro1", title: "Brain Structure", url: "https://www.brainfacts.org/brain-anatomy-and-function", description: "Overview of brain anatomy and function" },
    { id: "neuro2", title: "Neuroplasticity", url: "https://www.brainfacts.org/brain-anatomy-and-function/learning-and-memory", description: "Understanding brain plasticity and its implications for learning and recovery" },
  ]},
  
  chemistry: { id: "chemistry", label: "Chemistry", resources: [
    { id: "chemistry1", title: "Organic Chemistry Basics", url: "https://www.khanacademy.org/science/organic-chemistry", description: "Introduction to organic compounds and reactions" },
    { id: "chemistry2", title: "Biochemistry", url: "https://www.khanacademy.org/science/biology/chemistry--of-life", description: "Exploring the chemical processes within living organisms" },
  ], children: ["physical-chemistry", "inorganic-chemistry", "analytical-chemistry"] },
  
  "physical-chemistry": { id: "physical-chemistry", label: "Physical Chemistry", resources: [
    { id: "pchem1", title: "Thermodynamics", url: "https://www.khanacademy.org/science/physics/thermodynamics", description: "Principles of thermodynamics and their applications in chemistry" },
    { id: "pchem2", title: "Quantum Chemistry", url: "https://www.coursera.org/learn/physical-chemistry", description: "Application of quantum mechanics to chemical systems" },
  ]},
  
  "inorganic-chemistry": { id: "inorganic-chemistry", label: "Inorganic Chemistry", resources: [
    { id: "inorganic1", title: "Coordination Compounds", url: "https://chem.libretexts.org/Courses/University_of_California_Davis/UCD_Chem_124A", description: "Study of coordination compounds and their properties" },
    { id: "inorganic2", title: "Solid State Chemistry", url: "https://ocw.mit.edu/courses/3-091-introduction-to-solid-state-chemistry-fall-2018/", description: "Exploration of the synthesis, structure, and properties of solid materials" },
  ]},
  
  "analytical-chemistry": { id: "analytical-chemistry", label: "Analytical Chemistry", resources: [
    { id: "analytical1", title: "Spectroscopy", url: "https://chem.libretexts.org/Courses/University_of_California_Davis/UCD_Chem_115_-_Analytical_Chemistry", description: "Overview of spectroscopic techniques in chemical analysis" },
    { id: "analytical2", title: "Chromatography", url: "https://www.chromacademy.com/channels/hplc-training-courses/", description: "Principles and applications of chromatographic separation techniques" },
  ]},
  
  astronomy: { id: "astronomy", label: "Astronomy", resources: [
    { id: "astronomy1", title: "Solar System Exploration", url: "https://solarsystem.nasa.gov/", description: "Overview of our solar system and recent discoveries" },
    { id: "astronomy2", title: "Cosmology", url: "https://www.coursera.org/learn/astronomy", description: "Study of the origin and evolution of the universe" },
  ], children: ["planetary-science", "stellar-astronomy", "cosmology"] },
  
  "planetary-science": { id: "planetary-science", label: "Planetary Science", resources: [
    { id: "planet1", title: "Exoplanets", url: "https://exoplanets.nasa.gov/", description: "Discovery and characterization of planets outside our solar system" },
    { id: "planet2", title: "Planetary Geology", url: "https://www.planetary.org/learn", description: "Study of the geological features and processes on other planets" },
  ]},
  
  "stellar-astronomy": { id: "stellar-astronomy", label: "Stellar Astronomy", resources: [
    { id: "stellar1", title: "Stellar Evolution", url: "https://science.nasa.gov/astrophysics/focus-areas/how-do-stars-form-and-evolve", description: "Understanding the life cycles of stars" },
    { id: "stellar2", title: "Supernovae", url: "https://imagine.gsfc.nasa.gov/science/objects/supernovae1.html", description: "Exploration of supernova explosions and their impact on the universe" },
  ]},
  
  cosmology: { id: "cosmology", label: "Cosmology", resources: [
    { id: "cosmo1", title: "Big Bang Theory", url: "https://www.space.com/25126-big-bang-theory.html", description: "Overview of the Big Bang theory and evidence supporting it" },
    { id: "cosmo2", title: "Dark Matter and Dark Energy", url: "https://www.nasa.gov/science/dark-matter-dark-energy", description: "Exploring the mysteries of dark matter and dark energy in the universe" },
  ]},
  
  // Business
  business: { id: "business", label: "Business", resources: [
    { id: "business1", title: "Business Strategy", url: "https://www.coursera.org/learn/strategic-management", description: "Fundamentals of developing and implementing business strategies" },
    { id: "business2", title: "Entrepreneurship", url: "https://www.edx.org/learn/entrepreneurship", description: "Guide to starting and growing a successful business" },
  ], children: ["marketing", "finance", "management", "entrepreneurship"] },
  
  marketing: { id: "marketing", label: "Marketing", resources: [
    { id: "marketing1", title: "Digital Marketing", url: "https://www.hubspot.com/resources/courses", description: "Strategies for effective online marketing and customer engagement" },
    { id: "marketing2", title: "Brand Management", url: "https://www.coursera.org/learn/brand-management", description: "Techniques for building and maintaining strong brands" },
  ], children: ["content-marketing", "seo", "social-media-marketing"] },
  
  "content-marketing": { id: "content-marketing", label: "Content Marketing", resources: [
    { id: "content1", title: "Content Strategy", url: "https://www.semrush.com/academy/", description: "Developing effective content strategies for business growth" },
    { id: "content2", title: "Digital Marketing Essentials", url: "https://www.udacity.com/blog/2020/01/the-essential-guide-to-digital-marketing.html", description: "Essentials of digital marketing" },
  ]},
  
  seo: { id: "seo", label: "Search Engine Optimization", resources: [
    { id: "seo1", title: "On-Page SEO", url: "https://moz.com/beginners-guide-to-seo", description: "Best practices for optimizing web pages for search engines" },
    { id: "seo2", title: "Link Building Strategies", url: "https://ahrefs.com/academy", description: "Effective techniques for building high-quality backlinks" },
  ]},
  
  "social-media-marketing": { id: "social-media-marketing", label: "Social Media Marketing", resources: [
    { id: "social1", title: "Social Media Strategy", url: "https://www.hootsuite.com/academy", description: "Developing comprehensive social media marketing strategies" },
    { id: "social2", title: "Influencer Marketing", url: "https://www.coursera.org/gb/articles/influencer-marketing?utm_medium=sem&utm_source=gg&utm_campaign=B2C_EMEA__coursera_FTCOF_career-academy_pmax-multiple-audiences-country-multi&campaignid=20858198824&adgroupid=&device=c&keyword=&matchtype=&network=x&devicemodel=&adposition=&creativeid=&hide_mobile_promo&gad_source=1&gclid=CjwKCAiAudG5BhAREiwAWMlSjFFMsyR-fxVrp4dUnuYSrBPLm2B3aMqE355PFXvmYKMOjbG7B2LjnxoCHxYQAvD_BwE", description: "Leveraging influencers for brand promotion and growth" },
  ]},
  
  finance: { id: "finance", label: "Finance", resources: [
    { id: "finance1", title: "Investment Strategies", url: "https://www.investopedia.com/articles/basics/11/3-s-simple-investing.asp", description: "Overview of various investment strategies and portfolio management" },
    { id: "finance2", title: "Financial Planning", url: "https://www.khanacademy.org/college-careers-more/personal-finance", description: "Principles of personal and corporate financial planning" },
  ], children: ["corporate-finance", "personal-finance", "investment-banking"] },
  
  "corporate-finance": { id: "corporate-finance", label: "Corporate Finance", resources: [
    { id: "corp1", title: "Capital Budgeting", url: "https://corporatefinanceinstitute.com/resources/capital-budgeting/", description: "Techniques for evaluating and selecting investment projects" },
    { id: "corp2", title: "Financial Risk Management", url: "https://www.cfa.org/", description: "Strategies for managing financial risks in corporations" },
  ]},
  
  "personal-finance": { id: "personal-finance", label: "Personal Finance", resources: [
    { id: "personal1", title: "Budgeting Basics", url: "https://www.nerdwallet.com/article/finance/how-to-budget", description: "Fundamental principles of personal budgeting and financial management" },
    { id: "personal2", title: "Retirement Planning", url: "https://investor.vanguard.com/investor-resources-education/education/retirement", description: "Strategies for effective long-term retirement planning" },
  ]},
  
  "investment-banking": { id: "investment-banking", label: "Investment Banking", resources: [
    { id: "ib1", title: "Mergers and Acquisitions", url: "https://corporatefinanceinstitute.com/resources/mergers-acquisitions/", description: "Understanding the process and strategies in M&A transactions" },
    { id: "ib2", title: "IPO Process", url: "https://www.nyse.com/education/ipos", description: "Detailed look at the initial public offering (IPO) process" },
  ]},
  
  management: { id: "management", label: "Management", resources: [
    { id: "management1", title: "Leadership Skills", url: "https://www.coursera.org/specializations/leading-teams", description: "Developing effective leadership skills in business environments" },
    { id: "management2", title: "Project Management", url: "https://www.pmi.org/learning/training-development", description: "Best practices for managing complex projects and teams" },
  ], children: ["human-resources", "operations-management", "strategic-management"] },
  
  "human-resources": { id: "human-resources", label: "Human Resources", resources: [
    { id: "hr1", title: "Talent Acquisition", url: "https://www.globalization-partners.com/blog/how-to-build-an-effective-talent-management-strategy/?utm_keyword=&utm_device=c&utm_source=Adwords&utm_medium=cpc&utm_campaign=ireland__search__dynamic__[en]&utm_content=dynamic&utm_term=&gad_source=1&gclid=CjwKCAiAudG5BhAREiwAWMlSjB6s0AH3jjygQIan-9eRPeZ-aET9LB23lC-D-Eb31VNEzWpclYgvjhoChIYQAvD_BwE", description: "Strategies for attracting and recruiting top talent" },
    { id: "hr2", title: "Employee Engagement", url: "https://www.rippling.com/blog/how-to-improve-employee-engagement", description: "Techniques for improving employee engagement and satisfaction" },
  ]},
  
  "operations-management": { id: "operations-management", label: "Operations Management", resources: [
    { id: "ops1", title: "Supply Chain Management", url: "https://www.edx.org/learn/supply-chain-management", description: "Optimizing supply chain processes for efficiency and cost-effectiveness" },
    { id: "ops2", title: "Lean Manufacturing", url: "https://www.lean.org/explore-lean/", description: "Implementing lean principles in manufacturing processes" },
  ]},
  
  "strategic-management": { id: "strategic-management", label: "Strategic Management", resources: [
    { id: "strategy1", title: "Competitive Analysis", url: "https://youexec.com/book-summaries/competitive-strategy-by-michael-porter", description: "Techniques for analyzing and responding to competitive forces" },
    { id: "strategy2", title: "Business Model Innovation", url: "https://www.qmarkets.net/resources/article/business-model-innovation/", description: "Strategies for innovating and adapting business models" },
  ]},
  
  entrepreneurship: { id: "entrepreneurship", label: "Entrepreneurship", resources: [
    { id: "entrepreneurship1", title: "Startup Fundamentals", url: "https://www.ycombinator.com/library", description: "Essential knowledge for launching and growing a startup" },
    { id: "entrepreneurship2", title: "Venture Capital", url: "https://www.kauffman.org/entrepreneurship/", description: "Understanding the venture capital process and fundraising strategies" },
  ], children: ["startup-funding", "business-planning", "growth-strategies"] },
  
  "startup-funding": { id: "startup-funding", label: "Startup Funding", resources: [
    { id: "funding1", title: "Seed Funding", url: "https://www.seedinvest.com/academy", description: "Understanding and securing seed funding for early-stage startups" },
    { id: "funding2", title: "Series A Funding", url: "https://www.venturelab.ca/resources", description: "Preparing for and navigating the Series A funding round" },
  ]},
  
  "business-planning": { id: "business-planning", label: "Business Planning", resources: [
    { id: "planning1", title: "Business Model Canvas", url: "https://www.strategyzer.com/business-model-canvas", description: "Using the Business Model Canvas for startup planning" },
    { id: "planning2", title: "Financial Projections", url: "https://www.score.org/resource/business-planning-financial-statements-template-gallery", description: "Creating realistic financial projections for your startup" },
  ]},
  
  "growth-strategies": { id: "growth-strategies", label: "Growth Strategies", resources: [
    { id: "growth1", title: "Customer Acquisition", url: "https://www.hubspot.com/customer-acquisition", description: "Strategies for acquiring and retaining customers in startups" },
    { id: "growth2", title: "Scaling Operations", url: "https://www.techstars.com/entrepreneurs", description: "Best practices for scaling startup operations efficiently" },
  ]},
  
  // Fitness
  fitness: { id: "fitness", label: "Fitness", resources: [
    { id: "fitness1", title: "Fitness Fundamentals", url: "https://www.physio-pedia.com/Principles_of_Exercise", description: "Basic principles of physical fitness and exercise" },
    { id: "fitness2", title: "Nutrition Basics", url: "https://www.nutrition.gov/topics/basic-nutrition", description: "Essential nutritional concepts for a healthy lifestyle" },
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
  const [isSidebarOpen, setSidebarOpen] = useState(true)

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

      <div className="flex-grow flex relative">
        <main className={`flex-1 p-4 transition-all duration-300 ease-in-out ${!isSidebarOpen ? 'mr-0' : 'mr-96'}`}>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="absolute top-4 right-4 z-10 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
            >
              {isSidebarOpen ? 
                <PanelRightClose className="h-5 w-5" /> : 
                <PanelRightOpen className="h-5 w-5" />
              }
            </Button>
            <div ref={networkRef} className="w-full h-[calc(100vh-8rem)] bg-gray-800 rounded-lg shadow-xl dark:bg-gray-800" />
          </div>
        </main>

        <aside 
          className={`
            w-96 border-l border-gray-700 bg-gray-800 overflow-hidden flex flex-col 
            dark:border-gray-700 dark:bg-gray-800
            transition-transform duration-300 ease-in-out
            fixed right-0 top-[4rem] bottom-0
            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
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