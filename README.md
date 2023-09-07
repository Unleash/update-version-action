# Update version action

Updates distribution versions in Bigquery.

## Inputs

### `distribution`

**Required** The distribution to set the version for.

- No Default
- Must be either 'oss' or 'enterprise'

### `version`

**Required** The version to set

- No default
- Must adhere to semver format (will be parsed by action, and errored if in wrong format)

## Example usage

Since we're assuming access to BigQuery, you should apply google-github-action/auth first.
Use a token with write access to metrics project - version dataset - version_metadata table

```yaml
uses: Unleash/update-version-action
with:
  distribution: enterprise
  version: ${{ github.release.name }}
```
