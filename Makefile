.PHONY: help lint check format build ci

help:
	@echo "Available targets:"
	@echo "  make lint    - Run frontend lint"
	@echo "  make check   - Run frontend format check"
	@echo "  make format  - Format frontend files"
	@echo "  make build   - Build frontend assets"
	@echo "  make ci      - Run lint, check, and build"

lint:
	pnpm run lint

check:
	pnpm run check

format:
	pnpm run format

build:
	pnpm run build

ci: lint check build
