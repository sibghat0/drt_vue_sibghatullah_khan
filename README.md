<p align="center"><h1 align="center">DRT_VUE_SIBGHATULLAH_KHAN</h1></p>
<p align="center">
	<img src="https://img.shields.io/github/license/sibghat0/drt_vue_sibghatullah_khan?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/sibghat0/drt_vue_sibghatullah_khan?style=default&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/sibghat0/drt_vue_sibghatullah_khan?style=default&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/sibghat0/drt_vue_sibghatullah_khan?style=default&color=0080ff" alt="repo-language-count">
</p>
<p align="center"><!-- default option, no dependency badges. -->
</p>
<p align="center">
	<!-- default option, no dependency badges. -->
</p>
<br>

##  Table of Contents

- [ Overview](#-overview)
- [ Features](#-features)
- [ Project Structure](#-project-structure)
  - [ Project Index](#-project-index)
- [ Getting Started](#-getting-started)
  - [ Prerequisites](#-prerequisites)
  - [ Installation](#-installation)
  - [ Usage](#-usage)
  - [ Testing](#-testing)
- [ Project Roadmap](#-project-roadmap)
- [ Contributing](#-contributing)
- [ License](#-license)
- [ Acknowledgments](#-acknowledgments)

---

##  Overview

<code>❯ Build a functional, responsive, and clean web interface to:
• Search, filter, and view satellite data
• Handle large datasets efficiently
• Optionally allow object selection and persistence</code>

---

##  Features

<code>1. Search
  • Input for name and noradCatId
  • Partial matches allowed
  • Search triggers only on Enter
2. Filters
  • Object Type (multi-select)
  • Orbit Code (multi-select)
  • Must have an Apply Filters button
  • Show count values on filter change
  • Possible values for orbit codes:
  LEO", "LEO1", "LEO2", "LEO3", "LEO4", "MEO", "GEO", "HEO", "IGO", "EGO", "NSO", "GTO", "GHO", "HAO",
  "MGO", "LMO", "UFO", "ESO", "UNKNOWN"
3. Results Table
  • Columns:
  • name, noradCatId, orbitCode, objectType, countryCode, launchDate
  • Sorting:
  • Mandatory: name, noradCatId
  • Optional: launchDate, countryCode
4. Virtualized List Rendering
  • Must use virtualization for large datasets
  • Can use external libraries
5. Error / Loading States
  • Show appropriate components on loading/failure
6. Row Selection
  • Each row has a checkbox
  • Max 10 selections allowed
  • Show selected count
  • Show error if limit exceeded
7. Proceed Button
  • Saves selected objects to localStorage
  • Navigates to a second page showing:
  • Plain list: name, noradCatId of selected objects
8. Persistence
  • Selected data must persist on page reload
</code>

---

##  Project Structure

```sh
└── drt_vue_sibghatullah_khan/
    ├── README.md
    ├── env.d.ts
    ├── eslint.config.ts
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── public
    │   └── favicon.ico
    ├── src
    │   ├── App.vue
    │   ├── assets
    │   ├── components
    │   ├── constants
    │   ├── main.ts
    │   ├── router
    │   ├── service
    │   ├── stores
    │   ├── types
    │   ├── ui
    │   └── views
    ├── tailwind.config.js
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── tsconfig.vitest.json
    ├── vite.config.ts
    └── vitest.config.ts
```

---
##  Getting Started

###  Prerequisites

Before getting started with drt_vue_sibghatullah_khan, ensure your runtime environment meets the following requirements:

- **Programming Language:** TypeScript
- **Package Manager:** Npm


###  Installation

Install drt_vue_sibghatullah_khan using one of the following methods:

**Build from source:**

1. Clone the drt_vue_sibghatullah_khan repository:
```sh
❯ git clone https://github.com/sibghat0/drt_vue_sibghatullah_khan
```

2. Navigate to the project directory:
```sh
❯ cd drt_vue_sibghatullah_khan
```

3. Install the project dependencies:


**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm install
```




###  Usage
Run drt_vue_sibghatullah_khan using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm start
```


---
