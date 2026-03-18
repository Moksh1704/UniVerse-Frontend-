// ─────────────────────────────────────────────────────────────────────────────
// UniVerse Mock Data
// ─────────────────────────────────────────────────────────────────────────────

// ── Users ─────────────────────────────────────────────────────────────────────

export const MOCK_STUDENT = {
  id: 1,
  name: 'Ravi Kumar',
  email: 'ravi.kumar@andhrauniversity.edu.in',
  role: 'student',
  year: 3,
  section: 'A',
  reg_no: '21CS3A047',
  department: 'Computer Science',
  avatar: null,
  attendance_percentage: 72,
};

export const MOCK_FACULTY = {
  id: 101,
  name: 'Dr. Lakshmi Prasad',
  email: 'lakshmi.prasad@andhrauniversity.edu.in',
  role: 'faculty',
  designation: 'Professor',
  department: 'Computer Science',
  avatar: null,
};

export const MOCK_TOKEN = 'mock_jwt_token_universe_dev_12345';

// ── Announcements ─────────────────────────────────────────────────────────────

export const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'End Semester Examinations Schedule Released',
    body: 'The end semester examination timetable for all UG and PG courses has been officially released. Students are advised to check the university portal for subject-wise dates. Hall tickets will be distributed one week before the exam commencement date. All dues must be cleared before collecting hall tickets.',
    category: 'Exam',
    created_at: '2025-03-10T09:00:00Z',
  },
  {
    id: 2,
    title: 'Mid-Semester Results Published',
    body: 'Mid-semester examination results for all III year B.Tech courses have been published on the student portal. Students with any discrepancies in marks must submit a re-evaluation request to their respective department within 7 days. Results can be viewed using your registration number and date of birth.',
    category: 'Academic',
    created_at: '2025-03-05T11:30:00Z',
  },
  {
    id: 3,
    title: 'Ugadi Holiday – University Closed',
    body: 'The university will remain closed on account of Ugadi festival on 30th March 2025 (Sunday) and 31st March 2025 (Monday). All academic activities, lab sessions, and administrative offices will remain suspended. Classes will resume from 1st April 2025. Wish you all a happy and prosperous Ugadi!',
    category: 'Holiday',
    created_at: '2025-03-01T08:00:00Z',
  },
];

// ── Feed Posts ─────────────────────────────────────────────────────────────────

export const MOCK_FEED_POSTS = [
  {
    id: 1,
    author_id: 2,
    author_name: 'Priya Sharma',
    author_email: 'priya.sharma@andhrauniversity.edu.in',
    content: 'Just submitted my final year project proposal on "Real-time Face Recognition using YOLOv8". Fingers crossed for approval! Has anyone else worked with OpenCV + FastAPI for their projects?',
    likes_count: 14,
    liked: false,
    created_at: '2025-03-15T10:45:00Z',
    comments: [
      {
        id: 1,
        author_name: 'Arjun Reddy',
        content: 'That sounds amazing! I used OpenCV last semester for my mini project. DM me if you need help with the integration.',
        created_at: '2025-03-15T11:00:00Z',
      },
      {
        id: 2,
        author_name: 'Sai Teja',
        content: 'YOLOv8 is impressive. Good luck with the proposal!',
        created_at: '2025-03-15T11:20:00Z',
      },
    ],
  },
  {
    id: 2,
    author_id: 1,
    author_name: 'Ravi Kumar',
    author_email: 'ravi.kumar@andhrauniversity.edu.in',
    content: 'Attended the AWS Cloud Practitioner workshop today in the Seminar Hall. Really eye-opening session on cloud architecture and serverless deployments. Highly recommend everyone to look into AWS free tier for hands-on practice!',
    likes_count: 22,
    liked: true,
    created_at: '2025-03-14T15:30:00Z',
    comments: [
      {
        id: 3,
        author_name: 'Meena Kumari',
        content: 'Was looking for this! Is there a recording available?',
        created_at: '2025-03-14T16:00:00Z',
      },
    ],
  },
  {
    id: 3,
    author_id: 3,
    author_name: 'Karthik Varma',
    author_email: 'karthik.varma@andhrauniversity.edu.in',
    content: 'Anyone else struggling with the DBMS assignment on Normalization? The 3NF and BCNF questions are surprisingly tricky. Forming a study group in the library — Room 204, tomorrow 4 PM. Drop a comment if you\'re joining!',
    likes_count: 31,
    liked: false,
    created_at: '2025-03-13T18:10:00Z',
    comments: [
      {
        id: 4,
        author_name: 'Divya Nair',
        content: 'Joining! BCNF is killing me',
        created_at: '2025-03-13T18:45:00Z',
      },
      {
        id: 5,
        author_name: 'Ravi Kumar',
        content: 'Count me in. See you at 4!',
        created_at: '2025-03-13T19:00:00Z',
      },
      {
        id: 6,
        author_name: 'Santhosh G',
        content: 'Library Room 204 — noted. Thanks for organising this',
        created_at: '2025-03-13T19:30:00Z',
      },
    ],
  },
  {
    id: 4,
    author_id: 4,
    author_name: 'Dr. Lakshmi Prasad',
    author_email: 'lakshmi.prasad@andhrauniversity.edu.in',
    content: 'Important: The Operating Systems lab viva for CSE-3A and CSE-3B is rescheduled to 18th March 2025 (Tuesday), 2:00 PM – 5:00 PM in Lab 3, Ground Floor. Kindly prepare all experiments from the lab record. Attendance is mandatory.',
    likes_count: 47,
    liked: true,
    created_at: '2025-03-12T09:00:00Z',
    comments: [
      {
        id: 7,
        author_name: 'Ravi Kumar',
        content: 'Thank you for the update Ma\'am',
        created_at: '2025-03-12T09:15:00Z',
      },
      {
        id: 8,
        author_name: 'Anjali Singh',
        content: 'Will all 14 experiments be covered in the viva?',
        created_at: '2025-03-12T09:30:00Z',
      },
    ],
  },
  {
    id: 5,
    author_id: 5,
    author_name: 'Rohit Babu',
    author_email: 'rohit.babu@andhrauniversity.edu.in',
    content: 'The canteen has finally added Masala Dosa and Filter Coffee to the menu! Also, the seating area behind Block C has been renovated — worth checking out during break. Small wins, but they make campus life better',
    likes_count: 88,
    liked: false,
    created_at: '2025-03-11T12:05:00Z',
    comments: [
      {
        id: 9,
        author_name: 'Priya Sharma',
        content: 'FINALLY! The filter coffee was overdue',
        created_at: '2025-03-11T12:20:00Z',
      },
      {
        id: 10,
        author_name: 'Karthik Varma',
        content: 'Block C seating is so much better now. Good place to study too.',
        created_at: '2025-03-11T12:45:00Z',
      },
    ],
  },
];

// ── Events ────────────────────────────────────────────────────────────────────

export const MOCK_EVENTS = [
  {
    id: 1,
    name: 'TechSurge 2025 — National Level Hackathon',
    category: 'Technical',
    date: '2025-03-28T09:00:00Z',
    venue: 'CS Department Seminar Hall, Block A',
    description: 'A 24-hour national-level hackathon open to all UG and PG students. Build innovative solutions around the themes of HealthTech, EdTech, and Smart Cities. Prizes worth ₹1.5 Lakhs! Teams of 2–4 members.',
    needs_registration: true,
    registration_url: 'https://techsurge2025.andhrauniversity.edu.in/register',
  },
  {
    id: 2,
    name: 'Paper Presentation & Poster Exhibition',
    category: 'Technical',
    date: '2025-04-05T10:00:00Z',
    venue: 'Conference Hall, Administrative Block',
    description: 'Annual paper presentation and poster exhibition event for all departments. Submit your research paper or poster on topics related to your domain. Best papers will be recommended for publication in the AU Journal of Technology.',
    needs_registration: true,
    registration_url: 'https://forms.andhrauniversity.edu.in/paperpresentation2025',
  },
  {
    id: 3,
    name: 'Kalakaar — Annual Cultural Fest',
    category: 'Cultural',
    date: '2025-04-12T05:00:00Z',
    venue: 'University Open Air Theatre',
    description: 'The most awaited cultural extravaganza of the year! Events include classical dance, folk dance, street play (nukkad natak), solo singing, group music, standup comedy, and fashion show. Open to all university students.',
    needs_registration: true,
    registration_url: 'https://kalakaar2025.andhrauniversity.edu.in',
  },
  {
    id: 4,
    name: 'Inter-Department Cricket Tournament',
    category: 'Sports',
    date: '2025-03-22T07:00:00Z',
    venue: 'University Cricket Ground, Sports Complex',
    description: 'Annual inter-department cricket tournament. All department teams must register by 18th March. Matches will be played in T20 format. Players must carry their ID cards. Refreshments will be provided for all participants.',
    needs_registration: true,
    registration_url: 'https://sports.andhrauniversity.edu.in/cricket2025',
  },
];

// ── Navigation Spots ──────────────────────────────────────────────────────────

export const MOCK_NAV_SPOTS = [
  {
    id: 1,
    location_name: 'Computer Science Lab 1 (CSL-1)',
    building: 'Block A',
    floor: 'Ground Floor',
    room_number: 'A-101',
    category: 'Lab',
    latitude: 17.7231,
    longitude: 83.3012,
    indoor_steps: [
      'Enter Block A from the main entrance on the east side.',
      'Walk straight past the reception desk.',
      'CSL-1 is the first room on your left — look for the "Lab 1" signboard.',
    ],
    entrance_instruction: 'Main east gate of Block A, near the bicycle stand.',
  },
  {
    id: 2,
    location_name: 'Computer Science Lab 3 — OS & Networking',
    building: 'Block A',
    floor: 'Ground Floor',
    room_number: 'A-103',
    category: 'Lab',
    latitude: 17.7233,
    longitude: 83.3014,
    indoor_steps: [
      'Enter Block A from the main entrance.',
      'Walk straight along the corridor.',
      'CSL-3 is the third room on the left, past CSL-1 and CSL-2.',
      'Look for the "OS Lab" sign on the door.',
    ],
    entrance_instruction: 'Main east gate of Block A, ground floor corridor.',
  },
  {
    id: 3,
    location_name: 'Department of Computer Science — HOD Cabin',
    building: 'Block A',
    floor: '2nd Floor',
    room_number: 'A-201',
    category: 'Admin',
    latitude: 17.7235,
    longitude: 83.3016,
    indoor_steps: [
      'Enter Block A from the main entrance.',
      'Take the staircase on the right side of the corridor to reach the 2nd floor.',
      'Turn left at the top of the stairs.',
      'Room A-201 is the first cabin on your right — "Head of Department" nameplate on door.',
    ],
    entrance_instruction: 'Block A main gate. Use the right staircase to reach 2nd floor.',
  },
  {
    id: 4,
    location_name: 'Dr. K. Venkataraman Lecture Hall',
    building: 'Block B',
    floor: '1st Floor',
    room_number: 'B-105',
    category: 'Academic',
    latitude: 17.7228,
    longitude: 83.3020,
    indoor_steps: [
      'Enter Block B from the western entrance near the parking area.',
      'Take the staircase on your left to the 1st floor.',
      'Walk along the corridor — Room B-105 is on the right side, third door.',
      'The room has a capacity of 120 and is labelled "Seminar Hall / Lecture Hall".',
    ],
    entrance_instruction: 'Block B west entrance, opposite the faculty parking area.',
  },
  {
    id: 5,
    location_name: 'University Central Library',
    building: 'Library Block',
    floor: 'Ground Floor & 1st Floor',
    room_number: null,
    category: 'Library',
    latitude: 17.7240,
    longitude: 83.3008,
    indoor_steps: [
      'The library is a standalone building near the university main gate.',
      'Enter through the glass doors — deposit bags at the bag counter.',
      'Ground floor has periodicals and newspapers.',
      '1st floor has textbooks, reference books, and digital catalogue terminals.',
      'Reading rooms are on the 1st floor, accessible via the central staircase.',
    ],
    entrance_instruction: 'Standalone building, 50 metres north of the main gate. Look for the "Library" signboard.',
  },
  {
    id: 6,
    location_name: 'Main Canteen & Food Court',
    building: 'Canteen Block',
    floor: 'Ground Floor',
    room_number: null,
    category: 'Canteen',
    latitude: 17.7225,
    longitude: 83.3025,
    indoor_steps: [
      'The canteen is located between Block B and the Sports Complex.',
      'Walk south from Block B — you will see the open-air seating area.',
      'The main serving counter is on the left; South Indian items on the right counter.',
      'Beverages and snacks are available at the small kiosk near the exit.',
    ],
    entrance_instruction: 'Between Block B and Sports Complex. Open 8 AM – 8 PM on working days.',
  },
  {
    id: 7,
    location_name: 'Examination Control Office',
    building: 'Administrative Block',
    floor: 'Ground Floor',
    room_number: 'ADM-04',
    category: 'Admin',
    latitude: 17.7242,
    longitude: 83.3005,
    indoor_steps: [
      'Enter the Administrative Block from the main entrance — tall building opposite the main gate.',
      'Walk straight through the lobby.',
      'Room ADM-04 is on the right side — "Examination Section" board is on the door.',
    ],
    entrance_instruction: 'Administrative Block, directly opposite the university main gate.',
  },
  {
    id: 8,
    location_name: 'Boys Hostel Block 2 (Swami Vivekananda Bhavan)',
    building: 'Hostel Zone – East',
    floor: 'Ground Floor to 4th Floor',
    room_number: null,
    category: 'Hostel',
    latitude: 17.7218,
    longitude: 83.3035,
    indoor_steps: [
      'Exit Block A and walk south-east towards the hostel zone.',
      'Cross the internal road — Hostel Block 2 is the second building on your right.',
      'The warden\'s office is on the ground floor, Room H2-001.',
      'Floors 1–4 are student rooms; staircase access only (no lift).',
    ],
    entrance_instruction: 'Hostel zone east gate. Show ID to the security guard at entry.',
  },
  {
    id: 9,
    location_name: 'Mini Auditorium — Seminar Hall',
    building: 'Block C',
    floor: '1st Floor',
    room_number: 'C-110',
    category: 'Academic',
    latitude: 17.7236,
    longitude: 83.3018,
    indoor_steps: [
      'Enter Block C from the main entrance on the south side.',
      'Take the left staircase up to the 1st floor.',
      'The Mini Auditorium (C-110) is the large hall at the end of the corridor — capacity 300.',
      'Check the notice board near the entrance for event schedules.',
    ],
    entrance_instruction: 'Block C south entrance, near the garden seating area.',
  },
  {
    id: 10,
    location_name: 'Department of Electronics — Smart Classroom',
    building: 'Block D',
    floor: '2nd Floor',
    room_number: 'D-202',
    category: 'Academic',
    latitude: 17.7230,
    longitude: 83.3030,
    indoor_steps: [
      'Enter Block D from the northern entrance.',
      'Take the main staircase to the 2nd floor.',
      'Room D-202 is on your left — it has a "Smart Classroom" sign and large display screens visible through the glass door.',
    ],
    entrance_instruction: 'Block D north gate, near the Electronics department signboard.',
  },
];

export const MOCK_NAV_POPULAR = MOCK_NAV_SPOTS.slice(0, 6);

// ── Career Roles ──────────────────────────────────────────────────────────────

export const MOCK_CAREERS = [
  {
    id: 1,
    title: 'Full Stack Developer',
    domain: 'Tech',
    description:
      'Full stack developers design and build both the front-end and back-end of web applications. They work across the entire technology stack — from databases and server-side logic to UI design and client-side interactivity. In-demand at startups, product companies, and large enterprises.',
    requirements:
      'B.Tech/MCA in Computer Science or related field. Strong understanding of data structures and algorithms. Proficiency in at least one front-end framework and one back-end framework.',
    tech_stack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Docker', 'Git', 'REST APIs'],
    salary_min: 600000,
    salary_max: 2000000,
    market_demand: 'high',
    future_scope:
      'Full stack roles are evolving to include cloud-native development, micro-frontends, and serverless architectures. Senior developers move into Tech Lead, Solution Architect, or CTO roles.',
    benefits:
      'Remote-friendly, flexible hours, equity in startups, fast career growth, access to cutting-edge technology stack.',
  },
  {
    id: 2,
    title: 'Data Analyst',
    domain: 'Data',
    description:
      'Data analysts collect, clean, and interpret large datasets to help organisations make evidence-based decisions. They build dashboards, generate reports, and identify trends using statistical tools and visualisation platforms. Essential in every industry — from finance to healthcare.',
    requirements:
      'Degree in Computer Science, Statistics, or Mathematics. Strong analytical and problem-solving skills. Familiarity with SQL and at least one BI tool. Good communication skills for presenting insights.',
    tech_stack: ['Python', 'SQL', 'Pandas', 'Power BI', 'Tableau', 'Excel', 'Google Sheets', 'Matplotlib'],
    salary_min: 450000,
    salary_max: 1400000,
    market_demand: 'high',
    future_scope:
      'Data Analysts can grow into Senior Analyst, Data Scientist, or Business Intelligence Lead roles. Specialisation in domains like fintech or healthcare analytics commands premium salaries.',
    benefits:
      'Cross-industry demand, structured career path, relatively lower barrier to entry, strong job security in data-heavy sectors.',
  },
  {
    id: 3,
    title: 'DevOps Engineer',
    domain: 'Cloud',
    description:
      'DevOps Engineers bridge the gap between software development and IT operations. They automate CI/CD pipelines, manage cloud infrastructure, implement monitoring systems, and ensure applications are reliably deployed at scale. Critical in modern software delivery teams.',
    requirements:
      'B.Tech in CS/IT or equivalent. Understanding of Linux systems and networking. Experience with at least one cloud platform (AWS/Azure/GCP). Knowledge of scripting languages like Bash or Python.',
    tech_stack: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins', 'GitHub Actions', 'Linux', 'Ansible', 'Prometheus'],
    salary_min: 700000,
    salary_max: 2500000,
    market_demand: 'high',
    future_scope:
      'Senior DevOps roles evolve into Site Reliability Engineer (SRE), Platform Engineer, or Cloud Architect positions. Cloud certifications (AWS SAA, CKA) significantly boost earning potential.',
    benefits:
      'High compensation, remote-first roles at most companies, constant learning with new cloud services, strong global demand.',
  },
  {
    id: 4,
    title: 'Machine Learning Engineer',
    domain: 'AI',
    description:
      'ML Engineers design, build, and deploy machine learning models at production scale. Unlike data scientists who focus on experimentation, ML engineers focus on the engineering and infrastructure required to run models reliably in real-world products.',
    requirements:
      'Strong background in mathematics (linear algebra, calculus, probability). Proficiency in Python and ML frameworks. Experience with model training, evaluation, and deployment pipelines. Knowledge of cloud ML services is a plus.',
    tech_stack: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'MLflow', 'AWS SageMaker', 'FastAPI', 'NumPy', 'CUDA'],
    salary_min: 900000,
    salary_max: 3500000,
    market_demand: 'high',
    future_scope:
      'The AI/ML field is growing exponentially with GenAI, LLMs, and multimodal models. Specialisations in NLP, Computer Vision, or Reinforcement Learning open opportunities at top AI labs.',
    benefits:
      'Among the highest-paying engineering roles globally, work on cutting-edge research, opportunities at FAANG, AI labs, and well-funded startups.',
  },
  {
    id: 5,
    title: 'QA / Automation Test Engineer',
    domain: 'Tech',
    description:
      'QA Engineers ensure software quality by designing test plans, writing automated test scripts, and executing both manual and automated tests across web, mobile, and API layers. They work closely with development teams to catch bugs early in the SDLC.',
    requirements:
      'Degree in CS or IT. Understanding of SDLC and software testing methodologies. Familiarity with automation frameworks. Basic programming knowledge in Java or Python.',
    tech_stack: ['Selenium', 'Playwright', 'Cypress', 'Postman', 'Java', 'TestNG', 'JIRA', 'Git', 'REST Assured'],
    salary_min: 400000,
    salary_max: 1600000,
    market_demand: 'medium',
    future_scope:
      'Automation-first QA is replacing manual testing. Senior QA engineers move into SDET (Software Development Engineer in Test), QA Lead, or Test Architect roles.',
    benefits:
      'Lower competition compared to development roles, clear learning roadmap, opportunities at product companies and service firms alike, growing demand for automation expertise.',
  },
  {
    id: 6,
    title: 'Cybersecurity Analyst',
    domain: 'Cybersecurity',
    description:
      'Cybersecurity Analysts protect organisations from cyber threats by monitoring networks, analysing vulnerabilities, and responding to security incidents. They implement security policies, conduct penetration testing, and ensure compliance with data protection regulations.',
    requirements:
      'Degree in CS, IT, or Information Security. Knowledge of networking fundamentals (TCP/IP, DNS, firewalls). Familiarity with SIEM tools and ethical hacking concepts. Certifications like CEH or CompTIA Security+ are a plus.',
    tech_stack: ['Kali Linux', 'Wireshark', 'Metasploit', 'Nmap', 'Splunk', 'Burp Suite', 'Python', 'Snort', 'Nessus'],
    salary_min: 500000,
    salary_max: 2200000,
    market_demand: 'high',
    future_scope:
      'With rising cybercrime, demand for security professionals is outpacing supply globally. Career paths include Penetration Tester, Security Architect, CISO, or independent consultant.',
    benefits:
      'One of the most crisis-proof careers, government and defence opportunities, remote work options, high bonuses for certified experts.',
  },
  {
    id: 7,
    title: 'Product Manager',
    domain: 'Non-Tech',
    description:
      'Product Managers define the vision, strategy, and roadmap for digital products. They act as the bridge between engineering, design, and business teams — gathering user requirements, prioritising features, and ensuring products ship on time and meet customer needs.',
    requirements:
      'Degree in any field (MBA preferred for senior roles). Strong analytical and communication skills. Understanding of product lifecycle and agile methodologies. No deep coding required, but technical fluency is valued.',
    tech_stack: ['Jira', 'Confluence', 'Figma', 'Mixpanel', 'Google Analytics', 'Notion', 'Miro', 'Excel', 'SQL (basic)'],
    salary_min: 800000,
    salary_max: 3000000,
    market_demand: 'high',
    future_scope:
      'PM roles scale from Associate PM to Senior PM, Group PM, and ultimately VP of Product or CPO. Strong PMs at top companies command top-tier compensation and equity.',
    benefits:
      'High impact on product direction, cross-functional exposure, path to leadership, great compensation at product-led companies.',
  },
  {
    id: 8,
    title: 'UI/UX Designer',
    domain: 'Non-Tech',
    description:
      'UI/UX Designers create intuitive, accessible, and visually appealing digital experiences. They conduct user research, build wireframes and prototypes, and collaborate closely with product and engineering teams to bring designs to life across web and mobile platforms.',
    requirements:
      'Degree in Design, HCI, or CS. Proficiency in design tools like Figma or Adobe XD. Portfolio demonstrating real-world projects. Understanding of user-centred design principles and accessibility standards.',
    tech_stack: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Zeplin', 'Principle', 'Maze', 'Hotjar', 'Framer'],
    salary_min: 400000,
    salary_max: 1800000,
    market_demand: 'medium',
    future_scope:
      'Senior designers move into Design Lead, Head of Design, or Chief Design Officer roles. Specialisation in motion design, 3D/AR/VR design, or design systems is increasingly valued.',
    benefits:
      'Creative and technical blend, portfolio-driven hiring, remote-friendly, rapidly growing demand in product companies and agencies.',
  },
];

// ── Student Attendance ────────────────────────────────────────────────────────

export const MOCK_ATTENDANCE_OVERVIEW = {
  overall_percentage: 72.4,
  total_present: 124,
  total_absent: 47,
  total_classes: 171,
  subjects: [
    {
      subject_name: 'Operating Systems',
      subject_code: 'CS301',
      attended: 34,
      total: 42,
      percentage: 80.9,
    },
    {
      subject_name: 'Database Management Systems',
      subject_code: 'CS302',
      attended: 28,
      total: 40,
      percentage: 70.0,
    },
    {
      subject_name: 'Computer Networks',
      subject_code: 'CS303',
      attended: 31,
      total: 45,
      percentage: 68.9,
    },
    {
      subject_name: 'Software Engineering',
      subject_code: 'CS304',
      attended: 31,
      total: 44,
      percentage: 70.5,
    },
  ],
};

export const MOCK_ATTENDANCE_DAYWISE = [
  {
    date: '2025-03-15',
    present: 3,
    absent: 1,
    records: [
      { subject_name: 'Operating Systems', subject_code: 'CS301', status: 'present' },
      { subject_name: 'Database Management Systems', subject_code: 'CS302', status: 'present' },
      { subject_name: 'Computer Networks', subject_code: 'CS303', status: 'absent' },
      { subject_name: 'Software Engineering', subject_code: 'CS304', status: 'present' },
    ],
  },
  {
    date: '2025-03-14',
    present: 4,
    absent: 0,
    records: [
      { subject_name: 'Operating Systems', subject_code: 'CS301', status: 'present' },
      { subject_name: 'Database Management Systems', subject_code: 'CS302', status: 'present' },
      { subject_name: 'Computer Networks', subject_code: 'CS303', status: 'present' },
      { subject_name: 'Software Engineering', subject_code: 'CS304', status: 'present' },
    ],
  },
  {
    date: '2025-03-13',
    present: 2,
    absent: 2,
    records: [
      { subject_name: 'Operating Systems', subject_code: 'CS301', status: 'absent' },
      { subject_name: 'Database Management Systems', subject_code: 'CS302', status: 'present' },
      { subject_name: 'Computer Networks', subject_code: 'CS303', status: 'absent' },
      { subject_name: 'Software Engineering', subject_code: 'CS304', status: 'present' },
    ],
  },
  {
    date: '2025-03-12',
    present: 3,
    absent: 1,
    records: [
      { subject_name: 'Operating Systems', subject_code: 'CS301', status: 'present' },
      { subject_name: 'Database Management Systems', subject_code: 'CS302', status: 'absent' },
      { subject_name: 'Computer Networks', subject_code: 'CS303', status: 'present' },
      { subject_name: 'Software Engineering', subject_code: 'CS304', status: 'present' },
    ],
  },
  {
    date: '2025-03-11',
    present: 4,
    absent: 0,
    records: [
      { subject_name: 'Operating Systems', subject_code: 'CS301', status: 'present' },
      { subject_name: 'Database Management Systems', subject_code: 'CS302', status: 'present' },
      { subject_name: 'Computer Networks', subject_code: 'CS303', status: 'present' },
      { subject_name: 'Software Engineering', subject_code: 'CS304', status: 'present' },
    ],
  },
];

// ── Faculty Timetable ─────────────────────────────────────────────────────────

const TODAY_DAY = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
// For demo purposes on weekends, fall back to Monday's schedule
const DEMO_DAY = (TODAY_DAY === 'Sunday' || TODAY_DAY === 'Saturday') ? 'Monday' : TODAY_DAY;

const ALL_TIMETABLE = [
  // Monday
  { day: 'Monday', subject: 'Operating Systems', subject_code: 'CS301', class: 'CSE-3A', section: 'CSE-3A', time: '09:00 - 10:00' },
  { day: 'Monday', subject: 'Computer Networks', subject_code: 'CS303', class: 'CSE-3B', section: 'CSE-3B', time: '10:00 - 11:00' },
  { day: 'Monday', subject: 'Software Engineering', subject_code: 'CS304', class: 'CSE-3A', section: 'CSE-3A', time: '11:15 - 12:15' },
  { day: 'Monday', subject: 'Database Management Systems', subject_code: 'CS302', class: 'CSE-2A', section: 'CSE-2A', time: '14:00 - 15:00' },
  // Tuesday
  { day: 'Tuesday', subject: 'Operating Systems', subject_code: 'CS301', class: 'CSE-3B', section: 'CSE-3B', time: '09:00 - 10:00' },
  { day: 'Tuesday', subject: 'Database Management Systems', subject_code: 'CS302', class: 'CSE-3A', section: 'CSE-3A', time: '10:00 - 11:00' },
  { day: 'Tuesday', subject: 'Computer Networks', subject_code: 'CS303', class: 'CSE-2B', section: 'CSE-2B', time: '11:15 - 12:15' },
  // Wednesday
  { day: 'Wednesday', subject: 'Software Engineering', subject_code: 'CS304', class: 'CSE-3B', section: 'CSE-3B', time: '09:00 - 10:00' },
  { day: 'Wednesday', subject: 'Operating Systems', subject_code: 'CS301', class: 'CSE-3A', section: 'CSE-3A', time: '10:00 - 11:00' },
  { day: 'Wednesday', subject: 'Database Management Systems', subject_code: 'CS302', class: 'CSE-2B', section: 'CSE-2B', time: '14:00 - 15:00' },
  { day: 'Wednesday', subject: 'Computer Networks', subject_code: 'CS303', class: 'CSE-3A', section: 'CSE-3A', time: '15:00 - 16:00' },
  // Thursday
  { day: 'Thursday', subject: 'Operating Systems', subject_code: 'CS301', class: 'CSE-2A', section: 'CSE-2A', time: '09:00 - 10:00' },
  { day: 'Thursday', subject: 'Software Engineering', subject_code: 'CS304', class: 'CSE-3A', section: 'CSE-3A', time: '11:15 - 12:15' },
  { day: 'Thursday', subject: 'Database Management Systems', subject_code: 'CS302', class: 'CSE-3B', section: 'CSE-3B', time: '14:00 - 15:00' },
  // Friday
  { day: 'Friday', subject: 'Computer Networks', subject_code: 'CS303', class: 'CSE-3A', section: 'CSE-3A', time: '09:00 - 10:00' },
  { day: 'Friday', subject: 'Operating Systems', subject_code: 'CS301', class: 'CSE-3B', section: 'CSE-3B', time: '10:00 - 11:00' },
  { day: 'Friday', subject: 'Software Engineering', subject_code: 'CS304', class: 'CSE-2A', section: 'CSE-2A', time: '11:15 - 12:15' },
  { day: 'Friday', subject: 'Database Management Systems', subject_code: 'CS302', class: 'CSE-3A', section: 'CSE-3A', time: '14:00 - 15:00' },
];

export const MOCK_TIMETABLE_ALL = ALL_TIMETABLE;

export const MOCK_TIMETABLE_TODAY = ALL_TIMETABLE.filter(
  e => e.day === DEMO_DAY
);

// ── Students in a class (for faculty attendance marking) ─────────────────────

export const MOCK_STUDENTS_IN_CLASS = [
  { name: 'Aakash Reddy',    email: 'aakash.reddy@andhrauniversity.edu.in',    reg_no: '21CS3A001' },
  { name: 'Bhavana Sinha',   email: 'bhavana.sinha@andhrauniversity.edu.in',   reg_no: '21CS3A002' },
  { name: 'Charan Teja',     email: 'charan.teja@andhrauniversity.edu.in',     reg_no: '21CS3A003' },
  { name: 'Divya Krishnan',  email: 'divya.krishnan@andhrauniversity.edu.in',  reg_no: '21CS3A004' },
  { name: 'Eswar Rao',       email: 'eswar.rao@andhrauniversity.edu.in',       reg_no: '21CS3A005' },
  { name: 'Farida Begum',    email: 'farida.begum@andhrauniversity.edu.in',    reg_no: '21CS3A006' },
  { name: 'Ganesh Patil',    email: 'ganesh.patil@andhrauniversity.edu.in',    reg_no: '21CS3A007' },
  { name: 'Haritha Varma',   email: 'haritha.varma@andhrauniversity.edu.in',   reg_no: '21CS3A008' },
  { name: 'Irfan Sheikh',    email: 'irfan.sheikh@andhrauniversity.edu.in',    reg_no: '21CS3A009' },
  { name: 'Jyothi Lakshmi',  email: 'jyothi.lakshmi@andhrauniversity.edu.in', reg_no: '21CS3A010' },
  { name: 'Kiran Babu',      email: 'kiran.babu@andhrauniversity.edu.in',      reg_no: '21CS3A011' },
  { name: 'Lavanya Devi',    email: 'lavanya.devi@andhrauniversity.edu.in',    reg_no: '21CS3A012' },
  { name: 'Mohan Das',       email: 'mohan.das@andhrauniversity.edu.in',       reg_no: '21CS3A013' },
  { name: 'Naveen Kumar',    email: 'naveen.kumar@andhrauniversity.edu.in',    reg_no: '21CS3A014' },
  { name: 'Ojaswini Patel',  email: 'ojaswini.patel@andhrauniversity.edu.in', reg_no: '21CS3A015' },
  { name: 'Pradeep Nair',    email: 'pradeep.nair@andhrauniversity.edu.in',    reg_no: '21CS3A016' },
  { name: 'Ravi Kumar',      email: 'ravi.kumar@andhrauniversity.edu.in',      reg_no: '21CS3A047' },
  { name: 'Sneha Chowdary',  email: 'sneha.chowdary@andhrauniversity.edu.in', reg_no: '21CS3A018' },
  { name: 'Tarun Yadav',     email: 'tarun.yadav@andhrauniversity.edu.in',    reg_no: '21CS3A019' },
  { name: 'Uma Shankar',     email: 'uma.shankar@andhrauniversity.edu.in',     reg_no: '21CS3A020' },
];

// ── Attendance submit response (mock) ─────────────────────────────────────────

export const MOCK_ATTENDANCE_SUBMIT_RESPONSE = {
  success: true,
  total_present: 17,
  total_absent: 3,
  percentage: 85.0,
  chronic_absentees: [
    { name: 'Eswar Rao',      attendance_percentage: 58.3 },
    { name: 'Irfan Sheikh',   attendance_percentage: 61.1 },
    { name: 'Mohan Das',      attendance_percentage: 63.9 },
  ],
};

// ── Mock API helper ───────────────────────────────────────────────────────────
// A consistent wrapper that mimics axios response shape after a 1s delay.

export const mockFetch = (data, delay = 1000) =>
  new Promise(resolve => setTimeout(() => resolve({ data }), delay));

export const mockPost = (responseData, delay = 1000) =>
  new Promise(resolve => setTimeout(() => resolve({ data: responseData }), delay));
