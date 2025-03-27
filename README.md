# CivicPlus Code Test

## How to Run

This project was built using the following:

- PHP 8.4 + Composer 2.8.6
- Laravel 12
- Node.js 22.13
- React 19
- SQLite (not used, but required to have set up in order to run the app)

To run this locally since no Dockerfile was included, these dependencies must first be installed. After that the app can be fully set up with the following commands:

```sh
$ nvm use && npm install
$ composer install
$ composer run dev
```

## Summary of Changes

- Scaffolded a full MVC web app using PHP and React using pre-made starter kit provided by the popular PHP framework Laravel
- Implemented a new unauthenticated view under `/calendar-events` to showcase coding challenge
- Backend implementation
    - Registered new route for URL
    - Created a new `CalendarEventsController` to manage API service calls to generate auth tokens
- Frontend implementation
    - Leveraged existing starter kit resources (Tailwind + ShadCN components) to quickly scaffold a basic page layout and design
    - New top-level view component under `resources/js/pages/calendar/events-list.tsx`
    - New custom components under `resources/js/components/add-event-dialog.tsx`
    - Basic logic to fetch and display from the Events endpoint using the provided auth token from the Backend
    - Renders a dialog box with basic form + controls to add new events
        - (BUG) List doesn't repopulate without full page reload due to time constraints
        - Basic logic filters and only shows events for the current date instead of all registered events

## Considerations for Improvement

- Caching the auth token generation call would be a great place to start. Using a built-in mechanism in a framework like this is an easy way to store in memory or a tool like Redis and set expiry timeouts to re-fetch as needed
- The logic interacting with the API should be moved out of the controller and into a service class to improve testability and support expansion of functionality
- Loading UI could be added to smooth out UI experience and bug with not reloading the page should be fixed
- Date formatting doesn't include time, only date, and that should be displayed
- (Edge case) add a debounce or disable dialog save button on click to avoid doubling up entries
- `CalendarEvent` TypeScript type should have a more descriptive type for date strings
- The `useEffect` data fetching hook should be abstracted out and/or should be replaced with the modern `use` function introduced in React 19 for better UX and best practices
- Dockerfile should be added to simplify development setup and would help with ease of deployment

### Addendum: Why this stack?

I chose this tech stack for a few reasons:

- It seems to align close with what the role is hiring for (full-stack)
- PHP is moderately close in syntax to C#, and my current PHP working knowledge exceed my C# knowledge
- Choosing a full-stack solution simplified making calls to the API, as calls could be split between server-to-server and client-to-server as needed
- This stack has good options for scaling/expansion over time
- This stack is arugably more dated compared to other choices, especially in JS world, but it vetted and proven
- Laravel's ecosystem specifically made it easy to get things up and running relatively quick with lots of pre-built solutions for common web app features

But it's not perfect. Some downsides:

- Increased infrastructure cost to host a full-stack, server-side app + a front-end (either embedded alongside or deployed separately)
    - The latter also means increased complexity in infrastructure hosting and larger surface area for devs to be familiar with
    - This stack may also prove to be more costly financially, especially compared to static web hosting
- Scaffolding using an entire "starter kit" results in a lot potentially unused code that would take time to clean out
    - This could be mitigated with a different scaffold however
- Language learning curve based on chosen tech and new/existing staff
    - Context switing language-wise could impede developer productivity
    - If a language choice doesn't align with what the larger org is doing, it splinters the tech stack and adds overall burden to the entire org
- Performance concerns
    - PHP is probably not the most performant language choice if CPU-intensive tasks are required, but alternative architectures could be useful to balance that out
