<?php
// Configuration
//$componentsDirectory = 'js'; // Relative path within the repository
$componentsDirectory = 'C:\xampp\htdocs\subdomain-answer-supplement\js'; // Relative path within the repository
//$componentsDirectory = 'C:\xampp\htdocs\subdomain-answer-supplement\templates\components'; // Relative path within the repository
$componentsDirectory = ''; // Relative path within the repository
$outputFile = 'Components_content.txt';

// Files to exclude
$excludeFiles = [
//    'products-page.js',
//    'product-page.js',
//    'tailwind.config.js',
    'categories.js',
    'products.js',
    // Add more files to exclude as needed
];

// Get all JS files in the directory
$componentPaths = glob($componentsDirectory . '/*.js');

// Filter out excluded files
$filteredComponentPaths = array_filter($componentPaths, function($path) use ($excludeFiles) {
    $filename = basename($path);
    return !in_array($filename, $excludeFiles);
});

// Add additional files manually
$additionalFiles = [
    'C:\xampp\htdocs\subdomain-answer-supplement\js\pages\products-page.js',
    'C:\xampp\htdocs\subdomain-answer-supplement\templates\pages\products-page.html',
//    'C:\xampp\htdocs\subdomain-answer-supplement\js\components.js',
//    'C:\xampp\htdocs\subdomain-answer-supplement\index.html',
];


// Merge files into one array
$allFiles = array_merge($filteredComponentPaths, $additionalFiles);

// Initialize content string
$finalContent = '';

// Process each file
foreach ($allFiles as $index => $targetFile) {
    // Read the content of the target file
    $content = file_get_contents($targetFile);

    if ($content === false) {
        echo "Error: Unable to read the file {$targetFile}\n";
        continue;
    }

    // Add file path header
    $fileContent = "File Path: {$targetFile}\n\n" . $content;

    // Add to final content with separator (except for the first file)
    if ($index > 0) {
        $finalContent .= "\n\n\n\n\n\n"; // 6 new lines as separator
    }

    $finalContent .= $fileContent;
}

// Write the combined content to the output file
if (!empty($finalContent)) {
    $result = file_put_contents($outputFile, $finalContent);

    if ($result === false) {
        echo "Error: Unable to write to the file {$outputFile}\n";
    } else {
        echo "Successfully copied the content of " . count($allFiles) . " files to {$outputFile}\n";
    }
} else {
    echo "Error: No content was retrieved from the files\n";
}
