# RemindMe

A Chrome extension that reminds you to use cashback and coupon sites while shopping online.

## Features

🎯 **Auto-Detection** — Detects when you visit shopping sites and automatically shows a reminder popup

💰 **Cashback Links** — Quick access to:
- [Cashback.co.il](http://Cashback.co.il)
- [ali-buy.com/aliexpress-coupons/](https://ali-buy.com/aliexpress-coupons/)
- [AliExpress Portals](https://portals.aliexpress.com/affiportals/web/home.htm) (opens in incognito mode)

🎨 **Visual Indicator** — Icon changes color:
- 🟢 **Green** — On shopping sites (reminder active)
- 🟡 **Yellow** — On other sites (dormant)

🔔 **Blinking Header** — Eye-catching animated reminder

⏬ **Compact Design** — Fixed-size sidebar popup, doesn't obstruct browsing

## Supported Shopping Sites

- Amazon (all regions)
- AliExpress (all regions)
- eBay (all regions)
- Walmart
- Target
- Best Buy
- Etsy
- Wish
- Gearbest
- Banggood

## Installation

### From Source (Development)

1. Clone this repo:
   ```bash
   git clone https://github.com/yourusername/RemindMe.git
   cd RemindMe
   ```

2. Open Chrome and go to `chrome://extensions`

3. Enable **Developer mode** (toggle in top-right)

4. Click **Load unpacked** and select the `RemindMe` folder

5. Extension loads! Icon appears in toolbar

### Usage

1. Visit any supported shopping site
2. Green icon appears + sidebar pops up on right
3. Click links to access cashback/coupon sites
4. Click **✕** to close popup (can reopen by clicking icon)
5. Visit non-shopping sites → icon turns yellow, no popup

## File Structure

```
RemindMe/
├── manifest.json          # Extension config (Manifest V3)
├── background.js          # Handles icon switching & popup toggle
├── content-script.js      # Detects shopping sites, injects sidebar
├── popup.css              # Sidebar styling & animations
├── icons/
│   ├── icon-yellow-16.png
│   ├── icon-yellow-48.png
│   ├── icon-yellow-128.png
│   ├── icon-green-16.png
│   ├── icon-green-48.png
│   └── icon-green-128.png
├── LICENSE                # MIT License
└── README.md              # This file
```

## Tech Stack

- **Manifest V3** — Latest Chrome extension standard
- **Vanilla JavaScript** — No dependencies or frameworks
- **CSS3** — Animations, flexbox, gradients
- **Chrome APIs** — tabs, windows, runtime, storage, action

## Contributing

Contributions welcome! Feel free to:
- Add more shopping sites
- Improve UI/UX
- Fix bugs
- Suggest features

## License

MIT License — See [LICENSE](LICENSE) file for details

## Support

Found a bug? Have a suggestion? Open an [issue](https://github.com/yourusername/RemindMe/issues)
