# Hammer & Bricks — Mobile App (iOS + Android)

Mighty Units Ltd · Company No. 16815780
Built with Capacitor — wraps the existing Hammer & Bricks web game for native iOS and Android distribution.

## What's in this project

```
hb-mobile/
├── www/                    The game itself — index.html, manifest.json,
│                            service-worker.js, icons/ (PWA assets)
├── android/                 Native Android project (Android Studio)
├── ios/                     Native iOS project (Xcode — Mac required)
├── capacitor.config.ts      App ID, name, colours, splash screen settings
└── package.json
```

Game modes on mobile: **Player vs Player** and **Player vs AI** only.
Social Club (SC) has been intentionally left out of this build to keep the
mobile experience simple — it can be added back in a future version.

App ID: `com.mightyunits.hammerandbricks`
App name: **Hammer & Bricks**

## Before you build — one-time setup

```bash
cd hb-mobile
npm install
npx cap sync
```

This restores `node_modules` (not included in the download to keep the
file small) and re-copies the `www/` folder into both native projects.

## Building for Android

You need **Android Studio** installed (free, from developer.android.com).

1. Open a terminal in the `hb-mobile` folder and run:
   ```bash
   npx cap open android
   ```
2. Android Studio will open the `android/` project. Let it finish
   indexing and downloading Gradle dependencies (needs internet).
3. To test on your phone: connect it by USB with Developer Mode and
   USB debugging on, then click the green ▶ Run button.
4. To produce a release build for the Play Store:
   **Build → Generate Signed Bundle / APK → Android App Bundle (AAB)**.
   You will need to create a signing key the first time — Android
   Studio walks you through this with a dialog box.

## Building for iOS

You need a **Mac with Xcode** installed (free, from the Mac App Store).
iOS apps cannot be built on Windows or Linux — this is an Apple
requirement, not a project limitation.

1. On the Mac, in the `hb-mobile` folder, run:
   ```bash
   npm install
   npx cap sync
   npx cap open ios
   ```
2. Xcode will open the `ios/App` project.
3. Select your Apple Developer Team under
   **Signing & Capabilities** (requires an Apple Developer account,
   £79/year).
4. To test on your iPhone: connect it by USB, select it as the run
   target, and click ▶.
5. To submit to the App Store:
   **Product → Archive**, then use the Organizer window to upload to
   App Store Connect.

### No Mac available?

If you don't have access to a Mac, cloud Mac build services let you
build and submit iOS apps from Windows/Linux:
- **Codemagic** (codemagic.io) — free tier available, Capacitor support
  built in
- **Ionic Appflow** (ionic.io/appflow) — built specifically for
  Capacitor apps

Both can take this exact project (push it to a GitHub repo first) and
produce a signed `.ipa` ready for App Store Connect without you owning
a Mac.

## Cloud build with Codemagic — step by step

A ready-made `codemagic.yaml` is already included in this project with
three workflows: an Android debug build (no setup needed — good for a
first test), an Android release build (for the Play Store), and an
iOS release build (for the App Store).

**Step 1 — Push this project to GitHub**
```bash
cd hb-mobile
git init
git add .
git commit -m "Hammer and Bricks mobile app — initial Capacitor build"
```
Create a new repository on GitHub, then push following the instructions
GitHub gives you on the new repo page.

**Step 2 — Connect Codemagic**
Sign up free at codemagic.io, click **Add application**, select the
GitHub repo you just created. Codemagic will detect `codemagic.yaml`
automatically.

**Step 3 — Run the Android debug build first**
Select the **android-debug** workflow and click **Start new build**.
No signing setup required — this is the fastest way to get a real
`.apk` file you can install on your own Android phone within minutes,
to confirm everything works before going further.

**Step 4 — Android release (Play Store)**
You need a one-time Java keystore for signing. Generate one with:
```bash
keytool -genkey -v -keystore release.keystore -storetype JKS \
  -keyalg RSA -keysize 2048 -validity 10000 -alias hammerandbricks
```
Upload the resulting file in Codemagic under **Team settings →
Environment variables**, create a group called `android_signing`
containing `CM_KEYSTORE`, `CM_KEYSTORE_PASSWORD`, `CM_KEY_ALIAS`, and
`CM_KEY_PASSWORD`. Then run the **android-release** workflow to get a
signed `.aab` ready to upload to Google Play Console.

**Step 5 — iOS (App Store)**
This is the one part that genuinely requires an Apple Developer
account (£79/year, apple.com/developer) — there is no way around this,
it's Apple's requirement for any iOS distribution, cloud build or not.
Once you have that account:
1. In Codemagic, go to **Team settings → Integrations → Apple Developer
   Portal / App Store Connect** and follow the connection wizard.
2. Name the integration `codemagic_appstore_connect` (matching the
   `codemagic.yaml` already in this project — or update the file to
   match whatever name you choose).
3. Run the **ios-release** workflow. Codemagic handles certificates
   and provisioning profiles automatically once connected, and can
   submit straight to TestFlight.

**Costs to budget for:**
- Apple Developer account — £79/year (iOS only)
- Google Play Console — $25 one-time (Android only)
- Codemagic — free tier covers light usage; paid plans start if you
  need more build minutes per month

## App Store / Play Store listing assets needed

Before submission you will need:
- App icon ✅ already generated (`H&B` monogram, navy + gradient bar)
- Screenshots — at least 3-5 per platform, different device sizes
- App description (short + full)
- Privacy policy URL — required by both stores (point to a page on
  mightyunits.com)
- Support URL or email — joidehen@mightyunits.com

## Firebase note

The game uses Firebase Authentication and Firestore for online play.
The existing Firebase config is already embedded in `www/index.html`
and will work inside the native app automatically — no extra setup
needed for basic email/password sign-in.

If Google Sign-In does not open correctly inside the native app
(sometimes blocked in embedded WebViews), this is a known Capacitor +
Firebase issue with a documented fix using the
`@capacitor-firebase/authentication` plugin instead of the web SDK
popup. Flag this if you hit it during testing and it can be addressed
as a follow-up.

## Updating the game later

Whenever the web game at hb.mightyunits.com is updated, copy the new
`index.html` into `www/index.html` in this project, then run:
```bash
npx cap sync
```
This pushes the update into both the Android and iOS native projects
in one step. No need to touch any native code.
