# Should I Run?

> Instant BART departures

## Development

1. Xcode etc
2. Product > Scheme > Edit Scheme, change to Debug

### Build for phone

1. Product > Scheme > Edit Scheme, change to Release

### iPhone release

1. Open (iTunes Connect)[https://itunesconnect.apple.com] and create the new version.
2. Change the version number in Targets -> General -> Identity to match what you put ^.
3. Make a binary by selecting 'generic device' and build archive.
4. When that completes, upload to app store and submit for review.

### Updating

??? There's a React Native command to update

### Code push

Codepush account: https://appcenter.ms/users/rgoldfinger/apps/BART-Check/distribute/code-push/Production
To see releases: `appcenter codepush deployment list -a rgoldfinger/BART-Check`.
Build new release for Production: `appcenter codepush release-react -a rgoldfinger/BART-Check -d Production -t [current xcode version, search for MARKETING_VERSION]`
