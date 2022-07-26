# BROKEN-LINK-CHECKER-ACTION
Github Action which checks for broken links, can easily integrate with your pipeline. If multiple urls provided, separate with coma as shown on the example.

## Example
    steps:
      - name: Get Action
        uses: actions/checkout@v3
        with:
          repository: Dawid-Oskwarek/broken-link-checker-action
          ref: main
          token: ${{ secrets.TOKEN }}
          path: ./
      - name: Check for Broken Links
        uses: ./
        with:
          urlsToCheck: 'https://api.contrastscantest.com, https://api.contrastscantest.com/scan/v1'
          excludedUrls: 'https://support.contrastsecurity.com/hc/en-us, https://api.contrastscantest.com/docs/scan/v1/spec.yaml'
