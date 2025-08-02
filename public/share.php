<?php
/**
 * Share redirect script
 * Supports PHP 7.4+
 */

// Get parameters
$type = $_GET['type'] ?? '';
$id = $_GET['id'] ?? '';

// Base URL of your website
$base_url = 'https://' . $_SERVER['HTTP_HOST'];

// Determine redirect URL
switch ($type) {
    case 'product':
        if ($id) {
            $redirect_url = $base_url . '/?product=' . urlencode($id);
        } else {
            $redirect_url = $base_url;
        }
        break;
    
    case 'shop':
        $redirect_url = $base_url . '/?section=featured';
        break;
    
    default:
        $redirect_url = $base_url;
        break;
}

// Set headers for redirect
header('Location: ' . $redirect_url, true, 302);
exit;
?>