# Targets follow README.md: run locally, rebuild the index, publish.

PORT ?= 3000

.PHONY: help serve build check publish serve_with_build

# Default target
.DEFAULT_GOAL := serve_with_build

# GNU make treats a leading --flag as its own option, so pass deploy flags
# after --: make publish -- --force
ifeq ($(firstword $(MAKECMDGOALS)),publish)
  PUBLISH_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  ifneq ($(PUBLISH_ARGS),)
    $(eval $(PUBLISH_ARGS):;@:)
  endif
endif

help:
	@echo "serve_with_build (default) build then serve on http://127.0.0.1:$(PORT)/"
	@echo "serve        python3 -m http.server $(PORT)    (open http://127.0.0.1:$(PORT)/)"
	@echo "build        refresh content/*.doc.md to data/questions.json"
	@echo "check        node scripts/check-search.mjs"
	@echo "publish      git switch main && ./scripts/deploy-pages.sh"
	@echo "             make publish -- --force     republish the current main commit"

serve:
	python3 -m http.server $(PORT)

build:
	node scripts/build-questions.mjs
	node scripts/check-search.mjs

serve_with_build:
	$(MAKE) build
	$(MAKE) serve

check:
	node scripts/check-search.mjs

publish:
	git switch main
	./scripts/deploy-pages.sh $(PUBLISH_ARGS)