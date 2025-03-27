<?php

namespace App\Http\Controllers\Calendar;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class CalendarEventsController extends Controller
{
    /**
     * Base URL for accessing interview resources
     */
    public static string $urlBase = 'https://interview.civicplus.com/';

    /**
     * Unique UUID presumably connected to my application
     */
    public static string $uuid = '075809a4-975a-4c68-a46f-01e3b2569b9b';

    /**
     * Bearer token returned after authenticating via the API
     */
    public string $authToken;

    public function show(): Response
    {
        $authToken = $this->getAuthToken();
        return Inertia::render('calendar/events-list', [
            'authToken' => $authToken,
            'apiUrl' => static::$urlBase . static::$uuid
        ]);
    }

    public function create(): Response
    {
        $authToken = $this->getAuthToken();
        return Inertia::render('calendar/events-list-form', [
            'authToken' => $authToken,
            'apiUrl' => static::$urlBase . static::$uuid
        ]);
    }

    private function getAuthToken(): string
    {
        $clientId = env('CIVICPLUS_CLIENT_ID');
        $clientSecret = env('CIVICPLUS_CLIENT_SECRET');

        $apiUrl = static::$urlBase . static::$uuid . '/api/Auth';

        // TODO: add caching based on auth token's expiration using Cache::flexible
        $response = Http::post($apiUrl, ['clientId' => $clientId, 'clientSecret' => $clientSecret])->json();
        $this->authToken = $response['access_token'];

        return $response['access_token'];

        // Potential strategy for requesting + caching using a stale-while-revalidate pattern
        // $authToken = Cache::store('file')->flexible('events_auth_token', [], function () {
        //     $response = Http::post($apiUrl, ['clientId' => $clientId, 'clientSecret' => $clientSecret])->json();
        //     return $response['access_token'];
        // });
    }
}
