<?php
// Configuration
$baseDirectory = 'C:\xampp\htdocs\subdomain-answer-supplement';
$outputFile = 'Components_content.txt';

// Define file collections by category
$fileCollections = [
//    'CSS Files' => [
//        $baseDirectory . '\css\styles.css'
//    ],

    'JavaScript Files' => [
        $baseDirectory . '\js\app.js',
        $baseDirectory . '\js\pages\cart-page.js',
        $baseDirectory . '\js\pages\home-page.js',
        $baseDirectory . '\js\pages\product-page.js',
        $baseDirectory . '\js\pages\products-page.js',
//        $baseDirectory . '\js\categories.js',
        $baseDirectory . '\js\page-manager.js',
//        $baseDirectory . '\js\products.js',
        $baseDirectory . '\js\router.js',
//        $baseDirectory . '\js\svg-sprites.js',
//        $baseDirectory . '\js\tailwind.config.js',
        $baseDirectory . '\js\template-loader.js'
    ],

//    'Component Templates' => [
//        $baseDirectory . '\templates\components\floating-buttons.html',
//        $baseDirectory . '\templates\components\footer.html',
//        $baseDirectory . '\templates\components\navigation.html'
//    ],

    'Page Templates' => [
        $baseDirectory . '\templates\pages\cart-page.html',
        $baseDirectory . '\templates\pages\home-page.html',
        $baseDirectory . '\templates\pages\product-page.html',
        $baseDirectory . '\templates\pages\products-page.html'
    ],

    'Main Files' => [
        $baseDirectory . '\index.html',
//        $baseDirectory . '\README.md'
    ]
];

// Files to exclude (if any)
$excludeFiles = [
    // Add specific files to exclude if needed
    // 'filename.js',
];

// Initialize content string
$finalContent = '';
$totalFilesProcessed = 0;

// Process each category
foreach ($fileCollections as $categoryName => $files) {
    // Add category header
    $finalContent .= str_repeat('=', 80) . "\n";
    $finalContent .= strtoupper($categoryName) . "\n";
    $finalContent .= str_repeat('=', 80) . "\n\n";

    foreach ($files as $filePath) {
        // Skip if file should be excluded
        $filename = basename($filePath);
        if (in_array($filename, $excludeFiles)) {
            continue;
        }

        // Check if file exists
        if (!file_exists($filePath)) {
            echo "Warning: File not found - {$filePath}\n";
            continue;
        }

        // Read file content
        $content = file_get_contents($filePath);

        if ($content === false) {
            echo "Error: Unable to read file - {$filePath}\n";
            continue;
        }

        // Add file header and content
        $finalContent .= str_repeat('-', 60) . "\n";
        $finalContent .= "File: " . basename($filePath) . "\n";
        $finalContent .= "Path: {$filePath}\n";
        $finalContent .= "Size: " . strlen($content) . " bytes\n";
        $finalContent .= str_repeat('-', 60) . "\n\n";
        $finalContent .= $content . "\n\n";

        $totalFilesProcessed++;
    }

    // Add spacing between categories
    $finalContent .= "\n\n";
}

// Alternative method: Auto-discover files by extension
function autoDiscoverFiles($baseDir, $extensions = ['js', 'html', 'css', 'md']) {
    $discoveredFiles = [];

    foreach ($extensions as $ext) {
        // Search recursively for files with specific extensions
        $pattern = $baseDir . '\**\*.' . $ext;
        $files = glob($pattern, GLOB_BRACE);

        // Also search in root directory
        $rootFiles = glob($baseDir . '\*.' . $ext);
        $files = array_merge($files, $rootFiles);

        $discoveredFiles = array_merge($discoveredFiles, $files);
    }

    return array_unique($discoveredFiles);
}

// Uncomment the following section if you want to auto-discover files instead
/*
echo "Auto-discovering files...\n";
$autoDiscoveredFiles = autoDiscoverFiles($baseDirectory);
$finalContent .= str_repeat('=', 80) . "\n";
$finalContent .= "AUTO-DISCOVERED FILES\n";
$finalContent .= str_repeat('=', 80) . "\n\n";

foreach ($autoDiscoveredFiles as $filePath) {
    $filename = basename($filePath);
    if (in_array($filename, $excludeFiles)) {
        continue;
    }

    $content = file_get_contents($filePath);
    if ($content !== false) {
        $finalContent .= str_repeat('-', 60) . "\n";
        $finalContent .= "File: {$filename}\n";
        $finalContent .= "Path: {$filePath}\n";
        $finalContent .= str_repeat('-', 60) . "\n\n";
        $finalContent .= $content . "\n\n";
        $totalFilesProcessed++;
    }
}
*/

// Write the combined content to output file
if (!empty($finalContent)) {
    $result = file_put_contents($outputFile, $finalContent);

    if ($result === false) {
        echo "Error: Unable to write to {$outputFile}\n";
    } else {
        echo "✅ Successfully processed {$totalFilesProcessed} files\n";
        echo "📄 Content saved to: {$outputFile}\n";
        echo "📊 Total size: " . number_format(strlen($finalContent)) . " characters\n";

        // Show summary by category
        echo "\n📋 Files processed by category:\n";
        foreach ($fileCollections as $categoryName => $files) {
            $categoryCount = count(array_filter($files, function($file) use ($excludeFiles) {
                return file_exists($file) && !in_array(basename($file), $excludeFiles);
            }));
            echo "   • {$categoryName}: {$categoryCount} files\n";
        }
    }
} else {
    echo "❌ Error: No content was retrieved from the files\n";
}

// Optional: Create a file index
$indexContent = "FILE INDEX - Generated on " . date('Y-m-d H:i:s') . "\n";
$indexContent .= str_repeat('=', 50) . "\n\n";

foreach ($fileCollections as $categoryName => $files) {
    $indexContent .= "{$categoryName}:\n";
    foreach ($files as $file) {
        if (file_exists($file) && !in_array(basename($file), $excludeFiles)) {
            $size = filesize($file);
            $indexContent .= "  • " . basename($file) . " ({$size} bytes)\n";
        }
    }
    $indexContent .= "\n";
}

file_put_contents('File_Index.txt', $indexContent);
echo "📑 File index created: File_Index.txt\n";
?>
