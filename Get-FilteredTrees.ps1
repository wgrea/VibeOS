param([string]$ext = ".js")

function Show-Tree($Path = ".", $Indent = "") {
    $dirs = Get-ChildItem $Path -Directory | Sort-Object Name
    $files = Get-ChildItem $Path -File | Sort-Object Name

    $matched = @($files | Where-Object Extension -eq $ext)
    $hidden = @($files | Where-Object Extension -ne $ext)

    foreach ($f in $matched) {
        Write-Host "$Indent│   $($f.Name)"
    }

    if ($hidden.Count -gt 0) {
        $counts = $hidden | Group-Object { $_.Extension.TrimStart('.').ToUpper() } | ForEach-Object { "$($_.Count) $($_.Name)" }
        Write-Host "$Indent│   [... $($counts -join ', ') hidden]" -ForegroundColor DarkGray
    }

    if ($dirs.Count -gt 0 -and ($matched.Count -gt 0 -or $hidden.Count -gt 0)) {
        Write-Host "$Indent│"
    }

    for ($i = 0; $i -lt $dirs.Count; $i++) {
        $isLast = ($i -eq $dirs.Count - 1)
        $branch = if ($isLast) { "└───" } else { "├───" }
        $nextIndent = if ($isLast) { "$Indent    " } else { "$Indent│   " }

        Write-Host "$Indent$branch$($dirs[$i].Name)"
        Show-Tree $dirs[$i].FullName $nextIndent
    }
}

Write-Host "`n=== $($ext.ToUpper()) FILES ONLY ===" -ForegroundColor Cyan
Write-Host (Resolve-Path ".").Path
Show-Tree
