Why_It_Exists.md

# Project 2 — Why It Exists

## Project Architecture Notes & Interview Questions

### Stage 1 : Layout & Routing

- ##### Why separate frontend and backend?
    - I structured the project as separate frontend and backend applications under one project root. This allows me to develop, manage dependencies, environment variables, and deployment independently while keeping the complete application organized in one repository.

- #### What is a layout in React? & Why did you create a separate MainLayout component? & Why are Navbar and Footer in components/ rather than layouts/? & 
  - A layout is a reusable component that defines the common structure shared by multiple pages. In our project, MainLayout contains the Navbar, the dynamic page area, and the Footer.
  - Because multiple pages share the same application structure. Instead of repeating the Navbar and Footer on every page, I created a reusable layout that provides the common structure and allows the page-specific content to change dynamically.
  - Navbar and Footer are reusable UI components, while MainLayout is responsible for composing those components into a page structure. The folder separation is based on responsibility, not simply where the element appears on the screen.
- #### What is <Outlet />? & Why did you use <Outlet /> instead of directly rendering a page inside `MainLayout`?
  - <Outlet /> is provided by React Router and acts as a placeholder where the component of the currently matched child route is rendered.
  - MainLayout is shared by multiple pages. Outlet provides the location where React Router renders the currently matched child route, allowing the Navbar and Footer to remain common while the middle content changes based on the URL.

- #### Explain the routing flow in your project.
  - App -> AppRoutes -> MainLayout -> Outlet -> Mached page
  - App loads the application's routing configuration. The router determines which route matches the URL. MainLayout provides the common structure, and Outlet renders the matched child page.

- #### Why did you keep App.jsx relatively small?
  - App.jsx is the entry point for the application's component structure, so I don't want it to become responsible for every page and UI component. This makes the application easier to understand and maintain.

- #### What is the difference between a page, component, routes and layout?
  - A page generally represents a route-level screen.
  - A component is a reusable UI building block.
  - A route its the  logic that determines how URLs map to  pages.
  - A layout defines the common structure shared by multiple pages.
  ---
### Stage 2 :
- #### 
  - 

- #### 
  - 

- #### 
  - 

- #### 
  - 

- #### 
  - 

- #### 
  - 

- #### 
  - 

- #### 
  - 

- #### 
  - 

#### Why Chakra UI?

## Important Decisions

### Why this folder structure?

### Why mock data first?

## React Concepts

### Components

### Props

### State

...

## JavaScript Concepts

### undefined vs empty string

### truthy/falsy

...

## Interview Questions

### Q1.
Answer:

### Q2.
Answer:

## Milestone Notes

### Stage 1
...