# Windows desktop build verification

Built on October 26, 2026 for Windows 10/11 x64.

Passed:
- Electron 45.0.0 and electron-builder 26.18.0 dependency installation from the locked npm dependency graph.
- Five connection-policy tests.
- NSIS per-user Windows installer build.
- Packaged Hylix.exe launched on this PC and visibly displayed the current Hylix catalog in its desktop window.
- Installer Windows PE signature and SHA-256 integrity check.
- Desktop app.asar inspected: no .env files, databases, private keys or certificates packaged.
- Source archive integrity check.

Artifacts:
- Hylix-Setup-0.1.0-Windows-x64.exe
- Hylix-Setup-0.1.0-Windows-x64.exe.sha256
- hylix-windows-app.png

Boundaries:
- This is a server-connected desktop client. The existing local Hylix server or a hosted HTTPS instance is required.
- The installer is unsigned; no company signing certificate was configured.
- The installer itself has not been installed on this PC or a clean Windows device. Runtime verification used its packaged win-unpacked/Hylix.exe.
- Browser cookies and desktop cookies remain separate. Native Google/Apple desktop OAuth handoff is not implemented.
- Local server automatic startup/cleanup has not been checked in a native end-to-end test; the verified session reused the already-running Hylix server.
- Owner catalog and credential files were not altered or included in the installer.


## Theme release0.2.0 — October 26, 2026

- Rebuilt the Windows installer after updating the connection-screen CSS, fonts and version metadata.
- Compared main.cjs, preload.cjs, policy.cjs and renderer.js in both shipped ASARs: all four function files are byte-identical.
- Installer integrity checked; no credentials, databases, keys or certificates included in the app archive.
- Web theme production build and all78 unit checks passed. The connected server supplies the updated viewer and Meta theme.
- This remains an unsigned server-connected preview; previous account/native OAuth limitations are unchanged.


## Standalone release 0.3.1

- Production web build passed with standalone output and no tracing warnings.
- 89 web tests and 8 desktop tests passed.
- Packaged Electron Node started the server from relocated files, without system Node or a source server.
- Isolated API smoke test passed: catalog, Meta login over loopback, image upload, immediate image GET, and persistence outside the application directory.
- Installer input: 9 public movies, zero owner/viewer accounts or sessions. Private-configuration scan passed for 8,613 files.
- Per-user installed version verified as 0.3.1.

- Actual installed-layout check caught omitted node_modules in 0.3.0; 0.3.1 explicitly maps both server dependency folders and adds an afterPack required-file check. The integration test now targets resources/server from win-unpacked, not the prepack staging folder.

- Corrected 0.3.1 win-unpacked resources/server passed the packaged Electron integration test: startup, catalog, Meta sign-in, immediate artwork upload/serving, and persistent storage.

- Installed 0.3.1 completed initialization and independently served the migrated catalog using its bundled Node runtime.
- Native desktop window opened automatically with all 10 movies. Movies navigation and Top Gun: Maverick details/close actions passed. Spotlight rotation remained active.
- Local source .env now points at the same migrated desktop SQLite database; original source DB and a private environment backup remain for rollback.

- Closing the native app stopped its owned local server (connection refused afterward). Reopening from the installed executable restarted Hylix automatically.


## Badge release 0.3.2

The Windows installer includes badge metadata, the shared lower-right badge renderer, and Meta → Badges. 95 web tests and 28 isolated API workflow checks passed. Meta save/remove UI and desktop/phone layouts were checked. The installed server files and host were updated with rollback copies, preserving the data directory and reusing the verified runtime. Private-configuration scan passed. REA static analysis of a public Netflix landing asset was partial (heap limit); it does not establish member badge internals.

## Startup release 0.3.3 — October 29, 2026

- Production Next build passed, including /api/health.
- 95 web tests passed (two temporary-file permission failures passed on a targeted rerun with normal file access).
- 18 desktop checks passed: URL restrictions, private migration persistence, direct installed runtime, readiness response validation, online distribution configuration, update consent/failure handling.
- Bundled Electron startup benchmark used a separate database and port 3004. First run: database ready 35.5s, homepage 37.6s. Second run: database ready 2.25s, homepage 2.64s. These exclude native window rendering; no native window startup time is claimed. Runtime validation took 59ms/2ms and copied no runtime files.
- NSIS installer built: 244,662,431 bytes. Packaged main/runtime/bootstrap/update modules match current source. Windows executable header and SHA-256 checked.
- The 0.3.3 installer is prepared, not installed over the user's current app during this task.
- Online installer/build workflow and download-site source are prepared, not deployed. GitHub update delivery has unit coverage but requires a real release and installed update test.
- Supabase private schema migration succeeded; all 19 tables have RLS and no anonymous/viewer schema access. No catalog or account migration has been performed.

- Cloud publication guard migration and its database workflow checks passed. Two publication triggers exist; validation left zero movies in the cloud database.

- Focused private-value scan passed for the packaged app.asar, public catalog.db and new health route. The broader repeated dependency scan was stopped after taking too long; it is not reported as passed for this release.

## Installed startup/profile follow-up — October 29, 2026
Updated the actual installed host and compiled server from 0.3.2 to 0.3.3 with rollback backups. Verified installed version, direct-runtime loading, health HTTP 200 and homepage HTTP 200. Native window reopened and displayed the catalog. Actual installed runtime test reached homepage in 31.8s with isolated fresh data; cold startup remains unresolved. Persistent data counts before/after: 11 movies, 2 accounts, 3 database profiles, 2 active sessions. Native Account UI is signed out and shows two device profiles (You, zyru), confirming the desktop uses its separate device/account session. Google desktop system-browser handoff remains unimplemented.

## Quick-reopen 0.3.4
Added a resident Windows tray and reuse of the loaded cinema window. Closing pauses local media and mutes the hidden renderer; explicit Quit still exits. No Windows-login startup setting is changed. All 21 desktop checks passed. Isolated route-preloading comparison: normal homepage 6.87s; lazy homepage 5.93s. That experiment was not shipped because it did not meet the one-second cold-start target. Native reopen verification is recorded separately after installing this host.

### Installed native quick-reopen verification — October 30, 2026
Confirmed installed 0.3.4. Loaded the catalog, closed the cinema window, and reopened through the installed executable three times. Each return reused native window 1051054 and displayed the catalog without a new splash window. Launch-request durations: 1197ms, 1247ms, 1458ms. Including the native-window inventory check: 1442ms, 1452ms, 1563ms. These are tool-observed warm reopen timings, not cold-start guarantees. Screenshot and JSON measurements are in outputs/hylix-quick-reopen.*. The one-second cold-start target remains unmet.
