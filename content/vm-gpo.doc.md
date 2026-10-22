---
section: Azure
id: vm-gpo
pageUrl: https://lamhaison.github.io
pageLabel: Administrator RDP GPO
tags: [gpo, group-policy, admin, rdp, windows, active-directory]
---

## Q: **[gpo - admin - rdp] How to grant local Administrator rights centrally via GPO?**

`configure-admin-gpo.ps1` mirrors `configure-rdp-gpo.ps1`, but targets the local `Administrators` group (SID `S-1-5-32-544`) instead of `Remote Desktop Users` (SID `S-1-5-32-555`). Run it on the DC, then grant access domain-wide via one AD group instead of editing local groups per VM:

```powershell
# On the DC
.\configure-admin-gpo.ps1
Add-ADGroupMember -Identity "Domain-Admins" -Members "username"
```

⚠️ Members of `Domain-Admins` get full local admin rights on every computer the GPO applies to (domain root by default) — scope the GPO link to a specific OU if that's too broad.

To verify on the target VM:

```powershell
gpupdate /force
Get-LocalGroupMember -Group "Administrators"   # should list DOMAIN\Domain-Admins
gpresult /r                                    # confirm "Allow Local Admin Access via Group Policy" is in Applied GPOs
whoami /groups | findstr "Administrators"      # confirm the logged-in user has admin rights
```