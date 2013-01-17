blog:
  git pull && \
  rake setup_github_pages\[git@github.com:s0ngyee/s0ngyee.github.git\] && \
  bundle install && \
  rake integrate && \
  rake generate && \
  rake deploy && \
  git add .; \
  git commit -am "${MSG}"; \
  git push origin master
.PHONY: blog%
