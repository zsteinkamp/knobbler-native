.DEFAULT_GOAL := start

GREP ?= $(shell command -v ggrep 2> /dev/null || command -v grep 2> /dev/null)
AWK  ?= $(shell command -v gawk 2> /dev/null || command -v awk 2> /dev/null)

help: ## Show makefile targets and their descriptions
	@$(GREP) --no-filename -E '^[ a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		$(AWK) 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-28s\033[0m %s\n", $$1, $$2}' | sort

start: ## Build and start the dev server
	npx expo run:ios --device ipad

pods: ## Install pods in iOS
	cd ios && pod install
