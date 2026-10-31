# Hylix for Windows 0.3.4

The Windows 10/11 x64 installer includes the production Hylix server and its runtime. Opening Hylix starts it automatically and opens the cinema. Node.js, a terminal, and a source project are not required after installation and migration.

## Install and open

Run Hylix-Setup-0.3.3-Windows-x64.exe. It updates the existing per-user installation and its Start menu/Desktop shortcuts. The app runs directly from its installed program files; it no longer copies the runtime into user storage. Connection settings appear only for recovery or an explicitly configured remote server. The app reuses an already running Hylix on port 3000; otherwise it starts and owns its bundled server, stopping only that server when it exits. Another application occupying port 3000 produces a recovery message.

## Persistent local data

Data lives under %APPDATA%/hylix-windows/data, separate from the installed app. This includes hylix.db, a private .env, and uploaded pictures. Upgrading does not replace an initialized database. A local import-source.json in the parent folder can name an existing Hylix project for first-launch migration. SQLite backup captures the live database including WAL transactions. The source database is retained. This computer has been provisioned for that local migration. On this computer, the local source project now points to the migrated desktop database, so Meta and catalog edits use the same data. The original source database and a private environment backup remain available for rollback. Separate computers still require a hosted server for account/catalog synchronization.

The distributable contains a public catalog template with 11 published movies, the original artwork and logo, and no owner accounts, sessions, private credentials, or viewing history. A new computer starts with that template. Owner Meta access on this PC comes from the private migration. New-device administrator onboarding still needs setup before Meta management there.

## Features and boundaries

The app serves the same catalog, spotlight, details panels, trailers, profiles, saved lists, preferences and Meta workflows. Native renderer isolation, origin restrictions, and narrow launcher IPC remain enabled. Uploaded artwork is stored outside the install and served immediately by a validated image route. Meta session cookies follow the configured HTTPS/loopback origin.

Remote posters, trailers, metadata lookups, and hosted video sources require internet. The installer does not contain full movie video files. Google/Apple native desktop OAuth handoff remains unimplemented; browser sign-in and desktop cookies are separate. Local email/password viewer accounts remain available. Apple still needs its provider setup/public domain. The installer is unsigned.

## Rebuild

Keep hylix-windows beside the configured hylix source project. With Node 22+ and both projects' dependencies installed, run npm run check, npm run prepare:server, then npm run build:windows from hylix-windows. The .cmd launch/build helpers do those preparation steps. Output: dist-standalone/Hylix-Setup-0.3.3-Windows-x64.exe. The installer uses Electron 45 and electron-builder 26.18.0. Runtime dependency links are materialized as regular files to support relocation on Windows.

## Verification

95 web tests and 18 desktop policy/migration/startup/update tests passed. The standalone production build passed. An integration test with the packaged executable's bundled Node verified startup, catalog loading, Meta sign-in on loopback, and immediate/persistent image uploads against an isolated database. The installer input was scanned against the actual private configuration values; none were present.

References: [Electron application lifecycle](https://www.electronjs.org/docs/latest/api/app), [Electron security](https://www.electronjs.org/docs/latest/tutorial/security).


## Movie badge update 0.3.3

Meta → Badges manages per-movie announcement and ranking labels on spotlight and expanded hover images. Public posters stay image-only. The installed desktop server and prepared runtime are updated without replacing the saved database or private configuration. The 0.3.3 installer includes this server revision. See the sibling hylix/BADGES.md for usage and validation.

## Public online edition
See CLOUD-SETUP.md for the prepared online build, GitHub update flow and Cloudflare Pages download site. These are not deployed yet.

## Open source
The desktop application source is provided under the MIT License. Hylix branding and third-party movie artwork or video are not licensed by that source-code license. The public source package excludes databases, secrets, installed dependencies and bundled movie media.

## Quick reopen (0.3.4)
After the first launch, closing the cinema window keeps Hylix ready in the Windows tray. Reopening its shortcut restores the loaded catalog without a new server startup or page reload. Local media is paused and audio muted while hidden. Choose Quit Hylix from the tray or Hylix menu to stop the app and its owned local server completely. This does not add Hylix to Windows startup. First launch after a full quit/restart still requires the local server to start; a universal one-second cold-start time is not claimed.

**Looking for a Small Sponsorship to Support My Coding Journey 🚀**

Hi everyone!

I'm a student developer from the Philippines, passionate about AI, programming, and building real-world applications.

I've been teaching myself how to develop software, experimenting with AI models, and working on ambitious personal projects.

Unfortunately, my budget is limited, and accessing professional development tools can be difficult.

I'm looking for someone willing to offer mentorship, access to free developer resources, or a small sponsorship of around **$20 toward eligible AI coding tools**.

Even a little support or advice would mean a lot to me.

I'm happy to share my projects and demonstrate what I'm building.

Thank you for supporting aspiring young developers! ❤️
