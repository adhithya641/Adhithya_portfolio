/* ============================================================
   PORTFOLIO DATA — Edit this to update any portfolio content
   ============================================================ */
var portfolioData = {

  personal: {
    name: 'ADHITHYA RAVICHANDRAN',
    title: 'ENGINEERING ENTHUSIAST',
  },

  socialLinks: {
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/in/',
    email: 'mailto:adhithya@email.com',
  },

  about: {
    intro: `I am Adhithya Ravichandran — an engineering student with a deep passion for 
    VLSI design, embedded systems, and emerging technologies. I am driven by the challenge 
    of translating complex ideas into elegant, functional solutions that operate at the 
    intersection of hardware and intelligence.`,
    background: `Growing up with a profound curiosity for how electronic systems work at 
    the fundamental level, I pursued engineering to understand and contribute to the 
    technology shaping our world. My academic journey has built strong foundations in 
    digital design, microelectronics, and systems programming — skills I channel into 
    building meaningful projects.`,
    education: [
      {
        degree: 'B.E. — Electronics & Communication Engineering',
        institution: 'Update with your institution name',
        year: '2022 – 2026',
        grade: 'Update with your CGPA / Grade',
      },
      {
        degree: 'Higher Secondary — Science (PCM)',
        institution: 'Update with your school name',
        year: '2020 – 2022',
        grade: 'Update with your grade',
      },
    ],
    interests: [
      'VLSI & Digital Design',
      'Embedded Systems',
      'Signal Processing',
      'Artificial Intelligence',
      'Robotics & Automation',
      'Open-Source Hardware',
    ],
  },

  objective: `To leverage my expertise in VLSI design and embedded systems to develop 
  innovative, high-impact solutions — while continuously evolving as an engineer, 
  contributing to transformative technology, and bridging the gap between theoretical 
  knowledge and real-world engineering challenges.`,

  projects: [
    {
      id: 'stm32-pcb-design',
      title: 'STM32 Custom Microcontroller PCB Design',
      image: null,
      shortDescription: 'Designed a production-ready STM32-based microcontroller board in KiCad featuring 16 GPIO pins, USB Type-C power input, and SWD debug.',
      technologies: ['KiCad', 'STM32', 'PCB Design', 'Hardware Design'],
      overview: `Designed a production-ready STM32-based microcontroller board in KiCad featuring 16 GPIO pins, USB Type-C power input, SWD debug header, and decoupling networks.`,
      problem: `The need for a customized, low-cost microcontroller board for embedded applications with robust power delivery and debugging capabilities.`,
      solution: `Performed schematic capture, component placement, and 2-layer routing following IPC-2221 guidelines to create a reliable and manufacturable PCB.`,
      features: [
        '16 GPIO pins',
        'USB Type-C power input',
        'SWD debug header',
        'Decoupling networks',
        '2-layer routing following IPC-2221 guidelines',
      ],
      contribution: `Independently handled the complete hardware design process from schematic capture to PCB routing and manufacturing file generation.`,
      results: `Exported Gerber files and BOM; validated design rule checks (DRC) with zero critical errors.`,
      futureScope: `Manufacture and assemble the PCB, and develop initial bring-up firmware.`,
      github: 'https://github.com/adhithya641/STM32_Embedded_Controller',
      demo: '',
    },
    {
      id: 'autonomous-pesticide-robot',
      title: 'Autonomous Pesticide Spraying Robot',
      image: null,
      shortDescription: 'Built an autonomous agricultural robot for targeted pesticide application using CV-based weed detection with ESP32-CAM.',
      technologies: ['ESP32-CAM', 'Arduino Uno', 'Computer Vision', 'Bluetooth (HC-05)', 'Robotics', 'C++'],
      overview: `Designed and built an autonomous agricultural robot for targeted pesticide application using computer vision-based weed detection to improve farming efficiency.`,
      problem: `Traditional pesticide application wastes chemicals by spraying entire fields uniformly, leading to environmental harm and increased costs.`,
      solution: `Integrated AI-Thinker ESP32-CAM for real-time image capture and weed classification using edge inference to selectively target weed regions.`,
      features: [
        'Real-time image capture and weed classification',
        'Edge inference on ESP32-CAM',
        'Wireless command interface via HC-05 Bluetooth',
        'Pump actuator control via Arduino Uno GPIO',
      ],
      contribution: `Designed the system architecture, integrated the vision and control subsystems, and programmed the microcontrollers for autonomous operation.`,
      results: `Reduced chemical usage by targeting only detected weed regions, successfully demonstrating precision agriculture concepts.`,
      futureScope: `Implement advanced path planning algorithms and upgrade to a more powerful edge AI processor for complex crop environments.`,
      github: 'https://github.com/adhithya641/YOUR_REPO_LINK', // Update with your GitHub link
      demo: '',
    },
    {
      id: 'automated-attendance-system',
      title: 'Automated Attendance Monitoring System',
      image: null,
      shortDescription: 'Built a vision-based attendance system using Raspberry Pi 4 and OpenCV face recognition to automate roll-call.',
      technologies: ['Raspberry Pi 4', 'OpenCV', 'Python', 'Embedded Linux', 'Computer Vision'],
      overview: `Built a vision-based attendance system using Raspberry Pi 4 and Logitech webcam with OpenCV face recognition to streamline classroom management.`,
      problem: `Manual roll-call is time-consuming, prone to human error, and disrupts the flow of lectures in educational institutions.`,
      solution: `Developed an embedded Linux application on Raspberry Pi that captures and logs student images per period, utilizing facial recognition for identification.`,
      features: [
        'Vision-based face recognition using OpenCV',
        'Automated attendance marking with timestamp-based records',
        'Data logging and storage in CSV format',
        'Integration with Logitech webcam on Raspberry Pi 4',
      ],
      contribution: `Configured the embedded Linux environment, implemented the OpenCV face recognition pipeline, and developed the data logging application.`,
      results: `Eliminated manual roll-call, providing a reliable and automated method for attendance tracking.`,
      futureScope: `Integrate with a cloud database for real-time dashboard viewing and implement anti-spoofing measures for the facial recognition system.`,
      github: 'https://github.com/adhithya641/YOUR_REPO_LINK', // Update with your GitHub link
      demo: '',
    },
  ],

  skills: {
    'Programming': ['C', 'C++', 'Python', 'MATLAB', 'Bash/Shell', 'Assembly (ARM)'],
    'Web Development': ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'REST APIs'],
    'AI / Machine Learning': ['TensorFlow', 'TensorFlow Lite', 'scikit-learn', 'NumPy', 'Pandas', 'OpenCV'],
    'Embedded Systems': ['ESP32', 'Arduino', 'Raspberry Pi', 'STM32', 'RTOS', 'UART/SPI/I2C'],
    'VLSI / Digital Design': ['Verilog', 'SystemVerilog', 'VHDL', 'Cadence Virtuoso', 'Synopsys', 'ModelSim'],
    'Tools & Technologies': ['Git', 'Linux', 'Vivado', 'LTspice', 'MATLAB Simulink', 'Firebase'],
  },

  certifications: [
    {
      id: 'vlsi-fundamentals',
      name: 'VLSI Design Fundamentals',
      organization: 'Coursera / University',
      date: '2024',
      image: null,
      shortDescription: 'Comprehensive course covering CMOS logic design, layout, and verification using industry-standard EDA tools.',
      description: `An in-depth certification covering CMOS technology fundamentals, digital logic design, static timing analysis, physical design, and hands-on experience with Cadence and Synopsys tools.`,
      skillsCovered: ['CMOS Logic Families', 'Static Timing Analysis', 'Physical Design (DRC/LVS)', 'Standard Cell Libraries', 'Synthesis & Optimization'],
      credentialId: 'CERT-VLSI-2024-XXXX',
      credentialLink: '',
    },
    {
      id: 'embedded-systems',
      name: 'Embedded Systems Specialization',
      organization: 'NPTEL / IIT',
      date: '2024',
      image: null,
      shortDescription: 'Eight-week NPTEL certification covering real-time OS, peripheral interfacing, and firmware development.',
      description: `A rigorous eight-week specialization from IIT covering real-time operating systems, bare-metal firmware development, hardware-software interfacing, and communication protocols for resource-constrained microcontrollers.`,
      skillsCovered: ['ARM Cortex-M Architecture', 'FreeRTOS', 'Hardware Abstraction Layers', 'UART, SPI, I2C Protocols', 'Low-Power Design'],
      credentialId: 'NPTEL-ES-2024-XXXX',
      credentialLink: '',
    },
    {
      id: 'machine-learning',
      name: 'Machine Learning',
      organization: 'Coursera / Stanford',
      date: '2023',
      image: null,
      shortDescription: "Andrew Ng's flagship ML certification covering supervised, unsupervised learning, and neural networks.",
      description: `The globally recognized Machine Learning certification by Andrew Ng, covering linear and logistic regression, neural networks, SVMs, clustering, dimensionality reduction, and best practices for ML system design.`,
      skillsCovered: ['Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'Regularization & Optimization', 'ML System Design'],
      credentialId: 'CERT-ML-2023-XXXX',
      credentialLink: '',
    },
  ],

  resume: {
    file: 'assets/resume/Adhithya_R_Resume_VLSI.pdf',
    label: 'Adhithya_Ravichandran_Resume.pdf',
  },
};
