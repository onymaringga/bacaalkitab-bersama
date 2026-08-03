# PRODUCT CONTEXT — Bible Reading Together App

## 1. Product Overview

Aplikasi ini adalah platform untuk membantu komunitas menjalankan program membaca Alkitab bersama secara lebih konsisten, engaging, dan mudah dikelola.

Produk tidak hanya berfungsi sebagai Bible reader atau personal reading tracker.

Core experience-nya adalah:

**Read → Reflect → Share → Grow Together**

Produk harus memberikan pengalaman berbeda untuk tiga role:

**Admin → Leader → Member**

---

## 2. Product Vision

Membantu orang membangun kebiasaan membaca dan memahami Alkitab secara konsisten melalui perjalanan iman bersama komunitas.

---

## 3. Problem

Program membaca Alkitab bersama saat ini sering menghadapi beberapa masalah:

* Progress peserta sulit dipantau, terutama jika jumlah peserta dan kelompok banyak.
* Tracking masih dilakukan secara manual.
* Peserta sering kehilangan konsistensi membaca.
* Anggota kelompok belum tentu saling dekat sehingga pengalaman "baca bersama" kurang terasa.
* Leader kesulitan mengetahui kondisi dan engagement kelompok secara cepat.
* Program dapat terasa seperti kewajiban atau absensi jika tracking terlalu dominan.

Produk harus menyelesaikan masalah tersebut tanpa menciptakan kesan bahwa aktivitas spiritual peserta sedang diawasi.

---

## 4. Target Users

Produk dapat digunakan oleh berbagai komunitas Kristen, seperti:

* Komunitas Kristen di perusahaan/kantor
* Gereja
* Youth community
* Kelompok PA / Bible Study
* Ministry
* Small group
* Keluarga
* Kelompok pertemanan

Produk tidak terikat pada satu gereja atau organisasi tertentu.

---

# 5. Product Structure

Gunakan hierarchy:

**Organization**
↓
**Program**
↓
**Groups**
↓
**Leader**
↓
**Members**

Contoh:

Organization: Christian Community A

Program:
Bible Reading Journey 2027

Groups:

* Group 01
* Group 02
* Group 03

Setiap group memiliki satu atau beberapa Leader dan sejumlah Member.

Satu Organization dapat memiliki beberapa Program.

---

# 6. User Roles

## ADMIN

Platform utama: **Web Dashboard**

Admin bertanggung jawab terhadap keseluruhan program.

Main capabilities:

* Create & manage organization
* Create reading program
* Select/create reading plan
* Set program duration
* Create groups
* Assign group leaders
* Manage participants
* Assign participants to groups
* Monitor overall program progress
* Monitor group-level engagement
* Compare progress antar-group
* View participation analytics
* Manage announcements
* Manage program settings

Dashboard Admin harus berorientasi pada **program health**, bukan mengawasi spiritualitas individu.

Contoh metrics:

* Total Participants
* Active Readers
* Reading Completion Rate
* Weekly Active Readers
* Reflection Participation
* Overall Program Progress
* Group Engagement

---

## LEADER

Platform:

**Mobile App + Web Dashboard**

Leader bertanggung jawab mendampingi kelompok.

Main capabilities:

* View today's group progress
* View member reading progress
* View group reflections
* Give encouragement
* Send group reminders
* Post group announcements
* Monitor group engagement
* View members who may need encouragement
* Participate in reading and reflection like regular members

Leader mobile dashboard harus memberikan quick overview.

Contoh:

**Today's Group**

8 / 10 members completed today's reading

6 reflections shared

80% group participation

Leader tidak perlu membuka web hanya untuk mengetahui kondisi kelompok hari itu.

---

## MEMBER

Platform utama:

**Mobile App**

Main capabilities:

* Join organization/program
* Join assigned group
* View today's reading
* Read Bible passage
* Mark reading as completed
* Write reflection
* Choose reflection visibility
* View personal progress
* View group journey/progress
* Read reflections from group members
* React/respond to reflections
* Receive encouragement/reminders
* View reading history

---

# 7. Mobile Information Architecture

Main navigation:

**Home**
**Read**
**Group**
**Notifications**
**Profile**

### HOME

Show:

* Greeting
* Today's reading
* Continue Reading CTA
* Personal program progress
* Today's group progress
* Recent group activity
* Short encouragement

Primary CTA:

**Continue Reading**

---

### READ

Show:

* Today's passage
* Bible reader
* Reading plan information
* Day / progress indicator
* Bible version selector

After completing reading:

CTA:

**Complete Reading**

Then direct user to:

**Reflection**

---

### REFLECTION

Reflection should be simple and meaningful.

Example prompts:

**Apa yang paling berbicara kepadamu dari bacaan hari ini?**

Optional:

**Bagaimana kamu ingin menerapkannya dalam kehidupanmu?**

Reflection visibility:

* Private
* Leader Only
* Group

Avoid forcing users to share reflections publicly.

---

### GROUP

Show:

* Group name
* Group members
* Group journey/progress
* Today's participation
* Recent reflections
* Group activities
* Leader messages
* Encouragement

The experience should feel like:

**"We're going through this journey together."**

Not:

**"Who hasn't completed their Bible reading?"**

---

# 8. Progress Philosophy

Avoid creating an "attendance system for spirituality."

Do NOT overly emphasize:

* Red warning for people who haven't read
* Ranking people based on Bible reading
* Publicly shaming inactive members
* Aggressive streak mechanics

Prefer:

* Collective progress
* Journey completion
* Encouragement
* Gentle reminders
* Community milestones

Example:

**"Kelompokmu telah menyelesaikan 72% perjalanan minggu ini."**

Instead of:

**"3 orang belum membaca Alkitab."**

Individual details can still be available to Leader when necessary, but should be presented neutrally.

---

# 9. Core Product Experience

The core loop should be:

**Today's Reading**
↓
**Read Scripture**
↓
**Complete Reading**
↓
**Reflect**
↓
**Share (Optional)**
↓
**See Group Activity**
↓
**Encourage Each Other**
↓
**Return Tomorrow**

The product should encourage users to return because of both:

**Personal spiritual habit + Community connection**

---

# 10. MVP Scope

Prioritize:

### MEMBER MOBILE

* Authentication
* Join program/group
* Home
* Daily reading
* Reading progress
* Complete reading
* Reflection
* Reflection visibility
* Group page
* Group reflections
* Personal progress
* Notifications

### LEADER MOBILE

All Member capabilities +

* Group progress overview
* Member progress
* Send encouragement/reminder
* Group announcement

### ADMIN WEB

* Organization management
* Program management
* Reading plan management
* Group management
* Leader management
* Member management
* Program dashboard
* Group progress dashboard
* Basic engagement analytics

---

# 11. Features NOT Required for Initial MVP

Do not prioritize:

* AI Bible assistant
* Complex gamification
* Competitive leaderboard
* Social media-style public feed
* Advanced achievement system
* Church event management
* Donation
* Sermon streaming
* Prayer community
* Full church management system

Keep MVP focused on:

**Bible Reading + Reflection + Community + Progress + Program Management**

---

# 12. UX Principles

The UI should feel:

* Calm
* Warm
* Modern
* Personal
* Spiritual without looking overly traditional
* Community-oriented
* Simple
* Encouraging

Avoid making the interface feel like:

* Corporate dashboard
* Employee attendance system
* Productivity tracker
* Competitive fitness application

The spiritual experience should remain the priority.

---

# 13. Design Direction

Mobile-first experience for Member and Leader.

Use:

* Clean layouts
* Generous whitespace
* Soft visual hierarchy
* Rounded cards
* Comfortable Bible reading typography
* Subtle progress visualization
* Warm photography/illustrations when appropriate
* Minimal distractions during Bible reading

The Bible Reader screen should prioritize readability above all other UI elements.

Admin Web can be more data-oriented while maintaining the same visual identity.

---

# 14. Key Product Principle

Whenever implementing a feature, evaluate it against this question:

**"Apakah fitur ini membantu orang membaca Firman dan bertumbuh bersama, atau hanya membuat aktivitas mereka lebih mudah dipantau?"**

If a feature primarily creates surveillance without improving the user's spiritual or community experience, reconsider the implementation.
