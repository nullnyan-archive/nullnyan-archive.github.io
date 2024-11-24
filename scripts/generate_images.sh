#!/usr/bin/env sh

main() {
  output='assets/js/images.js'
  echo 'var images = [' >"$output"
  find archives/images -type f -exec file --mime-type {} \; |
    sort |
    grep -F 'image/' |
    cut -d':' -f1 |
    sed 's/\(.*\)/  "\/\1",/' >>"$output"
  echo '];' >>"$output"
}

main "$@"
