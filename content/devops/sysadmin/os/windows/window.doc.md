---
section: DevOps
subsection: SysAdmin
id: windows-commands-reference
pageUrl: https://lamhaison.github.io
pageLabel: Windows Commands Reference
tags: [windows, commands, reference, sysadmin, powershell, troubleshooting]
---

## Q: **[windows - commands - reference - troubleshooting] What are the essential Windows commands for system administration and troubleshooting?**

Comprehensive reference for Windows Command Prompt and PowerShell commands organized by category for system administration, diagnostics, and troubleshooting.

### System Information & Health

#### `systeminfo`
Display detailed system configuration and hardware information.

```powershell
systeminfo                                          # Show all system info
systeminfo | findstr /C:"OS Name"                  # Show Windows version
wmic os get caption                                 # Get Windows edition
wmic cpu get name                                   # Show CPU model
wmic cpu get NumberOfCores                          # Show CPU cores
wmic memorychip get capacity                        # Show RAM modules
Get-ComputerInfo                                    # PowerShell system info
```

#### `System File Checker (sfc)`
Scan and repair corrupted system files.

```powershell
sfc /scannow                                        # Scan and repair system files
sfc /verifyonly                                     # Scan without repair
sfc /scanfile=<filepath>                           # Scan specific file
```

#### `DISM (Deployment Image Servicing Management)`
Repair Windows component store and image health.

```powershell
DISM /Online /Cleanup-Image /CheckHealth           # Quick health check
DISM /Online /Cleanup-Image /ScanHealth            # Detailed scan
DISM /Online /Cleanup-Image /RestoreHealth         # Repair Windows components
DISM /Online /Cleanup-Image /StartComponentCleanup # Clean up old components
```

#### `chkdsk`
Check disk for errors and bad sectors.

```powershell
chkdsk C:                                           # Check disk (read-only)
chkdsk C: /F                                        # Fix errors on next boot
chkdsk C: /F /R                                     # Scan and repair bad sectors
chkdsk C: /V                                        # Verbose output
```

### Event Logs & Monitoring

#### `Event Logging Tools`
View and manage Windows Event Log channels.

```powershell
wevtutil el                                         # List all event log channels
wevtutil qe System /c:20 /f:text                   # Show last 20 system events
wevtutil cl System                                  # Clear System log
Get-EventLog -LogName System -Newest 50             # PowerShell: last 50 system logs
Get-WinEvent -LogName Security -MaxEvents 20       # PowerShell: security logs
Get-WinEvent -FilterHashtable @{LogName='System'; Level=2}  # Error events only
```

#### `Performance Counters`
Monitor real-time system performance metrics.

```powershell
Get-Counter '\Processor(_Total)\% Processor Time'  # CPU usage
Get-Counter '\Memory\Available MBytes'              # Available RAM
Get-Counter '\Memory\% Committed Bytes In Use'     # Memory utilization
Get-Counter '\Network Interface(*)\Bytes Total/sec' # Network throughput
Get-Counter '\LogicalDisk(C:)\% Disk Time'        # Disk usage
typeperf -cf counters.txt -o output.csv            # Log performance over time
```

### Process Management

#### `tasklist & taskkill`
View and terminate running processes.

```powershell
tasklist                                            # List running processes
tasklist /v                                         # Detailed process list
tasklist /v | findstr python                       # Find specific process
taskkill /PID 1234 /F                              # Kill by PID (force)
taskkill /IM notepad.exe /F                        # Kill by name
Get-Process                                         # PowerShell: list processes
Get-Process | Sort-Object CPU -Descending          # Top CPU consumers
Get-Process | Sort-Object WorkingSet -Descending   # Top RAM consumers
Stop-Process -Name notepad -Force                  # PowerShell: kill process
```

### Services Management

#### `sc (Service Control)`
Manage Windows services from command line.

```powershell
sc query                                            # List all services
sc query <service>                                  # Check specific service
sc start <service>                                  # Start service
sc stop <service>                                   # Stop service
sc config <service> start= auto                    # Auto-start on boot
sc config <service> start= demand                  # Manual start
sc config <service> start= disabled                # Disable service
sc delete <service>                                 # Delete service
sc query state= all                                # List all services (any state)
```

#### `PowerShell Service Cmdlets`
Manage services with PowerShell.

```powershell
Get-Service                                         # List all services
Get-Service -Name <service>                        # Get specific service
Start-Service -Name <service>                      # Start service
Stop-Service -Name <service>                       # Stop service
Restart-Service -Name <service>                    # Restart service
Set-Service -Name <service> -StartupType Automatic # Set auto-start
```

### Drivers Management

#### `Driver Query & Management`
List and manage installed drivers.

```powershell
driverquery                                         # List drivers
driverquery /v                                      # Detailed driver info
driverquery /si                                     # Driver signing info
pnputil /enum-drivers                              # List driver packages
pnputil /delete-driver oem12.inf /uninstall       # Remove driver package
Get-WmiObject Win32_SystemDriver                   # PowerShell: system drivers
```

### Networking

#### `ipconfig`
Display and configure network settings.

```powershell
ipconfig                                            # Show IP configuration
ipconfig /all                                       # Full network details
ipconfig /renew                                     # Renew DHCP lease
ipconfig /flushdns                                  # Clear DNS cache
ipconfig /registerdns                              # Register DNS with domain
ipconfig /release                                  # Release DHCP lease
Get-NetIPAddress                                    # PowerShell: IP addresses
Get-NetAdapter                                      # Show network adapters
```

#### `Connectivity Testing`
Test network connectivity and DNS resolution.

```powershell
ping hostname                                       # Test connectivity
ping 8.8.8.8                                        # Test internet connectivity
tracert hostname                                    # Trace network route
tracert -d hostname                                 # Trace (IP only)
nslookup hostname                                   # DNS lookup
nslookup -type=MX domain.com                       # Query MX records
Resolve-DnsName domain.com                          # PowerShell: DNS lookup
Get-NetDnsConfiguration                             # Show DNS settings
Test-NetConnection -ComputerName server -Port 443  # Test specific port
```

#### `netstat`
Display active network connections and listening ports.

```powershell
netstat -ano                                        # All connections with PID
netstat -ano | findstr :443                        # Check if port is listening
netstat -ab                                         # Show process names
netstat -an | findstr ESTABLISHED                  # Show established connections
Get-NetTCPConnection                                # PowerShell: TCP connections
Get-NetUDPEndpoint                                  # PowerShell: UDP endpoints
```

#### `Firewall Management`
Manage Windows Firewall rules.

```powershell
netsh advfirewall firewall show rule name=all      # Show all firewall rules
netsh advfirewall firewall add rule name="Allow80" protocol=tcp dir=in action=allow localport=80
netsh advfirewall firewall delete rule name="Allow80"  # Delete rule
netsh advfirewall set allprofiles state on         # Enable firewall
netsh advfirewall reset                             # Reset to defaults
Get-NetFirewallRule                                 # PowerShell: list rules
New-NetFirewallRule -DisplayName "Allow80" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 80
```

#### `Routing`
Configure network routing.

```powershell
route print                                         # Show routing table
route add 10.0.0.0 mask 255.255.255.0 10.0.1.1   # Add static route
route delete 10.0.0.0 mask 255.255.255.0           # Delete route
route -p add 10.0.0.0 mask 255.255.255.0 10.0.1.1 # Add persistent route
Get-NetRoute                                        # PowerShell: routing table
```

### Disk & Storage Management

#### `diskpart`
Partition and volume management tool.

```powershell
diskpart                                            # Open diskpart (then use below inside)
list disk                                           # List all disks
list volume                                         # List volumes
list partition                                      # List partitions
select disk 1                                       # Select disk
clean                                               # Wipe disk
create partition primary size=<MB>                 # Create partition
format fs=NTFS label="Data"                        # Format volume
assign letter=D                                     # Assign drive letter
```

#### `PowerShell Disk Cmdlets`
Manage disks and volumes with PowerShell.

```powershell
Get-Disk                                            # List disks
Get-Partition                                       # List partitions
Get-Volume                                          # List volumes
Resize-Partition -DriveLetter C -Size 100GB        # Resize partition
Format-Volume -DriveLetter E -FileSystem NTFS -Force  # Format volume
New-Partition -DiskNumber 1 -Size 50GB -DriveLetter F  # Create partition
```

### Users & Group Management

#### `Local User & Group Management`
Manage local accounts and groups.

```powershell
net user                                            # List local users
net user <username>                                 # Show user details
net user <username> <password> /add                # Create local user
net user <username> /delete                        # Delete local user
net localgroup                                      # List local groups
net localgroup Administrators                      # Show admin group members
net localgroup Administrators <username> /add      # Add user to admin group
net localgroup Administrators <username> /delete   # Remove from admin group
whoami                                              # Show current user
whoami /groups                                      # Show user groups
whoami /priv                                        # Show privileges
Get-LocalUser                                       # PowerShell: list users
Get-LocalGroup                                      # PowerShell: list groups
Add-LocalGroupMember -Group Administrators -Member <user>  # Add to group
```

### Registry Management

#### `Registry Editing`
Query and modify Windows Registry.

```powershell
reg query HKLM\Software                             # Query registry key
reg add HKLM\Software\Test /v Setting /t REG_SZ /d 123 /f  # Add value
reg delete HKLM\Software\Test /v Setting /f        # Delete value
reg export HKLM\Software software.reg              # Export registry
reg import software.reg                             # Import registry
reg load HKLM\Temp C:\path\to\hive                # Load hive file
reg unload HKLM\Temp                               # Unload hive
Get-ItemProperty "HKLM:\Software\Microsoft\Windows\CurrentVersion"  # PowerShell
Set-ItemProperty -Path "HKLM:\Software\Test" -Name "Setting" -Value "123"
Remove-Item -Path "HKLM:\Software\Test" -Recurse  # Delete registry key
```

### Boot & Shutdown

#### `Boot Configuration`
Manage boot options and safe mode.

```powershell
bcdedit                                             # Show boot configuration
bcdedit /set {default} safeboot minimal            # Boot to Safe Mode
bcdedit /set {default} safeboot network            # Safe Mode with Networking
bcdedit /deletevalue {default} safeboot            # Remove Safe Mode
bcdedit /set {default} numproc 4                   # Set number of cores
```

#### `Shutdown & Restart`
Schedule or execute system shutdown/restart.

```powershell
shutdown /r /t 0                                    # Restart immediately
shutdown /s /t 0                                    # Shutdown immediately
shutdown /s /t 300                                  # Shutdown after 300 seconds
shutdown /a                                         # Abort shutdown/restart
shutdown /h                                         # Hibernate
shutdown /g /t 0                                    # Restart and restart apps
```

### Active Directory & Networking

#### `Domain Controller Commands`
Active Directory and domain diagnostics.

```powershell
nltest /dsgetdc:domain.local                       # Discover domain controller
nltest /dclist:domain.local                        # List DCs in domain
nltest /sc_verify:domain.local                     # Verify secure channel
nltest /sc_reset:domain.local                      # Reset secure channel
Get-ADDomain                                        # PowerShell: domain info
Get-ADForest                                        # PowerShell: forest info
Get-ADDomainController -Filter *                   # List all DCs
Get-ADDomainController -Discover                   # Find nearest DC
```

#### `Active Directory Objects`
Query and manage AD objects.

```powershell
Get-ADUser <username> -Properties *                # Get user properties
Get-ADComputer <computername> -Properties *        # Get computer properties
Get-ADObject -LDAPFilter "(objectClass=computer)"  # LDAP query
Move-ADObject -Identity "CN=VM01,OU=Computers,DC=domain,DC=local" -TargetPath "OU=Servers,DC=domain,DC=local"  # Move to OU
```

#### `Replication & Diagnostics`
Check Active Directory replication health.

```powershell
repadmin /replsummary                              # Replication summary
repadmin /showrepl                                  # Detailed replication status
repadmin /syncall /AeD                             # Force full replication
dcdiag /v                                           # Full DC diagnostics
dcdiag /test:sysvolcheck                           # Check SYSVOL health
dcdiag /test:advertising                           # Check DC advertising status
```

### DNS Management

#### `DNS Resolution`
Query and troubleshoot DNS.

```powershell
nslookup <hostname>                                 # DNS lookup
nslookup -type=A domain.com                        # Query A record
nslookup -type=MX domain.com                       # Query MX record
nslookup -type=SRV _ldap._tcp.domain.local        # Query SRV record
Resolve-DnsName domain.com                          # PowerShell: DNS lookup
Resolve-DnsName -Type MX domain.com                # Query MX records
Resolve-DnsName -Type SRV _kerberos._tcp.domain.local  # Query SRV records
Test-NetConnection -ComputerName dc01 -Port 53    # Test DNS port
```

#### `DNS Server Management`
Manage DNS zones and records (on DNS servers).

```powershell
Get-DnsServer                                       # Show DNS server info
Get-DnsServerZone                                   # List DNS zones
Get-DnsServerResourceRecord -ZoneName domain.local # List DNS records
Add-DnsServerResourceRecordA -Name "server1" -ZoneName domain.local -IPv4Address 10.0.1.10  # Add A record
Remove-DnsServerResourceRecord -ZoneName domain.local -RRType A -Name "server1" -Force  # Delete A record
dnscmd /enumzones                                   # List zones (legacy)
dnscmd /zoneinfo domain.local                      # Zone information
dnscmd /clearcache                                  # Clear server cache
```

### Hyper-V Management

#### `Virtual Machine Management`
Manage Hyper-V virtual machines.

```powershell
Get-VM                                              # List all VMs
Get-VM -Name "VM01"                                # Get specific VM
Start-VM -Name "VM01"                              # Start VM
Stop-VM -Name "VM01"                               # Stop VM (graceful)
Stop-VM -Name "VM01" -Force                        # Force stop VM
Restart-VM -Name "VM01"                            # Restart VM
Get-VMNetworkAdapter -VMName "VM01"                # Show VM network adapters
Get-VMSnapshot -VMName "VM01"                      # List snapshots
Checkpoint-VM -Name "VM01"                         # Create snapshot
Restore-VMSnapshot -VMName "VM01" -Name "Snap1"   # Restore snapshot
```

### IIS (Internet Information Services)

#### `IIS Management`
Install and configure Internet Information Services.

```powershell
Get-WindowsFeature Web-Server                      # Check if IIS is installed
Install-WindowsFeature Web-Server -IncludeManagementTools  # Install IIS
Remove-WindowsFeature Web-Server                   # Uninstall IIS
Get-IISSite                                         # List IIS sites
Get-IISSite -Name "Default Web Site"              # Get site details
New-IISSite -Name "MySite" -BindingInformation "*:80:" -PhysicalPath "C:\inetpub\mysite"
Remove-IISSite -Name "MySite"                      # Delete IIS site
Start-IISSite -Name "MySite"                       # Start site
Stop-IISSite -Name "MySite"                        # Stop site
iisreset                                            # Restart IIS service
iisreset /stop                                      # Stop IIS
iisreset /start                                     # Start IIS
```

#### `App Pool Management`
Manage IIS application pools.

```powershell
Get-IISAppPool                                      # List app pools
Get-IISAppPool -Name "DefaultAppPool"              # Get pool details
New-IISAppPool -Name "MyPool"                      # Create app pool
Remove-IISAppPool -Name "MyPool"                   # Delete app pool
Start-IISAppPool -Name "DefaultAppPool"            # Start app pool
Stop-IISAppPool -Name "DefaultAppPool"             # Stop app pool
Restart-WebAppPool -Name "DefaultAppPool"          # Restart app pool
Get-WebAppPoolState -Name "DefaultAppPool"        # Check app pool state
```

#### `IIS Authentication & Bindings`
Configure IIS authentication and SSL/TLS bindings.

```powershell
Get-WebConfigurationProperty -Filter /system.webServer/security/authentication -PSPath IIS:\
Set-WebConfigurationProperty -Filter /system.webServer/security/authentication/windowsAuthentication -Name enabled -Value True -PSPath IIS:\
Get-WebBinding -Name "Default Web Site"            # Show current bindings
New-WebBinding -Name "Default Web Site" -Protocol "https" -Port 443 -HostHeader domain.com
Get-WebCertificate -Name "Default Web Site"       # Show certificate
```
azure_adds_adv_admin_window.cmd.ps1:Get-ADForest  # Show forest details
azure_adds_adv_admin_window.cmd.ps1:Get-ADDomainController -Filter *  # List all domain controllers
azure_adds_adv_admin_window.cmd.ps1:Get-ADDomainController -Discover  # Find nearest DC
