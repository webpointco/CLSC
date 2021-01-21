$loc = "D:\wamp64\www"
#Remove-Item -path $loc -recurse
#node build.js
#New-Item -ItemType directory -Path $loc
Get-ChildItem -Path src | Copy-Item -Destination $loc -Recurse