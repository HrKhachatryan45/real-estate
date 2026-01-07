class ListingExpirationEmailTemplate:
    subject = "Your listing is expiring, {fullname}"

    body = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Listing Expiration</title>
  <style>
    body {{
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
      font-family: Arial, Helvetica, sans-serif;
    }}
    .container {{
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
    }}
    h1 {{
      color: #2b303a;
      text-align: center;
    }}
    p {{
      color: #555555;
      font-size: 15px;
      line-height: 1.6;
      text-align: center;
    }}
    .listing-title {{
      font-weight: bold;
      color: #2596d8;
    }}
    .button {{
      display: inline-block;
      margin-top: 25px;
      padding: 14px 30px;
      background-color: #2596d8;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 30px;
      font-size: 15px;
    }}
    .footer {{
      margin-top: 30px;
      font-size: 12px;
      color: #888888;
      text-align: center;
    }}
  </style>
</head>

<body>
  <div class="container">
    <h1>Listing Expiration Notice</h1>

    <p>Hello <strong>{fullname}</strong>,</p>

    <p>
      Your listing titled
      <span class="listing-title">"{title}"</span>
      is about to expire.
    </p>

    <p>
      To keep your listing active and visible, please renew or update it using
      the button below.
    </p>

    <p>
      <a class="button">
        Renew Listing
      </a>
    </p>

    <div class="footer">
      <p>If you no longer wish to keep this listing active, you can safely ignore this email.</p>
      <p>This link will expire in 24 hours.</p>
    </div>
  </div>
</body>
</html>
"""