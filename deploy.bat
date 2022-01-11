@echo off

cd dist

git init
git add -A
git commit -m 'deploy'

git push -f https://gitee.com/ironV/owavg.git master:pages
git push -f https://github.com/xcr1234/owavg.git master:gh-pages
