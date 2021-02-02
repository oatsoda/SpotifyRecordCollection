param(
	[Parameter(Mandatory=$true)]
    [string]
    $filePath,
    
	[Parameter(Mandatory=$true)]
    [string]
    $version
)

$packageJsonContent = (Get-Content $filePath | ConvertFrom-Json);
$packageJsonContent.version = $version;
ConvertTo-Json $packageJsonContent | Set-Content -Path $filePath 