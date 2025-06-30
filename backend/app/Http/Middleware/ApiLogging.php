<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class ApiLogging
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        
        Log::info('API Request', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => $request->all(),
        ]);

        $response = $next($request);

        $endTime = microtime(true);
        $duration = round(($endTime - $startTime) * 1000, 2);

        Log::info('API Response', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'status' => $response->getStatusCode(),
            'duration_ms' => $duration,
        ]);

        return $response;
    }
}
