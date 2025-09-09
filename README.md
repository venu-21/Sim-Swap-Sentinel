SIM Swap Sentinel 🛡️
A Proactive Fraud Prevention System for Internet Banking

SIM Swap Sentinel is a full-stack prototype developed by Team HACKEYS for the Hackathon 2025, organized by the Department of Information Technology, Thiagarajar College of Engineering, Madurai, under the IEEE CIS Sponsored Outreach Program. Our project addresses the critical cybersecurity threat of SIM swap fraud under the theme of "Advanced Emitter Location Intelligence."

🚩 The Problem
Traditional One-Time Passwords (OTPs) sent via SMS are a cornerstone of banking security. However, they are critically vulnerable to SIM swap attacks, where a fraudster hijacks a user's phone number. In this scenario, the OTP becomes a weapon, sent directly to the attacker. Our system provides a proactive security layer that detects this fraud before an OTP is even sent.

💡 Our Solution
SIM Swap Sentinel is an intelligent risk-scoring engine that fuses two powerful signals to determine the legitimacy of a login attempt:

SIM Integrity (65% Weight): The system checks the activation date of the user's SIM card. A recently activated SIM is a massive red flag for a potential swap.

Emitter Location Intelligence (35% Weight): The user's smartphone is treated as an emitter. We capture its live GPS location and compare it to the user's known "safe zones." The risk is calculated using:

Haversine Formula: For mathematically accurate distance calculation over the Earth's curve.

Sigmoid Risk Model: An advanced, S-shaped curve that provides a more realistic risk score based on distance, preventing false alarms for nearby locations while aggressively flagging distant ones.

The combined score results in one of three actions: ALLOW, VERIFY with biometrics, or BLOCK the login attempt.

👥 Team HACKEYS
HOHIN J

KABILAN MOHANRAJ

NIVRITI S

VENU CHANDAR VS


🛠️ Technology Stack
Backend: Python, Flask

Frontend: HTML5, CSS3, JavaScript

Core Algorithm: Haversine Formula, Sigmoid Function

APIs: Browser Geolocation API

🙏 Acknowledgments
A huge thank you to the Department of Information Technology, Thiagarajar College of Engineering, Madurai, and the IEEE CIS Outreach Program for organizing this incredible event. We are also immensely grateful for the guidance and support from our mentors, Dr. Sindhu V and Dr. Aravind Vishnu.
