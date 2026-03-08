

# Update Favicon

Replace `public/favicon.ico` with the uploaded `tarun_favocon.ico` file and ensure the HTML references it correctly for both desktop and mobile browsers.

## Steps

1. Copy `user-uploads://tarun_favocon.ico` to `public/favicon.ico`
2. Verify `index.html` already has `<link rel="icon" href="/favicon.ico" type="image/x-icon" />` (it does from the previous update)
3. Add an Apple touch icon link for iOS home screen support: `<link rel="apple-touch-icon" href="/favicon.ico" />`

