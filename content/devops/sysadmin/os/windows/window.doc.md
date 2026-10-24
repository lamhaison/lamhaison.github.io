---
sections: [SYSADMIN, SysAdmin-Windows, DevOps]
subsections: [SysAdmin-Windows]
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


## Q: **[windows - powershell - commands - reference - administration] What are the essential Windows PowerShell and command-line tools for system administration?**

```powershell
azure_ad.cmd.ps1:nltest /dsgetdc:lab.example.com # Get the domain controller for the specified domain (lab.example.com) using nltest command.
azure_ad.cmd.ps1:wmic computersystem get domain, name, username, status # Get the domain, computer name, username, and status of the computer system using WMIC command.
azure_adds_adv_admin_window.cmd.ps1:sfc /scannow  # Scan and repair system files
azure_adds_adv_admin_window.cmd.ps1:DISM /Online /Cleanup-Image /RestoreHealth  # Repair Windows component store
azure_adds_adv_admin_window.cmd.ps1:DISM /Online /Cleanup-Image /ScanHealth  # Check Windows image health
azure_adds_adv_admin_window.cmd.ps1:DISM /Online /Cleanup-Image /CheckHealth  # Quick health check
azure_adds_adv_admin_window.cmd.ps1:chkdsk C: /F /R  # Check disk for errors and bad sectors
azure_adds_adv_admin_window.cmd.ps1:wevtutil qe System /c:20 /f:text  # Show last 20 system event logs
azure_adds_adv_admin_window.cmd.ps1:wevtutil el  # List all event log channels
azure_adds_adv_admin_window.cmd.ps1:Get-EventLog -LogName System -Newest 50  # Show latest 50 system logs (PowerShell)
azure_adds_adv_admin_window.cmd.ps1:Get-WinEvent -LogName Security -MaxEvents 20  # Show latest security logs
azure_adds_adv_admin_window.cmd.ps1:tasklist /v  # Detailed process list
azure_adds_adv_admin_window.cmd.ps1:taskkill /PID 1234 /F  # Kill process by PID
azure_adds_adv_admin_window.cmd.ps1:Get-Process  # List processes (PowerShell)
azure_adds_adv_admin_window.cmd.ps1:Get-Process | Sort CPU -Descending  # Top CPU usage
azure_adds_adv_admin_window.cmd.ps1:Get-Process | Sort WorkingSet -Descending  # Top RAM usage
azure_adds_adv_admin_window.cmd.ps1:Get-Counter '\Processor(_Total)\% Processor Time'  # Live CPU counter
azure_adds_adv_admin_window.cmd.ps1:Get-Counter '\Memory\Available MBytes'  # Available RAM
azure_adds_adv_admin_window.cmd.ps1:Get-Counter '\Network Interface(*)\Bytes Total/sec'  # Network throughput
azure_adds_adv_admin_window.cmd.ps1:sc query  # Show service status
azure_adds_adv_admin_window.cmd.ps1:sc start <service>  # Start service
azure_adds_adv_admin_window.cmd.ps1:sc stop <service>  # Stop service
azure_adds_adv_admin_window.cmd.ps1:sc config <service> start= auto  # Set service to auto-start
azure_adds_adv_admin_window.cmd.ps1:Get-Service  # List services (PowerShell)
azure_adds_adv_admin_window.cmd.ps1:Restart-Service <service>  # Restart service
azure_adds_adv_admin_window.cmd.ps1:driverquery  # List installed drivers
azure_adds_adv_admin_window.cmd.ps1:driverquery /v  # Detailed driver info
azure_adds_adv_admin_window.cmd.ps1:pnputil /enum-drivers  # List driver packages
azure_adds_adv_admin_window.cmd.ps1:pnputil /delete-driver oem12.inf /force  # Remove driver package
azure_adds_adv_admin_window.cmd.ps1:whoami /groups  # Show user group memberships
azure_adds_adv_admin_window.cmd.ps1:whoami /priv  # Show user privileges
azure_adds_adv_admin_window.cmd.ps1:net accounts  # Show password policy
azure_adds_adv_admin_window.cmd.ps1:auditpol /get /category:*  # Show audit policy
azure_adds_adv_admin_window.cmd.ps1:auditpol /set /subcategory:"Logon" /success:enable /failure:enable  # Enable logon auditing
azure_adds_adv_admin_window.cmd.ps1:klist  # Show Kerberos tickets
azure_adds_adv_admin_window.cmd.ps1:klist purge  # Clear Kerberos tickets
azure_adds_adv_admin_window.cmd.ps1:netstat -ano  # Show all network connections
azure_adds_adv_admin_window.cmd.ps1:netstat -ano | findstr :443  # Check if port 443 is listening
azure_adds_adv_admin_window.cmd.ps1:Get-NetTCPConnection  # List TCP connections (PowerShell)
azure_adds_adv_admin_window.cmd.ps1:Get-NetAdapter  # Show network adapters
azure_adds_adv_admin_window.cmd.ps1:Get-NetIPAddress  # Show IP configuration
azure_adds_adv_admin_window.cmd.ps1:Get-NetRoute  # Show routing table
azure_adds_adv_admin_window.cmd.ps1:route print  # Print routing table (CMD)
azure_adds_adv_admin_window.cmd.ps1:route add 10.0.0.0 mask 255.255.255.0 10.0.1.1  # Add static route
azure_adds_adv_admin_window.cmd.ps1:netsh interface ip show config  # Show NIC config
azure_adds_adv_admin_window.cmd.ps1:netsh advfirewall firewall show rule name=all  # Show all firewall rules
azure_adds_adv_admin_window.cmd.ps1:netsh advfirewall reset  # Reset firewall to default
azure_adds_adv_admin_window.cmd.ps1:diskpart  # Open disk partition tool
azure_adds_adv_admin_window.cmd.ps1:list disk  # List disks (inside diskpart)
azure_adds_adv_admin_window.cmd.ps1:list volume  # List volumes (inside diskpart)
azure_adds_adv_admin_window.cmd.ps1:select disk 1  # Select disk (inside diskpart)
azure_adds_adv_admin_window.cmd.ps1:clean  # Wipe disk (inside diskpart)
azure_adds_adv_admin_window.cmd.ps1:Get-Disk  # List disks (PowerShell)
azure_adds_adv_admin_window.cmd.ps1:Get-Partition  # List partitions
azure_adds_adv_admin_window.cmd.ps1:Get-Volume  # List volumes
azure_adds_adv_admin_window.cmd.ps1:Resize-Partition -DriveLetter C -Size 100GB  # Resize partition
azure_adds_adv_admin_window.cmd.ps1:Format-Volume -DriveLetter E -FileSystem NTFS -Force  # Format volume
azure_adds_adv_admin_window.cmd.ps1:reg query HKLM\Software  # Query registry
azure_adds_adv_admin_window.cmd.ps1:reg add HKLM\Software\Test /v Setting /t REG_SZ /d 123 /f  # Add registry value
azure_adds_adv_admin_window.cmd.ps1:reg delete HKLM\Software\Test /v Setting /f  # Delete registry value
azure_adds_adv_admin_window.cmd.ps1:Get-ItemProperty "HKLM:\Software\Microsoft\Windows\CurrentVersion"  # Read registry (PowerShell)
azure_adds_adv_admin_window.cmd.ps1:Set-ItemProperty -Path "HKLM:\Software\Test" -Name "Setting" -Value "123"  # Write registry
azure_adds_adv_admin_window.cmd.ps1:Remove-Item -Path "HKLM:\Software\Test" -Recurse  # Delete registry key
azure_adds_adv_admin_window.cmd.ps1:bcdedit  # Show boot configuration
azure_adds_adv_admin_window.cmd.ps1:bcdedit /set {default} safeboot minimal  # Boot into Safe Mode
azure_adds_adv_admin_window.cmd.ps1:bcdedit /deletevalue {default} safeboot  # Remove Safe Mode
azure_adds_adv_admin_window.cmd.ps1:shutdown /r /t 0  # Restart immediately
azure_adds_adv_admin_window.cmd.ps1:shutdown /s /t 0  # Shutdown immediately
azure_adds_adv_admin_window.cmd.ps1:shutdown /a  # Abort shutdown
azure_adds_adv_admin_window.cmd.ps1:powercfg /batteryreport /output C:\battery.html  # Battery diagnostics
azure_adds_adv_admin_window.cmd.ps1:powercfg /energy  # Generate energy report
azure_adds_adv_admin_window.cmd.ps1:Get-VM  # List VMs
azure_adds_adv_admin_window.cmd.ps1:Start-VM -Name "VM01"  # Start VM
azure_adds_adv_admin_window.cmd.ps1:Stop-VM -Name "VM01"  # Stop VM
azure_adds_adv_admin_window.cmd.ps1:Restart-VM -Name "VM01"  # Restart VM
azure_adds_adv_admin_window.cmd.ps1:Get-VMNetworkAdapter -VMName "VM01"  # Show VM NICs
azure_adds_adv_admin_window.cmd.ps1:Get-VMSnapshot -VMName "VM01"  # List VM snapshots
azure_adds_adv_admin_window.cmd.ps1:Checkpoint-VM -Name "VM01"  # Create snapshot
azure_adds_adv_admin_window.cmd.ps1:Restore-VMSnapshot -VMName "VM01" -Name "Snap1"  # Restore snapshot
azure_adds_adv_admin_window.cmd.ps1:Get-ADReplicationFailure -Target DC01  # Check replication failures
azure_adds_adv_admin_window.cmd.ps1:Get-ADDomainController -Filter *  # List all DCs
azure_adds_adv_admin_window.cmd.ps1:Get-ADForest  # Show forest info
azure_adds_adv_admin_window.cmd.ps1:Get-ADObject -LDAPFilter "(objectClass=computer)"  # Raw LDAP query
azure_adds_adv_admin_window.cmd.ps1:repadmin /replsummary  # Replication summary
azure_adds_adv_admin_window.cmd.ps1:repadmin /showrepl  # Detailed replication
azure_adds_adv_admin_window.cmd.ps1:dcdiag /v  # Full domain controller diagnostics
azure_adds_adv_admin_window.cmd.ps1:dcdiag /test:sysvolcheck  # Check SYSVOL health
azure_adds_adv_admin_window.cmd.ps1:Get-ADDomain  # Show domain details
azure_adds_adv_admin_window.cmd.ps1:Get-ADForest  # Show forest details
azure_adds_adv_admin_window.cmd.ps1:Get-ADDomainController -Filter *  # List all domain controllers
azure_adds_adv_admin_window.cmd.ps1:Get-ADDomainController -Discover  # Find nearest DC
azure_adds_adv_admin_window.cmd.ps1:Get-ADReplicationFailure -Target DC01  # Check replication failures
azure_adds_adv_admin_window.cmd.ps1:Get-ADReplicationPartnerMetadata -Target DC01  # Show replication metadata
azure_adds_adv_admin_window.cmd.ps1:repadmin /replsummary  # Replication summary
azure_adds_adv_admin_window.cmd.ps1:repadmin /showrepl  # Detailed replication status
azure_adds_adv_admin_window.cmd.ps1:repadmin /syncall /AeD  # Force full replication
azure_adds_adv_admin_window.cmd.ps1:dcdiag /v  # Full domain controller diagnostics
azure_adds_adv_admin_window.cmd.ps1:dcdiag /test:sysvolcheck  # Check SYSVOL health
azure_adds_adv_admin_window.cmd.ps1:dcdiag /test:advertising  # Check DC advertising status
azure_adds_adv_admin_window.cmd.ps1:nltest /dsgetdc:domain.local  # Discover domain controller
azure_adds_adv_admin_window.cmd.ps1:nltest /dclist:domain.local  # List DCs in domain
azure_adds_adv_admin_window.cmd.ps1:nltest /sc_verify:domain.local  # Verify secure channel
azure_adds_adv_admin_window.cmd.ps1:nltest /sc_reset:domain.local  # Reset secure channel
azure_adds_adv_admin_window.cmd.ps1:Get-ADObject -LDAPFilter "(objectClass=computer)"  # Raw LDAP query
azure_adds_adv_admin_window.cmd.ps1:Get-ADUser username -Properties *  # Inspect user attributes
azure_adds_adv_admin_window.cmd.ps1:Get-ADComputer VM01 -Properties *  # Inspect computer attributes
azure_adds_adv_admin_window.cmd.ps1:Move-ADObject -Identity "CN=VM01,OU=Computers,DC=domain,DC=local" -TargetPath "OU=Servers,DC=domain,DC=local"  # Move computer to OU
azure_adds_adv_admin_window.cmd.ps1:Get-DnsServer  # Show DNS server info
azure_adds_adv_admin_window.cmd.ps1:Get-DnsServerZone  # List DNS zones
azure_adds_adv_admin_window.cmd.ps1:Get-DnsServerResourceRecord -ZoneName domain.local  # List DNS records
azure_adds_adv_admin_window.cmd.ps1:Add-DnsServerResourceRecordA -Name "server1" -ZoneName domain.local -IPv4Address 10.0.1.10  # Add A record
azure_adds_adv_admin_window.cmd.ps1:Remove-DnsServerResourceRecord -ZoneName domain.local -RRType A -Name "server1" -Force  # Delete A record
azure_adds_adv_admin_window.cmd.ps1:Add-DnsServerResourceRecordCName -Name "www" -HostNameAlias "server1.domain.local" -ZoneName domain.local  # Add CNAME
azure_adds_adv_admin_window.cmd.ps1:Resolve-DnsName domain.local  # Resolve DNS name
azure_adds_adv_admin_window.cmd.ps1:Resolve-DnsName -Type SRV _ldap._tcp.domain.local  # Check LDAP SRV record
azure_adds_adv_admin_window.cmd.ps1:Resolve-DnsName -Type SRV _kerberos._tcp.domain.local  # Check Kerberos SRV record
azure_adds_adv_admin_window.cmd.ps1:Test-NetConnection -ComputerName DC01 -Port 53  # Test DNS port
azure_adds_adv_admin_window.cmd.ps1:dnscmd /enumzones  # List zones (legacy tool)
azure_adds_adv_admin_window.cmd.ps1:dnscmd /zoneinfo domain.local  # Show zone info
azure_adds_adv_admin_window.cmd.ps1:dnscmd /enumrecords domain.local @  # List all records
azure_adds_adv_admin_window.cmd.ps1:dnscmd /clearcache  # Clear DNS server cache
azure_adds_adv_admin_window.cmd.ps1:ipconfig /flushdns  # Clear client DNS cache
azure_adds_adv_admin_window.cmd.ps1:ipconfig /registerdns  # Register DNS record
azure_adds_adv_admin_window.cmd.ps1:Get-WindowsFeature Web-Server  # Check if IIS is installed
azure_adds_adv_admin_window.cmd.ps1:Install-WindowsFeature Web-Server -IncludeManagementTools  # Install IIS
azure_adds_adv_admin_window.cmd.ps1:Remove-WindowsFeature Web-Server  # Uninstall IIS
azure_adds_adv_admin_window.cmd.ps1:Get-IISSite  # List IIS sites
azure_adds_adv_admin_window.cmd.ps1:New-IISSite -Name "MySite" -BindingInformation "*:80:" -PhysicalPath "C:\inetpub\mysite"  # Create new IIS site
azure_adds_adv_admin_window.cmd.ps1:Remove-IISSite -Name "MySite"  # Delete IIS site
azure_adds_adv_admin_window.cmd.ps1:Start-IISSite -Name "MySite"  # Start site
azure_adds_adv_admin_window.cmd.ps1:Stop-IISSite -Name "MySite"  # Stop site
azure_adds_adv_admin_window.cmd.ps1:Restart-WebAppPool -Name "DefaultAppPool"  # Restart app pool
azure_adds_adv_admin_window.cmd.ps1:Get-WebAppPoolState -Name "DefaultAppPool"  # Check app pool state
azure_adds_adv_admin_window.cmd.ps1:New-WebAppPool -Name "MyPool"  # Create app pool
azure_adds_adv_admin_window.cmd.ps1:Remove-WebAppPool -Name "MyPool"  # Delete app pool
azure_adds_adv_admin_window.cmd.ps1:Get-WebConfigurationProperty -Filter /system.webServer/security/authentication/anonymousAuthentication -Name enabled -PSPath IIS:\  # Check IIS auth settings
azure_adds_adv_admin_window.cmd.ps1:Set-WebConfigurationProperty -Filter /system.webServer/security/authentication/windowsAuthentication -Name enabled -Value True -PSPath IIS:\  # Enable Windows auth
azure_adds_adv_admin_window.cmd.ps1:Get-WebBinding -Name "Default Web Site"  # Show bindings
azure_adds_adv_admin_window.cmd.ps1:New-WebBinding -Name "Default Web Site" -Protocol "https" -Port 443 -CertificateThumbprint <thumb> -CertificateStoreName My  # Add HTTPS binding
azure_adds_adv_admin_window.cmd.ps1:iisreset  # Restart IIS service
azure_adds_adv_admin_window.cmd.ps1:iisreset /stop  # Stop IIS
azure_adds_adv_admin_window.cmd.ps1:iisreset /start  # Start IIS
azure_adds_basic_window.cmd.ps1:ipconfig  # Show basic network configuration
azure_adds_basic_window.cmd.ps1:ipconfig /all  # Show full network configuration
azure_adds_basic_window.cmd.ps1:ipconfig /flushdns  # Clear DNS cache
azure_adds_basic_window.cmd.ps1:ipconfig /registerdns  # Register DNS with domain
azure_adds_basic_window.cmd.ps1:ping hostname  # Test connectivity
azure_adds_basic_window.cmd.ps1:ping 8.8.8.8  # Test internet connectivity
azure_adds_basic_window.cmd.ps1:tracert hostname  # Trace network route
azure_adds_basic_window.cmd.ps1:nslookup hostname  # DNS lookup
azure_adds_basic_window.cmd.ps1:hostname  # Show computer name
azure_adds_basic_window.cmd.ps1:systeminfo  # Show system information
azure_adds_basic_window.cmd.ps1:wmic os get caption  # Show Windows version
azure_adds_basic_window.cmd.ps1:wmic cpu get name  # Show CPU model
azure_adds_basic_window.cmd.ps1:wmic memorychip get capacity  # Show RAM modules
azure_adds_basic_window.cmd.ps1:tasklist  # List running processes
azure_adds_basic_window.cmd.ps1:taskkill /PID 1234 /F  # Kill process by PID
azure_adds_basic_window.cmd.ps1:taskkill /IM notepad.exe /F  # Kill process by name
azure_adds_basic_window.cmd.ps1:netstat -ano  # Show active network connections
azure_adds_basic_window.cmd.ps1:netstat -ano | findstr 3389  # Check if RDP port is listening
azure_adds_basic_window.cmd.ps1:net user  # List local users
azure_adds_basic_window.cmd.ps1:net user username  # Show user details
azure_adds_basic_window.cmd.ps1:net user username password /add  # Create local user
azure_adds_basic_window.cmd.ps1:net user username /delete  # Delete local user
azure_adds_basic_window.cmd.ps1:net localgroup  # List local groups
azure_adds_basic_window.cmd.ps1:net localgroup Administrators  # Show local admin group
azure_adds_basic_window.cmd.ps1:net localgroup Administrators username /add  # Add user to local admin
azure_adds_basic_window.cmd.ps1:net localgroup Administrators username /delete  # Remove user from local admin
azure_adds_basic_window.cmd.ps1:sc query  # Show service status
azure_adds_basic_window.cmd.ps1:sc start <service>  # Start service
azure_adds_basic_window.cmd.ps1:sc stop <service>  # Stop service
azure_adds_basic_window.cmd.ps1:Get-Service  # List services (PowerShell)
azure_adds_basic_window.cmd.ps1:Restart-Service <service>  # Restart service (PowerShell)
azure_adds_basic_window.cmd.ps1:shutdown /r /t 0  # Restart immediately
azure_adds_basic_window.cmd.ps1:shutdown /s /t 0  # Shutdown immediately
azure_adds_basic_window.cmd.ps1:shutdown /a  # Abort shutdown
azure_adds_basic_window.cmd.ps1:dir  # List files
azure_adds_basic_window.cmd.ps1:cd C:\folder  # Change directory
azure_adds_basic_window.cmd.ps1:copy file1 file2  # Copy file
azure_adds_basic_window.cmd.ps1:move file1 file2  # Move file
azure_adds_basic_window.cmd.ps1:del file.txt  # Delete file
azure_adds_basic_window.cmd.ps1:mkdir newfolder  # Create folder
azure_adds_basic_window.cmd.ps1:rmdir folder /s /q  # Delete folder recursively
azure_adds_basic_window.cmd.ps1:powershell  # Open PowerShell
azure_adds_basic_window.cmd.ps1:Get-Help <command>  # Show help for PowerShell command
azure_adds_basic_window.cmd.ps1:Get-Command  # List all PowerShell commands
azure_adds_basic_window.cmd.ps1:gpupdate /force  # Force GPO update
azure_adds_basic_window.cmd.ps1:gpresult /r  # Show applied GPOs
azure_adds_basic_window.cmd.ps1:sfc /scannow  # Scan system files
azure_adds_basic_window.cmd.ps1:DISM /Online /Cleanup-Image /RestoreHealth  # Repair Windows image
azure_adds_basic_window.cmd.ps1:net use  # Show mapped drives
azure_adds_basic_window.cmd.ps1:net use X: \\server\share  # Map network drive
azure_adds_debug_dns.cmd.ps1:ipconfig /all  # View full DNS configuration
azure_adds_debug_dns.cmd.ps1:ipconfig /flushdns  # Clear DNS cache
azure_adds_debug_dns.cmd.ps1:ipconfig /registerdns  # Register computer DNS record in AD
azure_adds_debug_dns.cmd.ps1:nslookup 10.0.1.4  # Reverse lookup Domain Controller
azure_adds_debug_dns.cmd.ps1:nslookup devopsmountain.local  # Forward lookup domain
azure_adds_debug_dns.cmd.ps1:nslookup -type=SRV _ldap._tcp.devopsmountain.local  # Check LDAP SRV records
azure_adds_debug_dns.cmd.ps1:nslookup -type=SRV _kerberos._tcp.devopsmountain.local  # Check Kerberos SRV records
azure_adds_debug_dns.cmd.ps1:Resolve-DnsName devopsmountain.local  # Resolve domain using PowerShell
azure_adds_debug_dns.cmd.ps1:Resolve-DnsName -Type SRV _ldap._tcp.devopsmountain.local  # Resolve LDAP SRV record
azure_adds_debug_dns.cmd.ps1:Resolve-DnsName -Type SRV _kerberos._tcp.devopsmountain.local  # Resolve Kerberos SRV record
azure_adds_debug_dns.cmd.ps1:Get-DnsServerResourceRecord -ZoneName devopsmountain.local  # List DNS records in AD zone (run on DC)
azure_adds_debug_dns.cmd.ps1:Test-NetConnection -ComputerName 10.0.1.4 -Port 53  # Test DNS port connectivity
azure_adds_debug_kerberos.cmd.ps1:klist  # View Kerberos tickets
azure_adds_debug_kerberos.cmd.ps1:klist purge  # Clear all Kerberos tickets
azure_adds_debug_kerberos.cmd.ps1:klist tgt  # View Ticket Granting Ticket (TGT)
azure_adds_debug_kerberos.cmd.ps1:nltest /sc_verify:devopsmountain.local  # Verify secure channel (Kerberos)
azure_adds_debug_kerberos.cmd.ps1:nltest /sc_reset:devopsmountain.local  # Reset secure channel
azure_adds_debug_kerberos.cmd.ps1:Test-ComputerSecureChannel  # Check secure channel status
azure_adds_debug_kerberos.cmd.ps1:Test-ComputerSecureChannel -Repair -Credential (Get-Credential)  # Repair secure channel
azure_adds_debug_kerberos.cmd.ps1:Get-ADDomainController -Discover  # Find DC for Kerberos
azure_adds_debug_kerberos.cmd.ps1:Get-ADUser vmuser -Properties lastLogonTimestamp  # Check Kerberos logon timestamp
azure_adds_debug_kerberos.cmd.ps1:Get-ADComputer VM01 -Properties lastLogonTimestamp  # Check machine Kerberos logon
azure_adds_debug_ldap.cmd.ps1:Test-NetConnection -ComputerName 10.0.1.4 -Port 389  # Test LDAP port
azure_adds_debug_ldap.cmd.ps1:Test-NetConnection -ComputerName 10.0.1.4 -Port 636  # Test LDAPS port
azure_adds_debug_ldap.cmd.ps1:nltest /dsgetdc:devopsmountain.local  # Discover DC via LDAP
azure_adds_debug_ldap.cmd.ps1:nltest /dclist:devopsmountain.local  # List all domain controllers
azure_adds_debug_ldap.cmd.ps1:Get-ADUser vmuser  # LDAP query for user
azure_adds_debug_ldap.cmd.ps1:Get-ADComputer VM01  # LDAP query for computer
azure_adds_debug_ldap.cmd.ps1:Get-ADGroup "Domain Admins"  # LDAP query for group
azure_adds_debug_ldap.cmd.ps1:Get-ADDomainController -Discover  # Find nearest DC
azure_adds_debug_ldap.cmd.ps1:Get-ADRootDSE  # Query LDAP RootDSE
azure_adds_debug_ldap.cmd.ps1:Get-ADObject -LDAPFilter "(sAMAccountName=vmuser)"  # Raw LDAP filter query
azure_adds_debug_ldap.cmd.ps1:repadmin /replsummary  # Check AD replication (LDAP backend)
azure_adds_debug_ldap.cmd.ps1:repadmin /showrepl  # Detailed replication status
azure_adds_debug_network_window.cmd.ps1:Test-NetConnection -ComputerName 10.0.1.4 -Port 88  # Kerberos port
azure_adds_debug_network_window.cmd.ps1:Test-NetConnection -ComputerName 10.0.1.4 -Port 389  # LDAP port
azure_adds_debug_network_window.cmd.ps1:Test-NetConnection -ComputerName 10.0.1.4 -Port 636  # LDAPS port
azure_adds_debug_network_window.cmd.ps1:Test-NetConnection -ComputerName 10.0.1.4 -Port 53  # DNS port
azure_adds_debug_network_window.cmd.ps1:Test-NetConnection -ComputerName 10.0.1.4 -Port 445  # SMB port (required for AD)
azure_adds_debug_network_window.cmd.ps1:Test-NetConnection -ComputerName 10.0.1.4 -Port 135  # RPC port (required for AD)
azure_adds_debug_rdp.cmd.ps1:mstsc /v:hostname  # Open RDP to a specific host
azure_adds_debug_rdp.cmd.ps1:qwinsta  # List active RDP sessions
azure_adds_debug_rdp.cmd.ps1:rwinsta <sessionID>  # Reset an RDP session
azure_adds_debug_rdp.cmd.ps1:logoff <sessionID>  # Log off a remote session
azure_adds_debug_rdp.cmd.ps1:query user  # Show logged-in users
azure_adds_debug_rdp.cmd.ps1:query session  # Show RDP sessions
azure_adds_debug_rdp.cmd.ps1:netstat -ano | findstr 3389  # Check if RDP port is listening
azure_adds_debug_rdp.cmd.ps1:Get-NetFirewallRule -DisplayName "*Remote Desktop*"  # Check RDP firewall rules
azure_adds_debug_rdp.cmd.ps1:Enable-NetFirewallRule -DisplayGroup "Remote Desktop"  # Enable RDP firewall rules
azure_adds_debug_rdp.cmd.ps1:Test-NetConnection -ComputerName hostname -Port 3389  # Test RDP port connectivity
azure_adds_debug_rdp.cmd.ps1:Get-Service TermService  # Check Remote Desktop Services status
azure_adds_debug_rdp.cmd.ps1:Start-Service TermService  # Start RDP service
azure_adds_debug_rdp.cmd.ps1:Stop-Service TermService  # Stop RDP service
azure_adds_debug_rdp.cmd.ps1:Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server" -Name "fDenyTSConnections" -Value 0  # Enable RDP
azure_adds_debug_rdp.cmd.ps1:Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server" -Name "fDenyTSConnections" -Value 1  # Disable RDP
azure_adds_debug_rdp.cmd.ps1:Get-ItemProperty "HKLM:\System\CurrentControlSet\Control\Terminal Server"  # Check RDP registry settings
azure_adds_debug_rdp.cmd.ps1:net localgroup "Remote Desktop Users"  # View RDP group members
azure_adds_debug_rdp.cmd.ps1:Add-LocalGroupMember -Group "Remote Desktop Users" -Member "domain\user"  # Add domain user to RDP group
azure_adds_debug_rdp.cmd.ps1:Remove-LocalGroupMember -Group "Remote Desktop Users" -Member "domain\user"  # Remove domain user from RDP group
azure_adds_debug_rdp.cmd.ps1:secedit /export /cfg C:\secpol.cfg  # Export Local Security Policy
azure_adds_debug_rdp.cmd.ps1:secedit /configure /db C:\Windows\security\local.sdb /cfg C:\secpol.cfg /areas USER_RIGHTS  # Import Local Security Policy
azure_adds_debug_rdp.cmd.ps1:gpupdate /force  # Force GPO update
azure_adds_debug_rdp.cmd.ps1:gpresult /h C:\gp.html  # Generate GPO result report
azure_adds_debug_rdp.cmd.ps1:nltest /sc_verify:devopsmountain.local  # Verify secure channel
azure_adds_debug_rdp.cmd.ps1:nltest /dsgetdc:devopsmountain.local  # Discover Domain Controller
azure_adds_debug_rdp.cmd.ps1:Test-ComputerSecureChannel  # Check secure channel status
azure_adds_debug_rdp.cmd.ps1:Test-ComputerSecureChannel -Repair -Credential (Get-Credential)  # Repair secure channel
azure_adds_debug_rdp.cmd.ps1:runas /user:devopsmountain\vmuser cmd  # Test domain user authentication
azure_adds_debug_rdp.cmd.ps1:Get-ADUser vmuser  # Check domain user exists (run on DC)
azure_adds_debug_rdp.cmd.ps1:Get-ADPrincipalGroupMembership vmuser  # Check user group membership (run on DC)
azure_adds_debug_rdp.cmd.ps1:Test-NetConnection -ComputerName hostname -Port 3389  # Test RDP port
azure_adds_debug_rdp.cmd.ps1:Test-NetConnection -ComputerName hostname -Port 445  # SMB port (required for AD)
azure_adds_debug_rdp.cmd.ps1:Test-NetConnection -ComputerName hostname -Port 135  # RPC port (required for AD)
azure_adds_debug_rdp.cmd.ps1:ping hostname  # Basic connectivity test
azure_adds_debug_rdp.cmd.ps1:tracert hostname  # Trace network path
azure_adds_domain_join_vm.ps1:Add-Computer -DomainName "devopsmountain.local" -Credential (Get-Credential)  # Join computer to domain
azure_adds_domain_join_vm.ps1:Add-Computer -DomainName "devopsmountain.local" -OUPath "OU=Servers,DC=devopsmountain,DC=local" -Credential (Get-Credential)  # Join domain into specific OU
azure_adds_domain_join_vm.ps1:Add-Computer -DomainName "devopsmountain.local" -Restart  # Join domain and reboot automatically
azure_adds_domain_join_vm.ps1:Add-Computer -WorkgroupName "WORKGROUP"  # Remove computer from domain (move to workgroup)
azure_adds_domain_join_vm.ps1:Remove-Computer -UnjoinDomainCredential (Get-Credential) -PassThru -Verbose  # Unjoin domain cleanly
azure_adds_domain_join_vm.ps1:nltest /dsgetdc:devopsmountain.local  # Discover Domain Controller
azure_adds_domain_join_vm.ps1:nltest /sc_verify:devopsmountain.local  # Verify secure channel with domain
azure_adds_domain_join_vm.ps1:nltest /sc_reset:devopsmountain.local  # Reset secure channel
azure_adds_domain_join_vm.ps1:Test-ComputerSecureChannel  # Check secure channel status
azure_adds_domain_join_vm.ps1:Test-ComputerSecureChannel -Repair -Credential (Get-Credential)  # Repair secure channel
azure_adds_domain_join_vm.ps1:Get-WmiObject Win32_ComputerSystem | Select Domain  # Check if machine is joined to domain
azure_adds_domain_join_vm.ps1:Get-ADComputer -Filter *  # List domain-joined computers (run on DC)
azure_adds_domain_join_vm.ps1:Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 10.0.1.4  # Set DNS to Domain Controller
azure_adds_domain_join_vm.ps1:ipconfig /flushdns  # Clear DNS cache
azure_adds_domain_join_vm.ps1:ipconfig /registerdns  # Register computer DNS record in AD
azure_adds_domain_join_vm.ps1:Get-ADDomain  # Show domain info (run on DC)
azure_adds_domain_join_vm.ps1:Get-ADForest  # Show forest info (run on DC)
azure_adds_domain_join_vm.ps1:Get-ADComputer -Identity "VM01" -Properties *  # Inspect domain computer object
azure_adds_domain_join_vm.ps1:Move-ADObject -Identity "CN=VM01,OU=Computers,DC=devopsmountain,DC=local" -TargetPath "OU=Servers,DC=devopsmountain,DC=local"  # Move computer to another OU
azure_adds_gpo.cmd.ps1:Get-GPO -All                                   # List all GPOs in the domain
azure_adds_gpo.cmd.ps1:Get-GPO -Name "MyGPO"                           # Get a specific GPO
azure_adds_gpo.cmd.ps1:New-GPO -Name "MyGPO"                           # Create a new GPO
azure_adds_gpo.cmd.ps1:Remove-GPO -Name "MyGPO"                        # Delete a GPO
azure_adds_gpo.cmd.ps1:Get-GPInheritance -Target "DC=domain,DC=local"  # View GPO links + inheritance for a domain/OU
azure_adds_gpo.cmd.ps1:New-GPLink -Name "MyGPO" -Target "OU=Servers,DC=domain,DC=local"   # Link GPO to OU/domain
azure_adds_gpo.cmd.ps1:Remove-GPLink -Name "MyGPO" -Target "OU=Servers,DC=domain,DC=local" # Remove GPO link
azure_adds_gpo.cmd.ps1:Backup-GPO -Name "MyGPO" -Path C:\Backup        # Backup a GPO
azure_adds_gpo.cmd.ps1:Restore-GPO -Name "MyGPO" -Path C:\Backup       # Restore a GPO
azure_adds_gpo.cmd.ps1:Import-GPO -BackupId <GUID> -TargetName "MyGPO" # Import GPO from backup
azure_adds_gpo.cmd.ps1:Set-GPPermission -Name "MyGPO" -PermissionLevel GpoEdit -TargetName "User1" -TargetType User # Grant edit permissions on a GPO
azure_adds_gpo.cmd.ps1:Get-GPOReport -Name "MyGPO" -ReportType Html -Path C:\report.html # Export GPO settings to HTML/XML
azure_adds_gpo.cmd.ps1:Get-GPOReport -Name "Proxy Policy" -ReportType Xml -Path C:\proxy.xml
azure_adds_gpo.cmd.ps1:notepad C:\proxy.xml
azure_adds_gpo.cmd.ps1:Get-GPOReport -Name "Test GPO" -ReportType Xml -Path C:\proxy.xml
azure_adds_gpo.cmd.ps1:notepad C:\proxy.xml
azure_adds_gpo.cmd.ps1:Get-GPOReport -Name "Test GPO" -ReportType Html -Path C:\test_gpo.html
azure_adds_gpo.cmd.ps1:start C:\test_gpo.html
azure_adds_gpo.cmd.ps1:Get-GPResultantSetOfPolicy -ReportType Html -Path C:\rsop.html # Generate RSoP (Resultant Set of Policy)
azure_adds_gpo.cmd.ps1:gpupdate /force                                  # Force GPO update on local machine
azure_adds_gpo.cmd.ps1:gpresult /h C:\gp.html                            # Generate GPO result report for current user/computer
azure_adds_gpo.cmd.ps1:Set-GPRegistryValue -Name "MyGPO" -Key "HKLM\Software\Test" -ValueName "Setting" -Type String -Value "123" # Modify registry settings inside a GPO
azure_adds_gpo.cmd.ps1:Remove-GPRegistryValue -Name "MyGPO" -Key "HKLM\Software\Test" -ValueName "Setting" # Remove registry value from GPO
azure_adds_gpo.cmd.ps1:Set-GPPrefRegistryValue -Name "MyGPO" -Context Computer -Key "HKLM\Software\Test" -ValueName "Setting" -Type String -Value "123" # Modify Group Policy Preferences registry item
azure_adds_gpo.cmd.ps1:Set-GPPrefFile -Name "MyGPO" -Context Computer -Action Create -Path "C:\test.txt" # Create a file via Group Policy Preferences
azure_adds_gpo.cmd.ps1:Set-GPPrefShortcut -Name "MyGPO" -Context User -Action Create -Name "Chrome" -TargetPath "C:\Program Files\Google\Chrome\Application\chrome.exe" # Create a shortcut via GPP
azure_adds_gpo.cmd.ps1:Set-GPPrefLocalUsersAndGroups -Name "MyGPO" -Context Computer -Action Update -GroupName "Administrators" -Members "domain\user"       # Add domain user/group to local Administrators (GPP method)
azure_adds_gpo.cmd.ps1:(Get-GPO -Name "MyGPO").Computer.DSVersion       # Check GPO version (Computer side)
azure_adds_gpo.cmd.ps1:(Get-GPO -Name "MyGPO").User.DSVersion           # Check GPO version (User side)
azure_adds_gpo.cmd.ps1:gpupdate /force  # Force immediate GPO refresh on local machine
azure_adds_gpo.cmd.ps1:gpresult /h C:\gp.html  # Generate full GPO Resultant Set of Policy report (HTML)
azure_adds_gpo.cmd.ps1:gpresult /r  # Show applied GPOs in console (user + computer)
azure_adds_gpo.cmd.ps1:Get-GPO -All  # List all GPOs in the domain
azure_adds_gpo.cmd.ps1:Get-GPO -Name "MyGPO"  # View a specific GPO
azure_adds_gpo.cmd.ps1:Get-GPOReport -Name "MyGPO" -ReportType Html -Path C:\report.html  # Export GPO settings to HTML
azure_adds_gpo.cmd.ps1:Get-GPInheritance -Target "OU=Servers,DC=domain,DC=local"  # Check GPO inheritance for an OU
azure_adds_gpo.cmd.ps1:Get-GPResultantSetOfPolicy -ReportType Html -Path C:\rsop.html  # Generate RSoP report (PowerShell)
azure_adds_gpo.cmd.ps1:New-GPLink -Name "MyGPO" -Target "OU=Servers,DC=domain,DC=local"  # Link GPO to OU
azure_adds_gpo.cmd.ps1:Remove-GPLink -Name "MyGPO" -Target "OU=Servers,DC=domain,DC=local"  # Remove GPO link
azure_adds_gpo.cmd.ps1:Backup-GPO -Name "MyGPO" -Path C:\Backup  # Backup a GPO
azure_adds_gpo.cmd.ps1:Restore-GPO -Name "MyGPO" -Path C:\Backup  # Restore a GPO
azure_adds_gpo.cmd.ps1:Import-GPO -BackupId <GUID> -TargetName "MyGPO"  # Import GPO from backup
azure_adds_gpo.cmd.ps1:Set-GPPermission -Name "MyGPO" -PermissionLevel GpoEdit -TargetName "domain\admin" -TargetType User  # Grant GPO edit rights
azure_adds_gpo.cmd.ps1:Get-GPPermission -Name "MyGPO" -All  # View GPO permissions
azure_adds_gpo.cmd.ps1:Get-GPO -Guid <GUID>  # Get GPO by GUID
azure_adds_gpo.cmd.ps1:(Get-GPO -Name "MyGPO").Computer.DSVersion  # Check GPO computer version
azure_adds_gpo.cmd.ps1:(Get-GPO -Name "MyGPO").User.DSVersion  # Check GPO user version
azure_adds_gpo.cmd.ps1:Get-DnsServerResourceRecord -ZoneName domain.local  # Verify AD DNS records (GPO relies on DNS)
azure_adds_gpo.cmd.ps1:repadmin /replsummary  # Check AD replication (GPO depends on SYSVOL replication)
azure_adds_gpo.cmd.ps1:repadmin /showrepl  # Detailed replication status
azure_adds_gpo.cmd.ps1:dcdiag /test:sysvolcheck  # Check SYSVOL health (critical for GPO)
azure_adds_gpo.cmd.ps1:dcdiag /test:frssysvol  # Check SYSVOL replication (FRS)
azure_adds_gpo.cmd.ps1:dcdiag /test:dfsrevent  # Check DFS-R replication (newer SYSVOL)
azure_adds_gpo.cmd.ps1:gpresult /r  # Check if GPO is applied
azure_adds_gpo.cmd.ps1:gpresult /h C:\gp.html  # Check if GPO is denied by security filtering or WMI filter
azure_adds_gpo.cmd.ps1:Get-GPInheritance -Target "OU=Servers,DC=domain,DC=local"  # Check if GPO is blocked or overridden
azure_adds_gpo.cmd.ps1:dcdiag /test:sysvolcheck  # Check if SYSVOL is accessible
azure_adds_gpo.cmd.ps1:repadmin /replsummary  # Check replication delays causing GPO not to apply
azure_adds_gpo.cmd.ps1:Test-NetConnection -ComputerName DC01 -Port 445  # Check SMB port required for SYSVOL
azure_adds_gpo.cmd.ps1:Test-NetConnection -ComputerName DC01 -Port 135  # Check RPC port required for GPO processing
azure_adds_gpo.cmd.ps1:secedit /export /cfg C:\secpol.cfg  # Export local security policy
azure_adds_gpo.cmd.ps1:secedit /configure /db C:\Windows\security\local.sdb /cfg C:\secpol.cfg /areas USER_RIGHTS  # Reapply local policy
azure_adds_gpo.cmd.ps1:gpupdate /force  # Reapply GPO after fixing local policy
azure_adds_local_admin.cmd.ps1:Set-GPPrefLocalUsersAndGroups -Name "MyGPO" -Context Computer -Action Update -GroupName "Administrators" -Members "domain\user"  # Add domain user to local Administrators via GPO
azure_adds_local_admin.cmd.ps1:Set-GPPrefLocalUsersAndGroups -Name "MyGPO" -Context Computer -Action Update -GroupName "Administrators" -Members "domain\group"  # Add domain group to local Administrators via GPO
azure_adds_local_admin.cmd.ps1:Get-GPO -Name "MyGPO"  # Check GPO exists
azure_adds_local_admin.cmd.ps1:New-GPO -Name "MyGPO"  # Create new GPO
azure_adds_local_admin.cmd.ps1:New-GPLink -Name "MyGPO" -Target "OU=Servers,DC=domain,DC=local"  # Link GPO to OU
azure_adds_local_admin.cmd.ps1:Get-GPInheritance -Target "OU=Servers,DC=domain,DC=local"  # Check GPO inheritance
azure_adds_local_admin.cmd.ps1:Get-GPOReport -Name "MyGPO" -ReportType Html -Path C:\report.html  # Export GPO report
azure_adds_local_admin.cmd.ps1:gpupdate /force  # Force GPO update on local machine
azure_adds_local_admin.cmd.ps1:gpresult /h C:\gp.html  # Generate GPO result report
azure_adds_local_admin.cmd.ps1:secedit /export /cfg C:\secpol.cfg  # Export Local Security Policy
azure_adds_local_admin.cmd.ps1:secedit /configure /db C:\Windows\security\local.sdb /cfg C:\secpol.cfg /areas USER_RIGHTS  # Import Local Security Policy
azure_adds_local_admin.cmd.ps1:net localgroup "Administrators"  # View local Administrators group
azure_adds_ou.cmd.ps1:Get-ADOrganizationalUnit -Filter * | Select-Object Name, DistinguishedName
azure_adds_ou.cmd.ps1:Get-ADOrganizationalUnit -Filter * | Select-Object -ExpandProperty Name
azure_adds_ou.cmd.ps1:Get-ADOrganizationalUnit -Filter * | Sort-Object DistinguishedName | Format-Table Name, DistinguishedName -AutoSize
azure_adds_ou.cmd.ps1:Get-ADOrganizationalUnit -Filter 'Name -eq "Workstations"'
azure_adds_ou.cmd.ps1:Get-ADComputer -Filter * -SearchBase "OU=Workstations,DC=devopsmountain,DC=local"
azure_adds_status.cmd.ps1:Get-Service NTDS # Get the status of the NTDS (Active Directory Domain Services) service
azure_adds_status.cmd.ps1:Get-ADDomain # Get information about the current Active Directory domain
azure_adds_status.cmd.ps1:Get-Service | Where-Object { $_.DisplayName -like "*Active Directory*" } # Get the status of all Active Directory-related services
azure_adds_status.cmd.ps1:Get-ADDomainController # Get information about the current Active Directory domain controllers
azure_adds_status.cmd.ps1:Get-ADDomainController -Filter * # Get information about all Active Directory domain controllers
azure_adds_status.cmd.ps1:Get-ADForest # Get information about the current Active Directory forest
azure_adds_status.cmd.ps1:Get-DnsServerZone # Get information about the DNS server zones
azure_adds_status.cmd.ps1:Get-DnsServerResourceRecord -ZoneName devopsmountain.local
azure_adds_status.cmd.ps1:Get-WmiObject Win32_ComputerSystem | Select Domain
azure_adds_status.cmd.ps1:dcdiag # Run the Active Directory Domain Services diagnostic tool
azure_adds_status.cmd.ps1:dcdiag /test:dns # Run the DNS test using the Active Directory Domain Services diagnostic tool
azure_adds_status.cmd.ps1:Get-ADUser -Filter * # Get information about all Active Directory users
azure_adds_status.cmd.ps1:Get-ADGroup -Filter * # Get information about all Active Directory groups
azure_adds_status.cmd.ps1:Get-ADOrganizationalUnit -Filter * # Get information about all Active Directory organizational units
azure_adds_user_group.cmd.ps1:New-ADUser -Name "john" -SamAccountName "john" -AccountPassword (Read-Host -AsSecureString) -Enabled $true  # Create a new AD user
azure_adds_user_group.cmd.ps1:Set-ADUser -Identity "john" -PasswordNeverExpires $true  # Modify user properties
azure_adds_user_group.cmd.ps1:Enable-ADAccount -Identity "john"  # Enable a user account
azure_adds_user_group.cmd.ps1:Disable-ADAccount -Identity "john"  # Disable a user account
azure_adds_user_group.cmd.ps1:Remove-ADUser -Identity "john"  # Delete a user account
azure_adds_user_group.cmd.ps1:Get-ADUser -Identity "john"  # Get user details
azure_adds_user_group.cmd.ps1:Get-ADUser -Filter *  # List all users
azure_adds_user_group.cmd.ps1:Get-ADUser -Identity "john" -Properties *  # Get all attributes of a user
azure_adds_user_group.cmd.ps1:Set-ADAccountPassword -Identity "john" -NewPassword (Read-Host -AsSecureString)  # Reset user password
azure_adds_user_group.cmd.ps1:Unlock-ADAccount -Identity "john"  # Unlock a locked user account
azure_adds_user_group.cmd.ps1:Search-ADAccount -LockedOut  # Find locked-out accounts
azure_adds_user_group.cmd.ps1:Search-ADAccount -AccountInactive -TimeSpan 90.00:00:00  # Find inactive accounts (90 days)
azure_adds_user_group.cmd.ps1:Move-ADObject -Identity "CN=john,OU=Users,DC=domain,DC=local" -TargetPath "OU=Admins,DC=domain,DC=local"  # Move user to another OU
azure_adds_user_group.cmd.ps1:New-ADGroup -Name "Server-Admins" -GroupScope Global -GroupCategory Security  # Create a new AD group
azure_adds_user_group.cmd.ps1:Get-ADGroup -Identity "Server-Admins"  # Get group details
azure_adds_user_group.cmd.ps1:Get-ADGroup -Filter *  # List all groups
azure_adds_user_group.cmd.ps1:Set-ADGroup -Identity "Server-Admins" -Description "Admins for all servers"  # Modify group properties
azure_adds_user_group.cmd.ps1:Remove-ADGroup -Identity "Server-Admins"  # Delete a group
azure_adds_user_group.cmd.ps1:Get-ADGroupMember -Identity "Server-Admins"  # List members of a group
azure_adds_user_group.cmd.ps1:Add-ADGroupMember -Identity "Server-Admins" -Members "john"  # Add user to group
azure_adds_user_group.cmd.ps1:Remove-ADGroupMember -Identity "Server-Admins" -Members "john"  # Remove user from group
azure_adds_user_group.cmd.ps1:Get-ADPrincipalGroupMembership -Identity "john"  # List all groups a user belongs to
azure_adds.ref.cmd.ps1:open 'https://learn.microsoft.com/en-us/training/modules/deploy-manage-active-directory-domain-services-domain-controllers/2-define-active-directory-domain-services?source=learn' # Define Active Directory Domain Services
azure_local_user_group.cmd.ps1:New-LocalUser -Name "localuser" -Password (Read-Host -AsSecureString)  # Create local user
azure_local_user_group.cmd.ps1:Remove-LocalUser -Name "localuser"  # Delete local user
azure_local_user_group.cmd.ps1:Get-LocalUser  # List local users
azure_local_user_group.cmd.ps1:Set-LocalUser -Name "localuser" -Description "Test user"  # Modify local user
azure_local_user_group.cmd.ps1:New-LocalGroup -Name "LocalAdmins"  # Create local group
azure_local_user_group.cmd.ps1:Remove-LocalGroup -Name "LocalAdmins"  # Delete local group
azure_local_user_group.cmd.ps1:Get-LocalGroup  # List local groups
azure_local_user_group.cmd.ps1:Get-LocalGroupMember -Group "Administrators"  # List members of a local group
azure_local_user_group.cmd.ps1:Add-LocalGroupMember -Group "Administrators" -Member "localuser"  # Add user to local group
azure_local_user_group.cmd.ps1:Remove-LocalGroupMember -Group "Administrators" -Member "localuser"  # Remove user from local group
azure_local_user_group.cmd.ps1:Add-LocalGroupMember -Group "Administrators" -Member "username"  # Add local user to Administrators
azure_local_user_group.cmd.ps1:Add-LocalGroupMember -Group "Administrators" -Member "domain\user"  # Add domain user to local Administrators
azure_local_user_group.cmd.ps1:Remove-LocalGroupMember -Group "Administrators" -Member "username"  # Remove local user from Administrators
azure_local_user_group.cmd.ps1:Get-LocalGroupMember -Group "Administrators"  # List members of local Administrators group
azure_local_user_group.cmd.ps1:New-LocalUser -Name "localuser" -Password (Read-Host -AsSecureString)  # Create local user
azure_local_user_group.cmd.ps1:Remove-LocalUser -Name "localuser"  # Delete local user
azure_local_user_group.cmd.ps1:New-LocalGroup -Name "LocalAdmins"  # Create local group
azure_local_user_group.cmd.ps1:Remove-LocalGroup -Name "LocalAdmins"  # Delete local group
azure_local_user_group.cmd.ps1:Get-LocalGroup -Name "Administrators"  # View local Administrators group
```
