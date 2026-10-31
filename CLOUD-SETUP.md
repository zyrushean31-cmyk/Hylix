# Hylix public deployment — current status

Target: Electron on Windows; GitHub Releases for installers and update manifests; Cloudflare Workers for the online app/API; Supabase for shared accounts/database; Cloudflare Pages for downloads.

The online service is not deployed. The existing web app still uses SQLite, Node password hashing, filesystem uploads and server-rendered routes. It cannot be uploaded unchanged to Workers. Complete the database, Supabase Auth, upload storage and Workers runtime adapters, preserving publication checks, before switching users to a public origin. Native Google/Apple sign-in also needs a system-browser handoff.

## Confirmed account
Supabase organization Hylix (Free), project xvelbbtbduhjpfqfcwzw, region eu-west-1, healthy. Public schema initially empty. On October 29, 2026, migration hylix_private_schema_foundation created 19 empty tables in private schema hylix_app. Verified RLS on all 19 and denied schema access for anon/authenticated. No private account data or secrets have been uploaded. The advisor reports expected no-policy notices for these inaccessible tables and two warnings for the pre-existing public.rls_auto_enable event-trigger function; its definition was inspected and it is not a normal RPC function.

## Public Windows build
Set HYLIX_PUBLIC_ORIGIN to the deployed HTTPS Hylix service and HYLIX_RELEASE_REPOSITORY to the actual GitHub owner/repository. Run npm run build:public. The command rejects localhost/placeholder addresses and checks /api/health. Public installers exclude the bundled server and catalog. The configured origin overrides old local connection settings.

The online app uses Hylix > Check for updates. It asks before downloading and before restarting. GitHub update delivery still needs a real release and end-to-end installed update testing. The local owner edition does not auto-update from this public channel.

## Release workflow
The .github/workflows/windows-release.yml file assumes this desktop folder is the repository root. Configure HYLIX_PUBLIC_ORIGIN as a repository variable. Run the workflow with publish=false first. Review the installer, update manifest and Pages website artifacts. publish=true creates a GitHub Release with the tested assets. No repository or public release has been created by these local files.

## Download website
Run node scripts/build-download-site.cjs with the same two environment variables. Upload download-site/dist to Cloudflare Pages after the first GitHub release exists. The download link uses the stable Hylix-Windows-x64.exe release asset.

## Free-plan boundaries
Cloudflare Workers Free currently limits requests and CPU, so benchmark real Hylix requests before launch. Supabase Free can pause inactive projects. This is a starting budget, not unlimited streaming capacity. Full movie video hosting is not included in this setup.

References: https://developers.cloudflare.com/workers/platform/limits/ and https://supabase.com/pricing

## Verified cloud publication rules
Migration hylix_publication_guards preserves local metadata, certification and editorial approval checks. A database workflow test verified missing-certification rejection, missing-approval rejection, valid publication, and rejection of certification changes while published. Test records were removed; the cloud catalog remains empty. GitHub is connected as zyrushean31-cmyk with no repositories yet. Repository source visibility awaits the owner’s preference.

The owner selected open source. The desktop source package includes MIT licensing. The GitHub connector cannot create repositories; browser creation failed twice because the webview did not attach. Create public repository hylix-desktop under zyrushean31-cmyk, initialized with a README, then use the connected GitHub tools to publish the reviewed source. No repository has been created yet.
