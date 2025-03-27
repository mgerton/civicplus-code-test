import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { createId } from '@paralleldrive/cuid2';
import { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { AddEventDialog } from '@/components/add-event-dialog';

interface EventsListProps extends SharedData {
    authToken: string;
    apiUrl: string;
}

interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    // TODO: use a proper ISO string or similar typing
    startDate: string;
    endDate: string;
}

interface CalendarEventList {
    total: number;
    items: CalendarEvent[];
}

export default function EventsList() {
    const { auth: laravelAuth, authToken, apiUrl } = usePage<EventsListProps>().props;

    const [totalEvents, setTotalEvents] = useState<number>(0);
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
    const [saved, setSaved] = useState(false);

    const today = Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date().getTime());

    // Instead of a useEffect, this should be either:
    // A) a custom hook, abstracted out and imported to be used here, or
    // B) Using the new `use()` method in React 19 to simplify logic around interstitial UIs are rendered by React
    useEffect(() => {
        const fetchCalendarEvents = async (url: string, authToken: string) => {
            const endpoint = `${url}/api/Events`;
            const headers = new Headers({
                accept: 'application/json',
                'Authorization': `Bearer ${authToken}`,
            });
    
            const res = await fetch(endpoint, { headers });
    
            if (!res.ok) {
                throw new Error('Unable to fetch events');
            }
    
            const responseBody: CalendarEventList = await res.json();
            setCalendarEvents(responseBody.items);
            setTotalEvents(responseBody.total);
        };

        fetchCalendarEvents(apiUrl, authToken);
    }, []);

    const handleAddEvent = async (title: string, description: string, startDate: string, endDate: string): boolean => {
        const saveCalendarEvent = async (url: string, authToken: string) => {
            const endpoint = `${url}/api/Events`;
            const headers = new Headers({
                accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            });

            const calendarEvent: CalendarEvent = {
                id: createId(),
                title,
                description,
                startDate,
                endDate,
            };
    
            const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(calendarEvent) });
    
            if (!res.ok) {
                throw new Error('Unable to save events');
            }

            setSaved(true);
            return saved;
        };

        const res = await saveCalendarEvent(apiUrl, authToken);
        return res;
    };

    const formatDate = (isoString: string) => {
        const d = new Date(isoString);
        return Intl.DateTimeFormat('en-US', {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(d);
    };

    return (
        <>
            <Head title="Calendar Events">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <h1 className="mb-1 font-medium">Calendar Events for {today}</h1>
                            <AddEventDialog onSave={handleAddEvent} />
                            <p className="mb-2 text-[#706f6c] dark:text-[#A1A09A]"></p>

                            {totalEvents < 1 ? <p className="mt-4 mb-4 flex-col lg:mt-6 lg:mb-6">No available events.</p> : <ul className="mb-4 flex flex-col lg:mb-6">
                                {calendarEvents
                                    .filter(calEvent => { return new Date(calEvent.startDate).getDay() === new Date().getDay()})
                                    .map(calEvent =>
                                        <Card key={`${calEvent.id}-${calEvent.startDate}`} className="mb-6 lg:mb-8 last:mb-0">
                                            <CardHeader>
                                                <CardTitle>{calEvent.title}</CardTitle>
                                                <CardDescription>{formatDate(calEvent.startDate)} to {formatDate(calEvent.endDate)}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                {calEvent.description}
                                            </CardContent>
                                        </Card>
                                    )}
                            </ul>}
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
