<?php
// ==============================================
// BOBOMOBİLYA | Basit Güvenli Mail Uç Noktası
// ==============================================

// ---- Ayarlar ----
const TO_EMAIL   = 'info@bobomobilya.com';   // form bildirimi bu adrese gelecek
const TO_NAME    = 'Bobo İletişim';
const SITE_NAME  = 'BOBOMOBİLYA';

// SPF/DMARC uyumu için göndereni kendi domaininden tut
const FROM_EMAIL = 'no-reply@bobomobilya.com';
const FROM_NAME  = 'Form Robotu';

// SMTP kullanmak istersen:
const USE_SMTP   = false; // SMTP kullanacaksan true yap
const SMTP_HOST  = 'smtp.bobomobilya.com';
const SMTP_USER  = 'smtp-kullanici';
const SMTP_PASS  = 'smtp-sifre';
const SMTP_PORT  = 587;
const SMTP_SEC   = 'tls'; // 'ssl' veya 'tls'

// ---- CORS/JSON ----
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

// ---- Sadece POST ----
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(['success'=>false,'message'=>'Geçersiz istek.']); exit;
}

// ---- Basit rate-limit (60 sn) ----
session_start();
$now = time();
if (!empty($_SESSION['last_submit']) && ($now - $_SESSION['last_submit'] < 60)) {
  echo json_encode(['success'=>false,'message'=>'Çok hızlısın. Lütfen 1 dakika sonra tekrar dene.']);
  exit;
}

// ---- Honeypot ----
if (!empty($_POST['hp'])) {
  echo json_encode(['success'=>true,'message'=>'Alındı.']); // botlara “başarılı” dön
  exit;
}

// ---- Girdi al/sanitize ----
function clean($v, $len=500) {
  $v = trim($v ?? '');
  $v = preg_replace('/[\r\n]+/u', ' ', $v);
  $v = strip_tags($v);
  return mb_substr($v, 0, $len, 'UTF-8');
}

$name    = clean($_POST['name']   ?? '', 120);
$email   = clean($_POST['email']  ?? '', 160);
$phone   = clean($_POST['phone']  ?? '', 32);
$topic   = clean($_POST['topic']  ?? '', 80);
$message = clean($_POST['message']?? '', 1200);

// ---- Doğrulama ----
$errors = [];
if ($name === '')   $errors[] = 'Ad Soyad zorunludur.';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Geçerli e-posta girin.';
if ($topic === '')  $errors[] = 'Konu seçin.';
if ($message === '')$errors[] = 'Mesaj boş olamaz.';

if ($errors) {
  echo json_encode(['success'=>false, 'message'=>implode(' ', $errors)]); exit;
}

// ---- Mail içeriği ----
$subject = "📩 Yeni iletişim formu – {$topic}";
$ip      = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ua      = $_SERVER['HTTP_USER_AGENT'] ?? '-';

$bodyTxt = <<<TXT
Yeni iletişim formu gönderimi

Ad Soyad : {$name}
E-posta  : {$email}
Telefon  : {$phone}
Konu     : {$topic}

Mesaj:
{$message}

---
IP: {$ip}
Tarayıcı: {$ua}
Site: {SITE_NAME}
TXT;

$bodyHtml = nl2br(htmlentities($bodyTxt, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));

// ---- Gönderim: PHPMailer (SMTP) ya da native mail() ----
$sent = false;
$err  = null;

if (USE_SMTP) {
  // PHPMailer kullanmak için: composer require phpmailer/phpmailer
  try {
    require_once __DIR__ . '/vendor/autoload.php';
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = SMTP_SEC;
    $mail->Port       = SMTP_PORT;

    $mail->CharSet = 'UTF-8';
    $mail->setFrom(FROM_EMAIL, FROM_NAME);
    $mail->addAddress(TO_EMAIL, TO_NAME);
    // Yanıtla’ya gerçek gönderen gelsin:
    $mail->addReplyTo($email, $name);

    $mail->Subject = $subject;
    $mail->isHTML(true);
    $mail->Body    = $bodyHtml;
    $mail->AltBody = $bodyTxt;

    $sent = $mail->send();
  } catch (Throwable $e) {
    $err = $e->getMessage();
  }
} else {
  // Native mail()
  $headers = [];
  $headers[] = 'MIME-Version: 1.0';
  $headers[] = 'Content-type: text/html; charset=UTF-8';
  $headers[] = 'From: ' . mb_encode_mimeheader(FROM_NAME, 'UTF-8') . " <".FROM_EMAIL.">";
  $headers[] = 'Reply-To: ' . mb_encode_mimeheader($name, 'UTF-8') . " <{$email}>";

  $sent = @mail(TO_EMAIL, '=?UTF-8?B?'.base64_encode($subject).'?=', $bodyHtml, implode("\r\n", $headers));
}

if ($sent) {
  $_SESSION['last_submit'] = $now;
  echo json_encode(['success'=>true,'message'=>'Mesajınız gönderildi. En kısa sürede iletişime geçeceğiz.']);
} else {
  $msg = USE_SMTP
      ? ('Mail gönderilemedi. Sunucu hatası: '.($err ?: 'bilinmiyor'))
      : 'Mail gönderilemedi. Sunucu mail() devre dışı olabilir.';
  echo json_encode(['success'=>false,'message'=>$msg]);
}
