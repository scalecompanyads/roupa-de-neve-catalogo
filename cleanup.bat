git rm --cached catalogo_temp.html copy_html.js push.bat 2>nul
del catalogo_temp.html copy_html.js push.bat
git add -A
git commit -m "cleanup temp files"
git push
