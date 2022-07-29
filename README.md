# BROKEN-LINK-CHECKER-ACTION
Github Action which checks for broken links, can easily integrate with your pipeline. If multiple urls provided, separate with coma as shown on the example.

## Example
    steps:
      - name: Check for Broken Links
        uses: Dawid-Oskwarek/broken-link-checker-action@main
        with:
          urlsToCheck: 'https://api.contrastscantest.com, https://api.contrastscantest.com/scan/v1'
          excludedUrls: 'https://support.contrastsecurity.com/hc/en-us, https://api.contrastscantest.com/docs/scan/v1/spec.yaml'
          token: ${{ secrets.GITHUB_TOKEN }}
