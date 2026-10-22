---
section: Azure
id: login-with-azure-cli
pageUrl: https://lamhaison.github.io
pageLabel: Azure CLI Documentation
tags: [azure-cli, login, powershell, authentication]
---

## Q: **[azure-cli - login] How to login with Azure CLI?**

To login to Azure using Azure CLI and run PowerShell commands:

```powershell
Connect-AzAccount -DeviceCode
Get-AzSubscription
Set-AzContext -Subscription "azure-practicing"
Get-AzContext
Get-AzVM -Status
```

This will authenticate you to Azure and allow you to manage your Azure resources.
