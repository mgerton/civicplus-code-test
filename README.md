# CivicPlus Code Test

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

### Addendum: Why this stack?

I chose this tech stack for a few reasons:

- It seems to align close with what the role is hiring for (full-stack)
- PHP is moderately close in syntax to C#, and my current PHP working knowledge exceed my C# knowledge
- Choosing a full-stack solution simplified making calls to the API, as calls could be split between server-to-server and client-to-server as needed
