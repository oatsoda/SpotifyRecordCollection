param(
	[Parameter(Mandatory=$true)]
    [string]
    $filePath,
    
	[Parameter(Mandatory=$true)]
    [string]
    $version
)

$packageJsonContent = (Get-Content $path | ConvertFrom-Json);
$packageJsonContent.version = $version;
ConvertTo-Json $packageJsonContent | Set-Content -Path $path 