<?php

//Remove slashes for text
$name = stripslashes($_POST['name']);
$email = stripslashes($_POST['email']);
$title = stripslashes($_POST['title']);
$message = stripslashes($_POST['message']);

$concat_msg = "\nName: " . $name . "| Email: " . $email . "| Title: " . $title . "| Message: " . $message;

$f = fopen('messages.txt', "a");
fwrite($f, $concat_msg);

fclose($f);

echo "<script type='text/javascript'>alert('Thanks for contacting me! I'll get back soon')</script>";
echo "<script type='text/javascript'>document.location='index.html'</script>";
