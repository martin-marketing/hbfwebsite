<?php
// One-time use script — DELETE after downloading the zip
$source = __DIR__ . '/wp-content/uploads';
$output = __DIR__ . '/uploads_backup.zip';

if (!extension_loaded('zip')) {
    die('Error: zip extension not available on this server.');
}

if (!is_dir($source)) {
    die('Error: uploads folder not found at ' . $source);
}

$zip = new ZipArchive();
if ($zip->open($output, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    die('Error: could not create zip file.');
}

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($source, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);

$fileCount = 0;
foreach ($iterator as $file) {
    $filePath = $file->getRealPath();
    $relativePath = 'uploads/' . substr($filePath, strlen($source) + 1);
    if ($file->isDir()) {
        $zip->addEmptyDir($relativePath);
    } else {
        $zip->addFile($filePath, $relativePath);
        $fileCount++;
    }
}

$zip->close();

$sizeMB = round(filesize($output) / 1048576, 1);
echo "Done! Zipped {$fileCount} files ({$sizeMB} MB).<br>";
echo "<a href='uploads_backup.zip'>Download uploads_backup.zip</a><br><br>";
echo "<strong>Delete this file (zipuploads.php) and the zip after downloading.</strong>";
