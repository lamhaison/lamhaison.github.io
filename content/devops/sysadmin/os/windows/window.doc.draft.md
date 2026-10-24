---
sections: [Windows, DevOps]
subsections: []
id: windows-commands-reference
pageUrl: https://lamhaison.github.io
pageLabel: Windows Commands Reference
tags: [draft, windows, commands, reference, sysadmin, powershell, troubleshooting]
---

## Q: **[] How to collect basic Windows host information?**

```powershell
hostname
systeminfo
wmic os get caption
wmic cpu get name
wmic memorychip get capacity
whoami
```

## Q: **[] How to troubleshoot DNS issues on Windows or Active Directory?**

```powershell
ipconfig /all
ipconfig /flushdns
ipconfig /registerdns

nslookup hostname
nslookup -type=SRV _ldap._tcp.domain.local

Resolve-DnsName domain.local

Get-DnsServerZone

Get-DnsServerResourceRecord
```

## Q: **[] How to debug Active Directory authentication issues?**

```powershell
klist
klist purge

nltest /sc_verify

Test-ComputerSecureChannel

Get-ADUser
```

## Q: **[] How to diagnose Active Directory replication problems?**

```powershell
repadmin /replsummary

repadmin /showrepl

dcdiag /v

Get-ADReplicationFailure
```

## Q: **[] How to troubleshoot RDP connectivity issues?**

```powershell
Test-NetConnection hostname -Port 3389

query session

qwinsta

Get-Service TermService

Get-NetFirewallRule
```

## Q: **[] How to manage Windows Services?**

```powershell
sc query

sc start

sc stop

Get-Service

Restart-Service
```

## Q: **[] How to inspect Windows Event Logs?**

```powershell
wevtutil qe System
Get-EventLog
Get-WinEvent
```

## Q: **[] How to diagnose network connectivity?**

```powershell
ping

tracert

netstat

Test-NetConnection

route print
```


## Q: **[] How to manage local users and groups?**

```powershell
net user

net localgroup

New-LocalUser

Add-LocalGroupMember
```

## Q: **[] How to manage Group Policy Objects (GPO)?**

```powershell
Get-GPO

New-GPO

New-GPLink

gpupdate

gpresult
```