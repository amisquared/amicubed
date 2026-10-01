---
title: Absolute Privacy
date: 2026-09-30
tags:
  - writeup
  - philippines
  - pwd
  - id
  - exposed
description: How I found out Philippine PWD ID holders' PII isn't anonymized, aciddentally...
---

# Background

As I searching for ideas for [Hack Club's Phantom](https://phantom.hackclub.com), a sudden lightbulb came to me:

> "I should make a Persons With Disability ID verification wrapper!"

And so I did some digging into the DOH's absolute PHPMaker (heh) hell of a site, and tried to figure out how the requests work.

# The search

When you send a request from the website, it sends this request:

```
https://pwd.doh.gov.ph/tbl_pwd_id_verificationlist.php
?cmd=search
&t=tbl_pwd_id_verification
&x_pwd_id_number=00-0000-000-0000000
```

And with more digging, I found out you can export to CSV and/or Excel spreadsheets by adding `?export=csv` or `?export=csv`.

The request you would make as a ~~filthy scraper~~ honest site user would be something like this:

```
https://pwd.doh.gov.ph/tbl_pwd_id_verificationlist.php
?cmd=search
&t=tbl_pwd_id_verification
&x_pwd_id_number=00-0000-000-0000000
&export=csv
```

In return, you get raw CSV data with _**absolutely zero**_ anonymizing from the backend:

```csv
"Last Name","First Name","Middle Name","Date of Birth","Sex","ID Number"
":::::::",":::::::",":::::::","MM/DD/YYYY","Male","00-0000-000-0000000"
```

[^1]
... or if your request is invalid, you only get request headers with no data.

# What does this mean?

This means someone with compute power and ability to bypass Cloudflare, (which is everyone, with the day of coding AI agents) can _theoretically_ find your PWD ID, and possibly locate you since,

All PWD control numbers have a known pattern where:

`AA-BBBB-CCC-DDDDDDD`

- A, being your region,
- B, as your city or muncipalities code,
- C, being your barangay code,
- and D, being your identifier code.

Then someone can find your region, and then brute-force search your ID, and use the other numbers to find where you are located.

This is concerning, especially when People with Disabilities are a vulnerable class, and/are suspectible to any type of discrimination that Miku knows. Yes I am aware that businesses use this for verifying if you are eligble for discounts, but that **should literally be** exposed in a different platform.

### In conclusion

DICT/CICC/DoH/whoever fucking runs this shit, fix your system. _**WE**_ pay taxes for this.

[^1]: Redacted for very obvious reasons...
