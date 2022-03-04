DOCKERFILE_PATH=${DOCKERFILE_PATH:-"./"}

docker build -t chat-client:latest \
 --no-cache \
 --target=run \
  ${DOCKERFILE_PATH}