# Auth.md

This site is a public portfolio. It provides one public, read-only Site
Metadata API at `https://przemekmiros.pl/api/site.json`. The endpoint does not
require or accept credentials. Its OpenAPI description is available at
`https://przemekmiros.pl/openapi.json`.

The site does not provide an OAuth/OIDC authorization server, protected
resource, MCP server, or agent account-registration service. No credentials or
agent registration are required or accepted.

OAuth Protected Resource Metadata is published at
`https://przemekmiros.pl/.well-known/oauth-protected-resource`. It declares
that no Bearer token presentation methods are supported and that authorization
is not required. Its absent `authorization_servers` field binds this site to
no OAuth issuer.

Personal Agent Protocol (Poppy) discovery is published at
`https://przemekmiros.pl/.well-known/poppy.json`. The Poppy 0.4 manifest
advertises the public OpenAPI description and ordinary signed-out web access.
It intentionally has no `auth` section because the site offers no sign-in.

AI service discovery metadata is published at
`https://przemekmiros.pl/.well-known/ard.json` and
`https://przemekmiros.pl/.well-known/ai-catalog.json`. They advertise the
public OpenAPI description and browser-local WebMCP tools. The catalog's
availability extension explicitly declares `mcpServer: false` and
`a2aAgent: false`.

The website exposes browser-local WebMCP tools. The read-only
`get_site_information` tool is available on every page. The contact page also
exposes `prepare_contact_message`, which can fill the contact form but cannot
submit it without explicit user review and confirmation. WebMCP tools do not
require authentication.

For human enquiries, use the [contact page](https://przemekmiros.pl/kontakt/).
