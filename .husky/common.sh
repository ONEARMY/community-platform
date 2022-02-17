# Common script to add support on windows
# https://typicode.github.io/husky/#/?id=yarn-on-windows
# https://github.com/commitizen/cz-cli/issues/627

command_exists () {
  command -v "$1" >/dev/null 2>&1
}

# Workaround for Windows 10, Git Bash and Yarn
if command_exists winpty && test -t 1; then
  exec < /dev/tty
fi