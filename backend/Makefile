LAMBDA_FN_NAME=cafe-crawl-backend
TARGET_DIR=./target/lambda/release
BIN_NAME=bootstrap
ZIP_NAME=bootstrap.zip
PASSWORD=password
JWT_SECRET=secret

.PHONY: build
build:
	cargo build --release --target x86_64-unknown-linux-musl
	rm -rf $(TARGET_DIR)
	mkdir -p $(TARGET_DIR)
	cp ./target/x86_64-unknown-linux-musl/release/$(BIN_NAME) ./bootstrap
	zip $(ZIP_NAME) bootstrap
	rm bootstrap
	mv $(ZIP_NAME) $(TARGET_DIR)

.PHONY: run
run:
	unzip -o \
		$(TARGET_DIR)/$(ZIP_NAME) \
		-d /tmp/lambda
	docker run \
		-i -e DOCKER_LAMBDA_STAY_OPEN=1 \
		-e PASSWORD_HASH=$(shell echo -n $(PASSWORD) | sha256sum | awk '{ print $$1 }') \
		-e JWT_SECRET=$(JWT_SECRET) \
		-p 9001:9001 \
		--rm \
		-v /tmp/lambda:/var/task \
		lambci/lambda:provided

.PHONY: publish
publish:
	aws lambda update-function-code \
		--function-name $(LAMBDA_FN_NAME) \
		--zip-file fileb://$(TARGET_DIR)/$(ZIP_NAME)
