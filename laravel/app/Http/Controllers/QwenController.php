<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use QwenClient;

class QwenController extends Controller
{

    public function index(Request $request)
    {
        // Validate request
        $request->validate([
            'video' => 'required|file|mimetypes:video/mp4,video/avi,video/mpeg,video/quicktime|max:100000',
        ]);

        try {
            // Get the video file
//            $videoFile = $request->file('video');

            // Read video as binary data
            $videoData = file_get_contents("/var/www/utaone/laravel/storage/app/public/recordings/3_3_1745730186.webm");

            // Encode to base64
            $base64Video = base64_encode($videoData);

            // Get file extension
            $fileExtension = "video/webm";

            // Initialize QwenClient
            $qwen = app(QwenClient::class);

            // Create content array with video data
            $content = [
                [
                    'type' => 'text',
                    'text' => 'Analyze this video and describe its content in detail.'
                ],
                [
                    'type' => 'video',
                    'video' => [
                        'format' => $fileExtension,
                        'data' => $base64Video
                    ]
                ]
            ];

            // Send to Qwen 2.5 LV API
            $response = $qwen
                ->withModel('qwen-2.5-lv')  // Use Qwen 2.5 LV model
                ->withContent($content)     // Set custom content with video
                ->run();

            // Return the response
            return response()->json([
                'success' => true,
                'analysis' => $response,
            ]);

        } catch (\Exception $e) {
            // Log the exception
            Log::error('Qwen Video Analysis Error: ' . $e->getMessage());

            // Return error response
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during video analysis',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Process and analyze a video using Alibaba Qwen 2.5 LV API
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function analyzeVideo(Request $request)
    {
        // Validate request
        $request->validate([
            'video' => 'required|file|mimetypes:video/mp4,video/avi,video/mpeg,video/quicktime|max:100000',
        ]);

        try {
            // Get the video file
            $videoFile = $request->file('video');

            // Read video as binary data
            $videoData = file_get_contents($videoFile->getPathname());

            // Encode to base64
            $base64Video = base64_encode($videoData);

            // Get file extension
            $fileExtension = $videoFile->getClientOriginalExtension();

            // Initialize QwenClient
            $qwen = app(QwenClient::class);

            // Create content array with video data
            $content = [
                [
                    'type' => 'text',
                    'text' => 'Analyze this video and describe its content in detail.'
                ],
                [
                    'type' => 'video',
                    'video' => [
                        'format' => $fileExtension,
                        'data' => $base64Video
                    ]
                ]
            ];

            // Send to Qwen 2.5 LV API
            $response = $qwen
                ->withModel('qwen-2.5-lv')  // Use Qwen 2.5 LV model
                ->withContent($content)     // Set custom content with video
                ->run();

            // Return the response
            return response()->json([
                'success' => true,
                'analysis' => $response,
            ]);

        } catch (\Exception $e) {
            // Log the exception
            Log::error('Qwen Video Analysis Error: ' . $e->getMessage());

            // Return error response
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during video analysis',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
