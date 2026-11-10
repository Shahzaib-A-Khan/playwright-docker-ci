# Playwright Docker CI

![Playwright Docker CI](https://github.com/Shahzaib-A-Khan/playwright-docker-ci/actions/workflows/playwright-docker.yml/badge.svg)

Playwright and TypeScript tests for two practice sites (saucedemo.com and the-internet.herokuapp.com), run inside a Docker container and sharded across parallel GitHub Actions jobs, with a nightly schedule and one merged HTML report.

## What it shows
- **Docker:** the tests run in a container built from a Dockerfile, so they behave the same on my computer and in CI.
- **Sharding:** CI splits the 12 tests across 3 parallel jobs with Playwright's `--shard`.
- **Merged report:** each shard saves a blob report, and a final job merges them into one HTML report.
- **Nightly run:** a scheduled workflow runs every day at 06:00 UTC against the practice sites.

## Run it locally
docker build -t playwright-docker-ci .
docker run --rm -e CI=true playwright-docker-ci

## CI workflow
- Triggers: pushes and pull requests to main, a nightly schedule, and a manual run button
- Download the `html-report` artifact from a run to see all results in one place

## Notes
- With only 12 short tests, sharding does not make the run faster, because every shard spends most of its time building the image. It pays off on large suites, and a layer cache would shorten the build.
- Both targets are public practice sites, so scheduled runs are safe.

## Project structure
- `Dockerfile` : image used for local and CI runs
- `.dockerignore` : keeps node_modules and old reports out of the image
- `pages/` and `tests/` : page objects and test files
- `.github/workflows/playwright-docker.yml` : the CI workflow